from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Quote
from .serializers import QuoteSerializer, QuoteStatusUpdateSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class QuoteListCreateView(generics.ListCreateAPIView):
    serializer_class = QuoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'business':
            return Quote.objects.filter(business=self.request.user)
        elif self.request.user.role == 'expert':
            return Quote.objects.filter(expert=self.request.user)
        return Quote.objects.none()

    def perform_create(self, serializer):
        if self.request.user.role != 'business':
            raise PermissionDenied("Only businesses can send quote requests.")
        serializer.save(business=self.request.user)


class QuoteStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk, *args, **kwargs):
        try:
            quote = Quote.objects.get(pk=pk, expert=request.user)
        except Quote.DoesNotExist:
            return Response({"detail": "Quote not found or you do not have permission to update it."}, status=status.HTTP_404_NOT_FOUND)

        serializer = QuoteStatusUpdateSerializer(quote, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Quote status updated successfully.", "quote": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)