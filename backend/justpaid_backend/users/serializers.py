from rest_framework import serializers
from .models import User, Profile

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        if validated_data['role'] == 'expert':
            Profile.objects.create(user=user)
        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['skills', 
            'experience', 
            'hourly_rate', 
            'profile_photo', 
            'description', 
            'specialization', 
            'location', 
            'latitude', 
            'longitude', 
            'rating', 
            'reviews_count']
        read_only_fields = ['rating', 'reviews_count']
    
    def get_profile_photo(self, obj):
        request = self.context.get('request')
        if obj.profile_photo:
            return request.build_absolute_uri(obj.profile_photo.url)
        return None


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True, context={'request': serializers.CurrentUserDefault()})  # Nested profile serializer
    class Meta:
        model = User
        fields = ['id','username', 'email', 'role', 'first_name', 'last_name', 'profile']