from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from users.models import Profile
from .serializers import ExpertProfileSerializer, SavedSearchSerializer
from .permissions import IsBusinessUser
from .models import SavedSearch
from django.db.models.functions import Sqrt, Power, ACos, Cos, Radians, Sin
from django.db.models import F, FloatField



class ExpertSearchView(ListAPIView):
    queryset = Profile.objects.filter(user__role='expert')
    serializer_class = ExpertProfileSerializer
    permission_classes = [IsBusinessUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    # Filters
    filterset_fields = {
        'hourly_rate': ['gte', 'lte'],  # Range filter
        'experience': ['gte'],         # Minimum years of experience
        'rating': ['gte'],             # Minimum rating
    }
    search_fields = ['skills', 'user__first_name', 'user__last_name', 'specialization']  # General keyword search
    ordering_fields = ['hourly_rate', 'experience', 'rating', 'distance']  # Sortable fields, including distance

    def get_queryset(self):
        """
        Apply proximity filtering if latitude and longitude are provided.
        """
        queryset = super().get_queryset()
        latitude = self.request.query_params.get('latitude', None)
        longitude = self.request.query_params.get('longitude', None)
        radius = float(self.request.query_params.get('radius', 50))  # Default radius: 10 miles

        if latitude and longitude:
            # Haversine formula for distance calculation
            latitude = float(latitude)
            longitude = float(longitude)

            # Earth's radius in miles
            earth_radius = 3958.8

            queryset = queryset.annotate(
                distance=earth_radius * ACos(
                    Cos(Radians(latitude)) * Cos(Radians(F('latitude'))) *
                    Cos(Radians(F('longitude')) - Radians(longitude)) +
                    Sin(Radians(latitude)) * Sin(Radians(F('latitude')))
                )
            ).filter(distance__lte=radius).order_by('distance')

        return queryset

class SavedSearchListCreateView(ListCreateAPIView):
    serializer_class = SavedSearchSerializer
    permission_classes = [IsBusinessUser]

    def get_queryset(self):
        return SavedSearch.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SavedSearchDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = SavedSearchSerializer
    permission_classes = [IsBusinessUser]

    def get_queryset(self):
        return SavedSearch.objects.filter(user=self.request.user)