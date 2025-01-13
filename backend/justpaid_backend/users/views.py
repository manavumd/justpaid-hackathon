from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from .serializers import RegisterSerializer, ProfileSerializer, UserSerializer
from .models import Profile, User
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from reviews.serializers import ReviewSerializer
from reviews.models import Review



class RegisterView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Only experts can access profiles
        if self.request.user.role != 'expert':
            raise PermissionDenied("Only experts have profiles.")
        return self.request.user.profile
    
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)
    
class ExpertDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, expert_id, *args, **kwargs):
        try:
            # Fetch expert user details
            expert_user = User.objects.get(id=expert_id, role='expert')

            # Fetch expert profile
            profile = Profile.objects.get(user=expert_user)

            # Fetch reviews for the expert
            reviews = Review.objects.filter(expert=expert_user)

            # Prepare response data
            response_data = {
                "user": UserSerializer(expert_user,context={'request': request}).data,
                "profile": ProfileSerializer(profile).data,
                "reviews": ReviewSerializer(reviews, many=True).data,
            }

            return Response(response_data, status=200)
        except User.DoesNotExist:
            return Response({"error": "Expert not found."}, status=404)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found for this expert."}, status=404)