from django.urls import path
from .views import (
    ExpertAvailabilityView,
    DeleteAvailabilityView,
    AppointmentView,
    AvailableSlotsView,
    CustomDateAvailabilityView
)

urlpatterns = [
    path('availability/', ExpertAvailabilityView.as_view(), name='expert-availability'),
    path('availability/<int:pk>/', DeleteAvailabilityView.as_view(), name='delete-availability'),
    path('appointments/', AppointmentView.as_view(), name='appointments'),
    path('availability/slots/<int:expert_id>/', AvailableSlotsView.as_view(), name='available-slots'),
    path('availability-custom-dates/<int:expert_id>/', CustomDateAvailabilityView.as_view(), name="custom-date-availability"),
]
