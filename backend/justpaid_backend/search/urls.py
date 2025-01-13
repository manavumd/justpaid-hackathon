from django.urls import path
from .views import ExpertSearchView,SavedSearchListCreateView, SavedSearchDetailView

urlpatterns = [
    path('experts/', ExpertSearchView.as_view(), name='expert-search'),
    path('saved-searches/', SavedSearchListCreateView.as_view(), name='saved-search-list-create'),
    path('saved-searches/<int:pk>/', SavedSearchDetailView.as_view(), name='saved-search-detail'),
]
