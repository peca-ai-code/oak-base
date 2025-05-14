# chatbot/models.py

from django.db import models
from django.conf import settings


class ChatSession(models.Model):
    """
    Model to store chat sessions between users and the chatbot
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chat_sessions'
    )
    title = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Chat {self.id} - {self.user.username}"


class Message(models.Model):
    """
    Model to store individual messages in a chat session
    """
    MESSAGE_TYPE_CHOICES = [
        ('user', 'User'),
        ('bot', 'Bot'),
    ]
    
    chat_session = models.ForeignKey(
        ChatSession,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    message_type = models.CharField(
        max_length=5,
        choices=MESSAGE_TYPE_CHOICES
    )
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    pain_scale = models.PositiveSmallIntegerField(null=True, blank=True)
    # Store the AI provider that generated this response
    ai_provider = models.CharField(max_length=20, blank=True)
    
    def __str__(self):
        return f"{self.message_type} message in {self.chat_session}"