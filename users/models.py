from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.utils.translation import gettext_lazy as _

# Create your models here.


class Manager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email or not username:
            raise ValueError("Users must have an email and username")

        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None):
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
    email = models.EmailField(max_length=60, unique=True)
    username = models.CharField(_('username'), max_length=150, unique=True, validators=[
                                UnicodeUsernameValidator()])

    # REQUIRED
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    objects = Manager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", ]

    # class Meta:
    #     ordering = ['field_name']

    # def __str__(self):
    # return f"{self.field_name} {self.field_name}"

    def has_perm(self, perm,  obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


class Score(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="scores")

    n = models.BigIntegerField()
    trials = models.BigIntegerField()
    spatial = models.FloatField()
    auditory = models.FloatField()
    total = models.FloatField()

    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created']
