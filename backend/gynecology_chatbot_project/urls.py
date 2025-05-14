# gynecology_chatbot_project/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet
from chatbot.views import ChatSessionViewSet, MessageViewSet
from doctors.views import DoctorProfileViewSet, AppointmentViewSet

router = DefaultRouter()
router.register('users', UserViewSet)
router.register('chat-sessions', ChatSessionViewSet, basename='chat-sessions')
router.register('doctors', DoctorProfileViewSet)
router.register('appointments', AppointmentViewSet, basename='appointments')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/chat-sessions/<int:chat_session_id>/messages/', 
         MessageViewSet.as_view({'get': 'list', 'post': 'create'}), 
         name='chat-session-messages'),
    path('api/chat-sessions/<int:chat_session_id>/send-message/',
         MessageViewSet.as_view({'post': 'send_message'}),
         name='send-message'),
    path('api/auth/', include('oauth2_provider.urls', namespace='oauth2_provider')),
]