from django.urls import path
from .views import *

from django.urls import reverse_lazy
from django.contrib.auth import views as auth_views


app_name = "users"

urlpatterns = [
    path("", index, name="index"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("account/", account, name="account"),
    path("delete/", delete, name="delete"),
    path("score/", score, name="score"),
    path("statistics/", statistics, name="statistics"),

    path('change-password/', auth_views.PasswordChangeView.as_view(template_name='password_reset_form.html',
         success_url=reverse_lazy('users:change-password-done')), name="change-password"),
    path('change-password-done/', auth_views.PasswordChangeDoneView.as_view(
        template_name='password_reset_done.html'), name="change-password-done"),

]
