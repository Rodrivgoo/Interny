from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password, ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User_Role, Role
from dashboard.models import Career, StudentCareer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    career_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name', 'terms', 'career_id')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if not all(field in data for field in ['username', 'password', 'email', 'first_name', 'last_name', 'terms', 'career_id']):
            raise serializers.ValidationError("All fields are required.")

        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Email already exists.")

        if not Career.objects.filter(id=data['career_id']).exists():
            raise serializers.ValidationError("Career does not exist.")

        try:
            validate_password(data['password'], user=User())
        except ValidationError as e:
            raise serializers.ValidationError(str(e))

        return data

    def create(self, validated_data):
        career_id = validated_data.pop('career_id')
        user = User.objects.create_user(**validated_data)

        career = Career.objects.get(id=career_id)
        StudentCareer.objects.create(student=user, career=career)

        return user
        

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()  
    password = serializers.CharField(write_only=True)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name

        user_role = User_Role.objects.filter(user=user).first()
        token['role'] = user_role.role.name if user_role else None

        try:
            student_career = StudentCareer.objects.get(student=user)
            token['career_name'] = str(student_career.career.name)
        except StudentCareer.DoesNotExist:
            token['career_name'] = None

        return token