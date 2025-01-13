from django.conf import settings
from django.db import models

# Model for expert availability
class ExpertAvailability(models.Model):
    expert = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="availability")
    day_of_week = models.CharField(
        max_length=10,
        choices=[
            ("monday", "Monday"),
            ("tuesday", "Tuesday"),
            ("wednesday", "Wednesday"),
            ("thursday", "Thursday"),
            ("friday", "Friday"),
            ("saturday", "Saturday"),
            ("sunday", "Sunday"),
        ],
    )
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        unique_together = ("expert", "day_of_week", "start_time", "end_time")

    def __str__(self):
        return f"{self.expert.username} - {self.day_of_week}: {self.start_time} to {self.end_time}"

# Model for appointments
class Appointment(models.Model):
    expert = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="appointments_as_expert")
    business = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="appointments_as_business")
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(
        max_length=20,
        choices=[("confirmed", "Confirmed"), ("cancelled", "Cancelled")],
        default="confirmed",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("expert", "date", "time")

    def __str__(self):
        return f"Appointment: {self.expert.username} with {self.business.username} on {self.date} at {self.time}"
