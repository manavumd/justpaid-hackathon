from rest_framework import serializers
from users.models import Profile, User
from .models import SavedSearch

class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name','last_name']  # Include any other user fields you need

class ExpertProfileSerializer(serializers.ModelSerializer):
    user = UserDetailsSerializer()
    distance = serializers.FloatField(required=False)  # Distance (in miles) from the user's location
    proximity_score = serializers.SerializerMethodField()  # Score for frontend sorting

    class Meta:
        model = Profile
        fields = [
            'user', 'skills', 
            'experience', 
            'hourly_rate', 
            'profile_photo', 
            'description', 
            'specialization', 
            'location', 
            'latitude', 
            'longitude', 
            'rating', 
            'reviews_count',
            'distance', 'proximity_score',
        ]

    def get_proximity_score(self, obj):
        # Proximity score is inversely proportional to distance
        if hasattr(obj, 'distance') and obj.distance > 0:
            return 1 / obj.distance
        return None


class SavedSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedSearch
        fields = ['id', 'name', 'filters', 'created_at']