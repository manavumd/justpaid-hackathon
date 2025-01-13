from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Review
from .serializers import ReviewSerializer
from search.permissions import IsBusinessUser
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import google.generativeai as genai
from .models import Review
from django.contrib.auth import get_user_model

User = get_user_model()

class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'business':
            return Review.objects.filter(business=self.request.user)
        elif self.request.user.role == 'expert':
            return Review.objects.filter(expert=self.request.user)
        return Review.objects.none()

    def perform_create(self, serializer):
        if self.request.user.role != 'business':
            raise PermissionDenied("Only business users can leave reviews.")
        serializer.save(business=self.request.user)


# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

class ReviewSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, expert_id):
        try:
            # Fetch all reviews for the specified expert
            expert = User.objects.filter(id=expert_id, role='expert').first()
            if not expert:
                return Response({"error": "Expert not found."}, status=status.HTTP_404_NOT_FOUND)

            reviews = Review.objects.filter(expert=expert)
            if not reviews.exists():
                return Response({"summary": "No reviews available for this expert."}, status=status.HTTP_200_OK)

            # Prepare reviews for summarization
            review_texts = "\n".join([f"- {review.comment}" for review in reviews])

            # Generate summary using Gemini
            prompt = (
                f"""You are an AI agent tasked with summarizing reviews submitted by businesses to financial experts.
                In this case, the expert's name is {expert.first_name} {expert.last_name}.
                Summarize the following reviews in third person, highlighting the key insights:\n\n{review_texts}"""
            )

            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    max_output_tokens=100,
                    temperature=0.7,
                )
            )

            summary = response.text.strip() if response else "Error generating summary."
            return Response({"summary": summary}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)