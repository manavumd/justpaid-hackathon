from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from quotes.models import Quote
from search.models import SavedSearch
from reviews.models import Review
from .serializers import QuoteSerializer, SavedSearchSerializer, ReviewSerializer

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        if user.role == 'business':
            # Business Dashboard
            sent_quotes = Quote.objects.filter(business=user)
            saved_searches = SavedSearch.objects.filter(user=user)
            return Response({
                "sent_quotes": QuoteSerializer(sent_quotes, many=True).data,
                "saved_searches": SavedSearchSerializer(saved_searches, many=True).data,
            })

        elif user.role == 'expert':
            # Expert Dashboard
            received_quotes = Quote.objects.filter(expert=user)
            reviews = Review.objects.filter(expert=user)
            return Response({
                "received_quotes": QuoteSerializer(received_quotes, many=True).data,
                "reviews": ReviewSerializer(reviews, many=True).data,
            })

        return Response({"detail": "Invalid role."}, status=400)
