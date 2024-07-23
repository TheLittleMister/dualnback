import json
import urllib.request
from datetime import datetime, timezone, timedelta

# DJANGO IMPORTS
from django.contrib.auth.forms import AuthenticationForm, PasswordChangeForm
from django.contrib.auth.models import BaseUserManager
from django.conf import settings
from django.db.models import Sum
from django.utils.timezone import make_aware


# INTERNAL IMPORTS
from .forms import *
from .utils import *

# REST FRAMEWORK
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.

# @api_view(["GET"])
# def passwordChangeFormView(request):
#     return Response({"form": PasswordChangeForm(user=None).as_p()})


@api_view(["POST"])
def register(request):
    response = {"errors": list()}
    form = RegistrationForm(data=request.data)

    if form.is_valid():

        if not settings.DEBUG:
            """Begin reCAPTCHA validation"""
            recaptcha_response = request.data.get("g-recaptcha-response")

            if not recaptcha_response:
                response["errors"] += ["Are you a robot?"]
                return Response(response)

            url = "https://www.google.com/recaptcha/api/siteverify"
            values = {
                "secret": settings.GOOGLE_RECAPTCHA_SECRET_KEY,
                "response": recaptcha_response,
            }
            data = urllib.parse.urlencode(values).encode()
            req = urllib.request.Request(url, data=data)
            responseHTTP = urllib.request.urlopen(req)
            result = json.loads(responseHTTP.read().decode())
            """ End reCAPTCHA validation """

            if not result["success"]:
                response["errors"] += ["Invalid reCAPTCHA. Please try again."]
                return Response(response)

        user = form.save()
        user.email = str(BaseUserManager.normalize_email(user.email)).lower()
        user.save()

        refresh = RefreshToken.for_user(user)

        response = {
            "username": user.username,
            "email": user.email,
            "joined": user.date_joined,
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
        }

    else:
        response["errors"] += getFormErrors(form)

    return Response(response)


