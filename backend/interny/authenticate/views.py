from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from .serializers import UserSerializer, LoginSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from .models import Role, User_Role
from rest_framework.permissions import IsAuthenticated

# --------------------------------------#
# This is for unitary testing
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'interny.settings')
django.setup()

# --------------------------------------#

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    token_obtain_pair = TokenObtainPairView.as_view()
    
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            student_role, created = Role.objects.get_or_create(name='student')
            user_role = User_Role(user=user, role=student_role)
            user_role.save()

            refresh = CustomTokenObtainPairSerializer.get_token(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                email=serializer.validated_data.get('email'),
                password=serializer.validated_data.get('password')
            )
            if user is not None:
                refresh = CustomTokenObtainPairSerializer.get_token(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

User = get_user_model()
@api_view(['POST'])
@csrf_exempt
def validate_google_token(request):

    token = request.data.get('token')
    CLIENT_ID = settings.GOOGLE_CLIENT_ID 

    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)  
        email = idinfo.get('email')
        first_name = idinfo.get('given_name')
        last_name = idinfo.get('family_name')

        user = User.objects.filter(email=email).first()
        if user:
            refresh = CustomTokenObtainPairSerializer.get_token(user)
            return Response({
                'success': True,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)

        user = User.objects.create_user(email=email, username=email, first_name=first_name, last_name=last_name)
        student_role, created = Role.objects.get_or_create(name='student')
        user_role = User_Role(user=user, role=student_role)
        user_role.save()

        refresh = CustomTokenObtainPairSerializer.get_token(user)
        return Response({
            'success': True,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)
    
    except ValueError as e:
        return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
