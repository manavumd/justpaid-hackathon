from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class Profile(models.Model):

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    skills = models.CharField(max_length=255, null=True, blank=True)
    experience = models.PositiveIntegerField(null=True, blank=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    specialization = models.CharField(max_length=255, null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    rating = models.FloatField(default=0.0)
    reviews_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class User(AbstractUser):
    ROLE_CHOICES = [
        ('business', 'Business'),
        ('expert', 'Expert'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='business')
