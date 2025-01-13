from datetime import datetime, timedelta
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ExpertAvailability, Appointment
from .serializers import ExpertAvailabilitySerializer, AppointmentSerializer
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError



DAY_OF_WEEK_MAP = {
    0: "monday",
    1: "tuesday",
    2: "wednesday",
    3: "thursday",
    4: "friday",
    5: "saturday",
    6: "sunday",
}

# View for managing expert availability
class ExpertAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        expert = request.user
        if expert.role != "expert":
            return Response({"error": "Only experts can view availability."}, status=status.HTTP_403_FORBIDDEN)

        slots = ExpertAvailability.objects.filter(expert=expert).order_by('day_of_week', 'start_time')
        serializer = ExpertAvailabilitySerializer(slots, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = request.data
        if isinstance(data, dict):  # Handle single slot
            data = [data]

        serializer = ExpertAvailabilitySerializer(data=data, many=True)
        if serializer.is_valid():
            expert = request.user

            # Delete all existing slots for the expert
            ExpertAvailability.objects.filter(expert=expert).delete()

            # Process new slots and merge overlaps
            validated_data = serializer.validated_data
            validated_data = sorted(validated_data, key=lambda x: (x['day_of_week'], x['start_time']))

            merged_slots = []
            for slot in validated_data:
                slot['expert'] = expert

                if not merged_slots:
                    merged_slots.append(slot)
                else:
                    last_slot = merged_slots[-1]
                    # Check if the current slot overlaps or is adjacent to the last slot
                    if (
                        slot['day_of_week'] == last_slot['day_of_week'] and
                        slot['start_time'] <= last_slot['end_time']  # Overlap or adjacent
                    ):
                        # Merge slots
                        last_slot['end_time'] = max(last_slot['end_time'], slot['end_time'])
                    else:
                        # Add non-overlapping slot
                        merged_slots.append(slot)

            # Bulk create merged slots
            ExpertAvailability.objects.bulk_create(
                [ExpertAvailability(**slot) for slot in merged_slots]
            )

            # Fetch and return the updated slots
            updated_slots = ExpertAvailability.objects.filter(expert=expert).order_by('day_of_week', 'start_time')
            return Response(
                ExpertAvailabilitySerializer(updated_slots, many=True).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View for deleting availability slots
class DeleteAvailabilityView(generics.DestroyAPIView):
    serializer_class = ExpertAvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ExpertAvailability.objects.filter(expert=self.request.user)

# View for managing appointments
class AppointmentView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "business":
            return Appointment.objects.filter(business=user)
        return Appointment.objects.filter(expert=user)

    def perform_create(self, serializer):
        expert = serializer.validated_data['expert']
        date = serializer.validated_data['date']
        time = serializer.validated_data['time']

        # Check if the requested time slot exists in the expert's availability
        day_of_week = date.strftime("%A").lower()  # Get day of the week (e.g., "monday")
        availability = ExpertAvailability.objects.filter(
            expert=expert, 
            day_of_week=day_of_week,
            start_time__lte=time,
            end_time__gt=time
        )

        if not availability.exists():
            raise ValidationError("This time slot is not available in the expert's schedule.")

        # Check for duplicate appointments
        if Appointment.objects.filter(expert=expert, date=date, time=time).exists():
            raise ValidationError("This time slot is already booked.")

        # Save the appointment
        serializer.save(business=self.request.user)


# View for fetching available slots
class AvailableSlotsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, expert_id):
        # Parse date from query parameters
        date_str = request.query_params.get('date')
        if not date_str:
            return Response({"error": "Date is required."}, status=400)

        try:
            # Convert date string to a datetime object
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

        # Map integer weekday to string
        day_of_week = DAY_OF_WEEK_MAP[date.weekday()]

        # Fetch availability for the given day of the week
        availability = ExpertAvailability.objects.filter(expert_id=expert_id, day_of_week=day_of_week)
        booked_slots = Appointment.objects.filter(expert_id=expert_id, date=date).values_list('time', flat=True)

        # Calculate available slots
        slots = []
        for slot in availability:
            current_time = datetime.combine(date, slot.start_time)  # Convert to datetime
            end_time = datetime.combine(date, slot.end_time)  # Convert to datetime
            while current_time < end_time:
                if current_time.time() not in booked_slots:  # Compare only the time part
                    slots.append({"time": current_time.time().strftime('%H:%M')})
                current_time += timedelta(minutes=30)

        return Response(slots)
    
class CustomDateAvailabilityView(APIView):
    """
    API to fetch available slots for specific dates provided by the frontend.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, expert_id):
        # Parse the list of dates from query parameters
        date_strs = request.query_params.getlist("dates")
        if not date_strs:
            return Response({"error": "Dates are required as a list in the query parameters."}, status=400)

        try:
            # Convert date strings to date objects
            dates = [datetime.strptime(date_str, '%Y-%m-%d').date() for date_str in date_strs]
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

        # Map integer weekday to string
        day_of_week_map = {
            0: "monday",
            1: "tuesday",
            2: "wednesday",
            3: "thursday",
            4: "friday",
            5: "saturday",
            6: "sunday",
        }

        result = []
        for date in dates:
            day_of_week = day_of_week_map[date.weekday()]

            # Fetch expert availability for the day
            availability = ExpertAvailability.objects.filter(
                expert_id=expert_id, day_of_week=day_of_week
            )
            booked_slots = Appointment.objects.filter(
                expert_id=expert_id, date=date
            ).values_list("time", flat=True)

            # Calculate available slots
            slots = []
            for slot in availability:
                current_time = datetime.combine(date, slot.start_time)
                end_time = datetime.combine(date, slot.end_time)
                while current_time < end_time:
                    if current_time.time() not in booked_slots:
                        slots.append(current_time.time().strftime("%H:%M"))
                    current_time += timedelta(minutes=30)

            result.append({
                "date": date.strftime("%Y-%m-%d"),
                "appointments": len(slots),
                "slots": slots
            })

        return Response(result, status=200)
