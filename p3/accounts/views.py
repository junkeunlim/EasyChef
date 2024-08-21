
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.authentication import JWTAuthentication
from accounts.serializers import UserSerializer, LoginSerializer
from accounts.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from rest_framework.generics import UpdateAPIView
from .serializers import UserSerializer

class SignupView(APIView):
    
    """
    Returns the details of a user that has signed up with a refresh token and access token
    Method: POST
    Arguments: "username", "first_name", "last_name", "email", "password"
    
    """
    
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            data = {
                'user_id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone_number': user.phone_number,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            return Response(data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

class LogoutView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"success": "User logged out successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


#Viewprofile, use User only (IsAuthenticated) would be a GET request, should return 
# JSON body of that user's attributes
class ProfileView(APIView):
    
    """
    Returns the details of a user such as its id, username, email, first name, last name, and phone number
    Method: GET
    Arguments: None, just the access tokens
    
    """
    
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        user = request.user
        data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone_number': user.phone_number
        }
        return Response(data)
 

#Edit, use User only (IsAuthenticated), would be a PATCH request, should take refresh token, and fields to update as a parameter, and return an updated profile as a json response TODO
class EditProfileView(UpdateAPIView):
    
    """
    Returns the edited details of a user
    Method: PATCH
    Arguments: "username", "first_name", "last_name", "password", "phone_number"
    
    """
    
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user 

    def partial_update(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            try:
                token.check_blacklist() 
                serializer = self.get_serializer(self.get_object(), data=request.data, partial=True)
                if serializer.is_valid():
                    self.perform_update(serializer)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Refresh token required.'}, status=status.HTTP_400_BAD_REQUEST)
    

  
  #References: https://stackoverflow.com/questions/71081414/how-to-validate-and-return-access-and-refresh-tokens-after-user-save
  #https://stackoverflow.com/questions/72658040/django-rest-auth-how-refresh-token
  #https://stackoverflow.com/questions/41110742/django-rest-framework-partial-update
  #https://stackoverflow.com/questions/72156983/authentication-with-three-fields-in-django-rest-framework-simple-jwt
  #https://medium.com/django-rest/logout-django-rest-framework-eb1b53ac6d35