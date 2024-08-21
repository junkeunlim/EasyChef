from django.urls import path
from accounts.views import *

urlpatterns = [
    path('signup/', SignupView.as_view()),
    path('login/', LoginView.as_view()),    
    path('logout/', LogoutView.as_view()),
    path('profile/view/', ProfileView.as_view()),
    path('profile/edit/', EditProfileView.as_view()),
]
