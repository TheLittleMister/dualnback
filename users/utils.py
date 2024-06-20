from datetime import datetime, timedelta
from django.utils import timezone
import math

def getFormErrors(form):

    messages = set()

    for key in form.errors.as_data():
        to_append = str(form.errors.as_data()[key][0])[2:-2]
        messages.add(
            "All fields are required."
            if to_append == "This field is required."
            else to_append
        )

    return list(messages)

def calculate_weight(timestamp):
    # Define the decay rate
    decay_rate = 0.015
    
    # Calculate the time difference between now and the timestamp
    time_difference = (datetime.now(timezone.utc) - timestamp).days
    
    # Apply an exponential decay function to calculate the weight
    weight = pow(1 - decay_rate, time_difference)
    
    return weight

def updatePoints(user, n):
    # six_months_ago = datetime.now(timezone.utc) - timedelta(days=180)
    one_year_ago = datetime.now(timezone.utc) - timedelta(days=365)
    scores = user.scores.filter(n=n, total__gt=0, created__gte=one_year_ago)
    weighted_sum = 0

    for score in scores:
        weight = calculate_weight(score.created)
        weighted_sum += score.total * weight * math.log10((score.total * score.trials / 100) + 1)

    # weighted_sum = sum(score.total * calculate_weight(score.created) * math.log10(score.trials + 1) for score in scores)

    # Modification factor based on the number of scores
    modification_factor = math.log(len(scores) + 1)

    # Apply the modification factor
    adjusted_weighted_sum = weighted_sum * modification_factor

    # Update the user's points
    # points, created = Points.objects.get_or_create(user=user, n=n)
    points, created = user.points.get_or_create(n=n)
    points.points = adjusted_weighted_sum / 10
    points.save()

    return points.points