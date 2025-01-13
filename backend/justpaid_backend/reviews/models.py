from django.db import models
from django.conf import settings
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from users.models import Profile

class Review(models.Model):
    business = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews_given')
    expert = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews_received')
    rating = models.PositiveSmallIntegerField()  # Rating out of 5
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.business.username} for {self.expert.username}"

    # class Meta:
    #     unique_together = ('business', 'expert')  # Ensure one review per business-expert pair

@receiver(post_save, sender=Review)
@receiver(post_delete, sender=Review)
def update_expert_rating(sender, instance, **kwargs):
    expert = instance.expert
    reviews = Review.objects.filter(expert=expert)
    if reviews.exists():
        average_rating = reviews.aggregate(models.Avg('rating'))['rating__avg']
        reviews_count = reviews.count()
        expert.profile.rating = round(average_rating, 2)
        expert.profile.reviews_count = reviews_count
    else:
        expert.profile.rating = 0
    expert.profile.save()