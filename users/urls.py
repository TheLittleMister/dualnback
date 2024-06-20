from django.urls import path
from .views import *

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

app_name = "users"

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("register/", register, name="register"),
    path("login/", login, name="login"),
    path("account/", account, name="account"),
    path("score/", score, name="score"),
    path("statistics/", statistics, name="statistics"),
    path("leaderboard/", leaderboard, name="leaderboard"),
    path("updateLeaderboard/", updateLeaderboard, name="updateLeaderboard"),
    path("points/", points, name="points"),
    path("change_password/", changePassword, name="change_password"),
    path("delete_account/", deleteAccount, name="delete_account"),
]