@api_view(["POST"])
def login(request):
    response = {"errors": list()}
    post = request.data.copy()
    post["username"] = str(post["username"]).strip().lower()
    form = AuthenticationForm(data=post)

    if form.is_valid():
        user = form.get_user()
        refresh = RefreshToken.for_user(user)
        response = {
            "username": user.username,
            "email": user.email,
            "joined": user.date_joined,
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
        }

    else:
        response["errors"] += getFormErrors(form)

    return Response(response)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def account(request):
    response = {"errors": list()}

    put = request.data.copy()
    del put["password"]

    if not request.user.check_password(request.data["password"]):
        response["errors"].append(
            "Your password was entered incorrectly. Please enter it again."
        )

    else:
        form = UserForm(data=put, instance=request.user)

        if form.is_valid():
            user = form.save()
            user.email = str(BaseUserManager.normalize_email(user.email)).lower()
            user.save()

            response = {
                "username": user.username,
                "email": user.email,
            }

        else:
            response["errors"] += getFormErrors(form)

    return Response(response)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def score(request):
    response = {"added": False}

    n = int(request.data["nback"])
    trials = int(request.data["trials"])
    spatial = round(float(request.data["spatialScore"]), 2)
    auditory = round(float(request.data["auditoryScore"]), 2)
    total = round(float(request.data["totalScore"]), 2)
    requiredTrials = n * 20

    if (
        1 <= n <= 99
        and trials >= requiredTrials
        and 0 <= spatial <= 100
        and 0 <= auditory <= 100
        and 0 <= total <= 100
    ):
        latestScore = Score.objects.filter(
            user=request.user
        ).first()  # Inverse Ordering

        if latestScore:
            if (
                datetime.now(timezone.utc) - latestScore.created
            ).total_seconds() >= requiredTrials * 3:
                Score.objects.create(
                    user=request.user,
                    n=n,
                    trials=trials,
                    spatial=spatial,
                    auditory=auditory,
                    total=total,
                )

        else:
            Score.objects.create(
                user=request.user,
                n=n,
                trials=trials,
                spatial=spatial,
                auditory=auditory,
                total=total,
            )

        response["added"] = True

    return Response(response)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def statistics(request):
    """
    This function provides user's statistics.
    """
    response = {
        "data": False,
        "n": 0,
        "sets": 0,
        "trials": 0,
        "spatial": 0,
        "auditory": 0,
        "total": 0,
        "lists": {
            "created_list": list(),
            "trials_list": list(),
            "spatial_list": list(),
            "auditory_list": list(),
            "total_list": list(),
        },
    }

    n = (
        int(request.data["n"])
        if request.data["n"] and request.data["n"].isdigit()
        else 1
    )
    setsFilter = int(request.data["sets"]) if request.data["sets"] else 3
    date = make_aware(
        datetime.strptime(request.data["date"], "%Y-%m-%d") + timedelta(days=1)
    )

    if n < 1:
        n = 1
    elif n > 99:
        n = 99

    sets = 160

    if setsFilter == 1:
        sets = 10
    elif setsFilter == 2:
        sets = 20
    elif setsFilter == 3:
        sets = 40
    elif setsFilter == 4:
        sets = 80

    scores = Score.objects.filter(user=request.user, n=n, created__lte=date).values(
        "trials", "spatial", "auditory", "total", "created"
    )[:sets]

    response["n"] = n
    response["sets"] = setsFilter if 1 <= setsFilter <= 4 else 5

    if scores:
        response["lists"]["created_list"] = list(
            scores.values_list("created", flat=True)
        )[::-1]
        response["lists"]["trials_list"] = list(
            scores.values_list("trials", flat=True)
        )[::-1]
        response["lists"]["spatial_list"] = list(
            scores.values_list("spatial", flat=True)
        )[::-1]
        response["lists"]["auditory_list"] = list(
            scores.values_list("auditory", flat=True)
        )[::-1]
        response["lists"]["total_list"] = list(scores.values_list("total", flat=True))[
            ::-1
        ]

        response["trials"] = scores.aggregate(Sum("trials"))["trials__sum"]

        response["spatial"] = round(
            scores.aggregate(Sum("spatial"))["spatial__sum"] / scores.count(), 2
        )

        response["auditory"] = round(
            scores.aggregate(Sum("auditory"))["auditory__sum"] / scores.count(), 2
        )

        # response["total"] = round(scores.aggregate(
        #     Sum("total"))["total__sum"] / scores.count(), 2)

        response["total"] = round((response["spatial"] + response["auditory"]) / 2, 2)

        response["data"] = True

    return Response(response)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def changePassword(request):
    response = {"errors": list()}

    form = PasswordChangeForm(user=request.user, data=request.data)

    if form.is_valid():
        form.save()  # update_session_auth_hash(request, form.user)

    else:
        response["errors"] += getFormErrors(form)

    return Response(response)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def deleteAccount(request):
    response = {"errors": list()}

    if not request.user.check_password(request.data["password"]):
        response["errors"].append(
            "Your password was entered incorrectly. Please enter it again."
        )

    else:
        request.user.delete()

    return Response(response)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def points(request):
    task = int(request.GET.get("task"))
    points_ = 0

    if 1 <= task <= 99:
        points_ = updatePoints(request.user, task)

    return Response({"points": points_})

@api_view(["GET"])
def leaderboard(request):
    response = {"points": list()}

    n = int(request.GET.get("n"))

    if 1 <= n <= 99:
        response["points"] = list(Points.objects.filter(n=n, points__gt=0).values("user__username", "points")[:50])

    return Response(response)

@api_view(["GET"])
def updateLeaderboard(request):
    n = int(request.GET.get("n"))

    if 1 <= n <= 99:
        for point in Points.objects.filter(n=n)[:50]:
            updatePoints(point.user, n)

    return Response({}, status=status.HTTP_200_OK)