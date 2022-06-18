# import json
# from django import template
# from django.conf import settings
# register = template.Library()

# if not settings.DEBUG:
#     with open ("/etc/config.json") as config_file:
#         config = json.load(config_file)

# else:
#     config = {"GOOGLEADSCLIENT": "_", "GOOGLEANALYTICSID": "_", "PAYPALVALUE": "_"}

# my_site = "http://127.0.0.1:8000" if settings.DEBUG else "https://" + \
#     settings.ALLOWED_HOSTS[0]


# @register.simple_tag
# def get_google_ads_client():
#     return config.get("GOOGLEADSCLIENT")


# @register.simple_tag
# def get_google_analytics_id():
#     return config.get("GOOGLEANALYTICSID")


# @register.simple_tag
# def get_paypal_value():
#     return config.get("PAYPALVALUE")


# @register.simple_tag
# def get_recaptcha_site_key():
#     return settings.GOOGLE_RECAPTCHA_SITE_KEY


# @register.simple_tag
# def get_site():
#     return my_site


# @register.simple_tag
# def active_debug():
#     return settings.DEBUG
