from rest_framework import serializers
from .models import Quote
from users.models import User


class QuoteSerializer(serializers.ModelSerializer):
    business = serializers.ReadOnlyField(source='business.username')  # Display username for business
    expert = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role='expert'))  # Display username for expert

    class Meta:
        model = Quote
        fields = ['id', 'business', 'expert', 'message', 'status', 'created_at']
        read_only_fields = ['status', 'business', 'created_at']

class QuoteStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = ['status']

    def validate_status(self, value):
        if value not in ['accepted', 'declined']:
            raise serializers.ValidationError("Invalid status. Allowed values are 'accepted' or 'declined'.")
        return value
