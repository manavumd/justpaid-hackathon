from rest_framework import serializers
from .models import ExpertAvailability, Appointment

class ExpertAvailabilitySerializer(serializers.ModelSerializer):
    expert = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = ExpertAvailability
        fields = ['id', 'expert', 'day_of_week', 'start_time', 'end_time']

class AppointmentSerializer(serializers.ModelSerializer):
    business = serializers.PrimaryKeyRelatedField(read_only=True)
    business_name = serializers.SerializerMethodField()
    class Meta:
        model = Appointment
        fields = ['id', 'expert', 'business', 'date', 'time', 'status', 'created_at', 'business_name']

    def get_business_name(self, obj):
        return f"{obj.business.first_name} {obj.business.last_name}" if obj.business else None
