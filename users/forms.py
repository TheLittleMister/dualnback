from django import forms
from .models import *
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.validators import UnicodeUsernameValidator


class RegistrationForm(UserCreationForm):
    email = forms.EmailField(
        max_length=60, label="Email")

    class Meta:
        model = User
        fields = ("username", "email")

    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get("username")

        user_valid = UnicodeUsernameValidator()
        user_valid(username)

        if not username or not username.islower():
            raise forms.ValidationError("Username must be in lowercase")


class UserForm(forms.ModelForm):
    email = forms.EmailField(
        max_length=60, label="Email")

    class Meta:
        model = User
        fields = ("username", "email")

    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get("username")

        user_valid = UnicodeUsernameValidator()
        user_valid(username)

        if not username or not username.islower():
            raise forms.ValidationError("Username must be in lowercase")
