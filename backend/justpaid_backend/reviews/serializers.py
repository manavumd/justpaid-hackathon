from rest_framework import serializers
from .models import Review
from users.models import User


class ReviewSerializer(serializers.ModelSerializer):
    business = serializers.ReadOnlyField(source='business.username')
    expert = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role='expert'))
    # expert = serializers.ReadOnlyField(source='expert.username')

    class Meta:
        model = Review
        fields = ['id', 'business', 'expert', 'rating', 'comment', 'created_at']
        read_only_fields = ['business', 'created_at']
