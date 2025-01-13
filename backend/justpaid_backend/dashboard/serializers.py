from rest_framework import serializers
from quotes.models import Quote
from search.models import SavedSearch
from reviews.models import Review

# Serializer for Quotes
# class QuoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Quote
#         fields = ['id', 'message', 'status', 'created_at', 'business', 'expert']

class QuoteSerializer(serializers.ModelSerializer):
    expert_name = serializers.SerializerMethodField()
    expert_id = serializers.SerializerMethodField()
    business_name = serializers.SerializerMethodField()

    class Meta:
        model = Quote
        fields = ['id', 'message', 'status', 'created_at', 'expert_name', 'business_name', 'expert_id']

    def get_expert_name(self, obj):
        if obj.expert:
            return f"{obj.expert.first_name} {obj.expert.last_name}"
        return None

    def get_expert_id(self, obj):
        if obj.expert:
            return obj.expert.id
        return None

    def get_business_name(self, obj):
        if obj.business:
            return f"{obj.business.first_name} {obj.business.last_name}"
        return None

# Serializer for Saved Searches
class SavedSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedSearch
        fields = ['id', 'name', 'filters', 'created_at']

# Serializer for Reviews
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'rating', 'comment', 'created_at', 'business', 'expert']
