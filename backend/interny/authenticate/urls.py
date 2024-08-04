from . import views
from django.urls import path

#Add URLS for the path
urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('verify-google-token/', views.validate_google_token, name='validate_google_token'),
    #path('verify-microsoft-token/', views.validate_microsoft_token, name='validate_microsoft_token'),
]
