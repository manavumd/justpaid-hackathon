from django.urls import path
from .views import QuoteListCreateView, QuoteStatusUpdateView

urlpatterns = [
    path('quotes/', QuoteListCreateView.as_view(), name='quote-list-create'),
    path('<int:pk>/', QuoteStatusUpdateView.as_view(), name='quote-status-update'),
]
