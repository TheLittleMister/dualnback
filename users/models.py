# MODEL IMPORTS
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _


# RESET PASSWORD IMPORTS
from django.core.mail import send_mail
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse

from django_rest_passwordreset.signals import reset_password_token_created

# Create your models here.


class Manager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email or not username or not password:
            raise ValueError("Users must have an email, username and password")

        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None):
        if not username or not password:
            raise ValueError("Superusers must have an username and password")
        
        user = self.create_user(
            email=self.normalize_email(email),
            username=username,
            password=password,
        )

        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    email = models.EmailField(max_length=60, validators=[validate_email], unique=True)
    username = models.CharField(
        max_length=150,
        unique=True,
        validators=[UnicodeUsernameValidator()],
    )

    # REQUIRED
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    objects = Manager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = [
        "username",
    ]

    # class Meta:
    #     ordering = ['field_name']

    # def __str__(self):
    # return f"{self.field_name} {self.field_name}"

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


class Score(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="scores")

    n = models.BigIntegerField()
    trials = models.BigIntegerField()
    spatial = models.FloatField()
    auditory = models.FloatField()
    total = models.FloatField()

    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created"]

class Points(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="points")
    
    n = models.BigIntegerField()
    points = models.FloatField(default=0.0)

    class Meta:
        ordering = ["-points"]

# RESET PASSWORD EMAIL


@receiver(reset_password_token_created)
def password_reset_token_created(
    sender, instance, reset_password_token, *args, **kwargs
):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """
    # send an e-mail to the user
    context = {
        # "current_user": reset_password_token.user,
        # "email": reset_password_token.user.email,
        "username": reset_password_token.user.username,
        "reset_password_url": "{}{}".format(
            instance.request.build_absolute_uri(
                reverse("password_reset:reset-password-confirm")
            ),
            reset_password_token.key,
        ).replace("api/", ""),
    }

    # render email text
    email_html_message = render_to_string("email.html", context)
    email_plaintext_message = render_to_string("email.txt", context)

    send_mail(
        # title:
        "Password reset for {title}".format(title="Dual N-Back"),
        # message:
        email_plaintext_message,
        # from:
        "dualnbackproject@gmail.com",
        # to:
        [reset_password_token.user.email],
        # html message:
        html_message=email_html_message,
    )
