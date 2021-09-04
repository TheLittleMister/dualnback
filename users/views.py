import json
import urllib
from datetime import datetime, timezone, timedelta

# DJANGO IMPORTS
from django.shortcuts import render
from django.http import JsonResponse, HttpResponseRedirect
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import BaseUserManager
from django.conf import settings
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.middleware.csrf import get_token
from django.urls import reverse
from django.db.models import Sum, Value
from django.utils.timezone import make_aware
from django.db.models.functions import Substr

# INTERNAL IMPORTS
from .forms import *
from .utils import *

# Create your views here.


def index(request):
    """
        This function registers a new user if POST
        else it just renders index.html
    """
    if request.method == "POST":

        my_response = {
            "created": False,
            "messages": list(),
            "id": None,
            "username": None,
        }
        form = RegistrationForm(request.POST)

        if form.is_valid():

            if not settings.DEBUG:

                ''' Begin reCAPTCHA validation '''
                recaptcha_response = request.POST.get('g-recaptcha-response')
                url = 'https://www.google.com/recaptcha/api/siteverify'
                values = {
                    'secret': settings.GOOGLE_RECAPTCHA_SECRET_KEY,
                    'response': recaptcha_response
                }
                data = urllib.parse.urlencode(values).encode()
                req = urllib.request.Request(url, data=data)
                response = urllib.request.urlopen(req)
                result = json.loads(response.read().decode())
                ''' End reCAPTCHA validation '''

                if result['success']:
                    user = form.save()

                    user.email = str(
                        BaseUserManager.normalize_email(user.email)).lower()

                    user.save()
                    login(request, user)

                    my_response["username"] = get_username(user.username)
                    my_response["id"] = user.id
                    my_response["created"] = True
                    my_response["csrf"] = get_token(request)

                else:
                    my_response["messages"].append(
                        'Invalid reCAPTCHA. Please try again.')

            else:
                user = form.save()

                user.email = str(
                    BaseUserManager.normalize_email(user.email)).lower()

                user.save()
                login(request, user)

                my_response["username"] = get_username(user.username)
                my_response["id"] = user.id
                my_response["created"] = True
                my_response["csrf"] = get_token(request)

        else:
            my_response["messages"] += get_form_messages(form)

        return JsonResponse(my_response, status=200)

    else:
        return render(request, "index.html", {
            "register_form": RegistrationForm(),
            "csrf": get_token(request)
        })


def login_view(request):
    """
        This function logs a user in if POST
        else it just provides a Log In Form
    """
    if request.method == 'POST':

        response = {
            "messages": list(),
            "id": None,
            "username": None,
            "done": False,
        }

        post = request.POST.copy()
        post["username"] = str(post["username"]).strip().lower()

        form = AuthenticationForm(data=post)

        if form.is_valid():
            user = form.get_user()
            login(request, user)
            response["id"] = user.id
            response["username"] = get_username(user.username)
            response["done"] = True
            response["csrf"] = get_token(request)

        else:
            response["messages"] += get_form_messages(form)

    else:
        response = {
            "form": AuthenticationForm().as_p()
        }

    return JsonResponse(response, status=200)


@login_required
def logout_view(request):
    """
        This function logs the user out
    """
    logout(request)
    return HttpResponseRedirect("/")


@login_required
def account(request):
    """
        This function edits user information if POST
        else it just provide an edit user form.
    """

    if request.method == "POST":

        response = {
            "messages": list(),
            "done": False,
            "id": None,
            "username": None,
            "done": False,
        }

        form = UserForm(request.POST, instance=request.user)

        if form.is_valid():
            user = form.save()
            user.email = str(
                BaseUserManager.normalize_email(user.email)).lower()
            user.save()

            response["id"] = user.id
            response["username"] = get_username(user.username)
            response["done"] = True
            response["csrf"] = get_token(request)

        else:
            response["messages"] += get_form_messages(form)

    else:
        response = {
            "form": UserForm(instance=request.user).as_p(),
            "csrf": get_token(request)
        }

    return JsonResponse(response, status=200)


@login_required
def delete(request):
    """
        This function deletes currentn logged in user.
    """
    request.user.delete()
    return HttpResponseRedirect(reverse("users:index"))


def score(request):
    """
        This function saves user's score if logged in.
    """
    response = {
        "added": False,
        "csrf": get_token(request),
    }

    if request.method == "POST":

        if request.user.is_authenticated:

            n = int(request.POST.get("n"))
            trials = int(request.POST.get("trials"))
            spatial = round(float(request.POST.get("spatial")), 2)
            auditory = round(float(request.POST.get("auditory")), 2)
            total = round(float(request.POST.get("total")), 2)
            requiredTrials = n * 20

            if 1 <= n <= 100 and trials >= requiredTrials and 0 <= spatial <= 100 and 0 <= auditory <= 100 and 0 <= total <= 100:
                latestScore = Score.objects.filter(
                    user=request.user).first()  # Inverse Ordering

                if latestScore:
                    if (datetime.now(timezone.utc)-latestScore.created).total_seconds() >= requiredTrials * 3:
                        Score.objects.create(
                            user=request.user, n=n, trials=trials, spatial=spatial, auditory=auditory, total=total)
                        response["added"] = True

                else:
                    Score.objects.create(
                        user=request.user, n=n, trials=trials, spatial=spatial, auditory=auditory, total=total)
                    response["added"] = True

    return JsonResponse(response, status=200)


@login_required
def statistics(request):
    """
        This function provides user's statistics.
    """
    response = {
        "data": False,
        "scores": None,
        "n": None,
        "sets": None,
        "trials": None,
        "spatial": None,
        "auditory": None,
        "total": None,
        "messages": list(),
    }

    n = int(request.GET.get("n")) if request.GET.get(
        "n") and request.GET.get("n").isdigit() else 1
    setsFilter = int(request.GET.get("sets")) if request.GET.get("sets") else 3
    date = make_aware(datetime.strptime(request.GET.get(
        "date"), "%Y-%m-%d") + timedelta(days=1))

    if n < 1:
        n = 1
    elif n > 100:
        n = 100

    sets = 160

    if setsFilter == 1:
        sets = 10
    elif setsFilter == 2:
        sets = 20
    elif setsFilter == 3:
        sets = 40
    elif setsFilter == 4:
        sets = 80

    scores = Score.objects.filter(
        user=request.user, n=n, created__lte=date).values("trials", "spatial", "auditory", "total", "created")[:sets]

    response["n"] = n
    response["sets"] = setsFilter if 1 <= setsFilter <= 4 else 5

    if scores:
        response["created_list"] = list(
            scores.values_list("created", flat=True))[::-1]
        response["trials_list"] = list(
            scores.values_list("trials", flat=True))[::-1]
        response["spatial_list"] = list(
            scores.values_list("spatial", flat=True))[::-1]
        response["auditory_list"] = list(
            scores.values_list("auditory", flat=True))[::-1]
        response["total_list"] = list(
            scores.values_list("total", flat=True))[::-1]

        response["trials"] = scores.aggregate(Sum("trials"))["trials__sum"]

        response["spatial"] = round(scores.aggregate(
            Sum("spatial"))["spatial__sum"] / scores.count(), 2)

        response["auditory"] = round(scores.aggregate(
            Sum("auditory"))["auditory__sum"] / scores.count(), 2)

        # response["total"] = round(scores.aggregate(
        #     Sum("total"))["total__sum"] / scores.count(), 2)

        response["total"] = round(
            (response["spatial"] + response["auditory"]) / 2, 2)

        response["data"] = True

    return JsonResponse(response, status=200)
