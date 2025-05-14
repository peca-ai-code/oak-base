# chatbot/serializers.py

from rest_framework import serializers
from .models import ChatSession, Message


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for the Message model"""
    
    class Meta:
        model = Message
        fields = ['id', 'message_type', 'text', 'timestamp', 'pain_scale', 'ai_provider']
        read_only_fields = ['id', 'timestamp']


class ChatSessionSerializer(serializers.ModelSerializer):
    """Serializer for the ChatSession model"""
    messages = MessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = ChatSession
        fields = ['id', 'user', 'title', 'created_at', 'updated_at', 'messages']
        read_only_fields = ['id', 'created_at', 'updated_at']