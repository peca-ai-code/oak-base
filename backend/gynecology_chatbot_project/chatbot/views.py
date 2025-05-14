# chatbot/views.py

import os
import json
import requests
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ChatSession, Message
from .serializers import ChatSessionSerializer, MessageSerializer


class ChatSessionViewSet(viewsets.ModelViewSet):
    """Manage chat sessions in the database"""
    serializer_class = ChatSessionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return objects for the current authenticated user only"""
        return ChatSession.objects.filter(user=self.request.user).order_by('-updated_at')
    
    def perform_create(self, serializer):
        """Create a new chat session"""
        serializer.save(user=self.request.user)


class MessageViewSet(viewsets.ModelViewSet):
    """Manage messages in the database"""
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return messages for a specific chat session"""
        chat_session_id = self.kwargs.get('chat_session_id')
        
        if chat_session_id:
            # Ensure the chat session belongs to the current user
            chat_session = ChatSession.objects.filter(
                id=chat_session_id,
                user=self.request.user
            ).first()
            
            if chat_session:
                return Message.objects.filter(chat_session=chat_session).order_by('timestamp')
        
        return Message.objects.none()
    
    @action(detail=False, methods=['POST'])
    def send_message(self, request, chat_session_id=None):
        """Send a message and get a response from the chatbot"""
        if not chat_session_id:
            return Response(
                {'error': 'Chat session ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate chat session ownership
        chat_session = ChatSession.objects.filter(
            id=chat_session_id,
            user=self.request.user
        ).first()
        
        if not chat_session:
            return Response(
                {'error': 'Chat session not found or not owned by user'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get user message data
        text = request.data.get('text')
        pain_scale = request.data.get('pain_scale')
        
        if not text:
            return Response(
                {'error': 'Message text is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Save user message
        user_message = Message.objects.create(
            chat_session=chat_session,
            message_type='user',
            text=text,
            pain_scale=pain_scale
        )
        
        # Get chatbot response
        ai_response = self.get_ai_response(text, chat_session)
        
        # Save bot response
        bot_message = Message.objects.create(
            chat_session=chat_session,
            message_type='bot',
            text=ai_response['text'],
            ai_provider=ai_response['provider']
        )
        
        # Update chat session timestamp
        chat_session.save()  # This will update the updated_at field
        
        # Return both messages
        return Response({
            'user_message': MessageSerializer(user_message).data,
            'bot_message': MessageSerializer(bot_message).data
        })
    
    def get_ai_response(self, user_text, chat_session):
        """Get a response from one of the AI providers"""
        # Get chat history for context (last 10 messages)
        history = Message.objects.filter(chat_session=chat_session).order_by('-timestamp')[:10]
        history_formatted = []
        
        for msg in reversed(list(history)):
            role = "user" if msg.message_type == "user" else "assistant"
            history_formatted.append({"role": role, "content": msg.text})
        
        # Try providers in order: ChatGPT, Gemini, Grok
        # Start with ChatGPT
        if settings.CHATGPT_API_KEY:
            try:
                response = self.get_chatgpt_response(user_text, history_formatted)
                return {"text": response, "provider": "chatgpt"}
            except Exception as e:
                print(f"ChatGPT API error: {str(e)}")
        
        # Try Gemini
        if settings.GEMINI_API_KEY:
            try:
                response = self.get_gemini_response(user_text, history_formatted)
                return {"text": response, "provider": "gemini"}
            except Exception as e:
                print(f"Gemini API error: {str(e)}")
        
        # Try Grok
        if settings.GROK_API_KEY:
            try:
                response = self.get_grok_response(user_text, history_formatted)
                return {"text": response, "provider": "grok"}
            except Exception as e:
                print(f"Grok API error: {str(e)}")
        
        # Fallback response if all APIs fail
        return {
            "text": "I'm sorry, I'm having trouble connecting to my knowledge services. Please try again later.",
            "provider": "fallback"
        }
    
    def get_chatgpt_response(self, user_text, history):
        """Get a response from ChatGPT API"""
        api_key = settings.CHATGPT_API_KEY
        url = "https://api.openai.com/v1/chat/completions"
        
        # Create context with gynecological focus
        system_message = {
            "role": "system",
            "content": (
                "You are a virtual gynecology assistant designed to provide support, information, "
                "and reassurance to users with gynecological concerns. Provide clear, accurate, "
                "and concise information. Emphasize when symptoms are likely benign, but always "
                "recommend consulting a healthcare provider for proper diagnosis when appropriate. "
                "Do not provide definitive diagnoses. Be supportive, informative, and reassuring."
            )
        }
        
        # Combine history with current message
        messages = [system_message] + history + [{"role": "user", "content": user_text}]
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "gpt-4",
            "messages": messages,
            "max_tokens": 500,
            "temperature": 0.7
        }
        
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        
        return response.json()["choices"][0]["message"]["content"]
    
    def get_gemini_response(self, user_text, history):
        """Get a response from Google's Gemini API"""
        api_key = settings.GEMINI_API_KEY
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
        
        # Format the history for Gemini
        formatted_history = []
        for msg in history:
            role = "user" if msg["role"] == "user" else "model"
            formatted_history.append({"role": role, "parts": [{"text": msg["content"]}]})
        
        # Add system instruction
        system_instruction = {
            "role": "user",
            "parts": [{
                "text": (
                    "You are a virtual gynecology assistant designed to provide support, information, "
                    "and reassurance to users with gynecological concerns. In your responses, you should:"
                    "\n1. Be supportive and reassuring"
                    "\n2. Provide clear, accurate, and concise information"
                    "\n3. Emphasize when symptoms are likely benign"
                    "\n4. Recommend professional consultation when appropriate"
                    "\n5. Never provide definitive diagnoses"
                    "\nRespond as if you are this virtual gynecology assistant."
                )
            }]
        }
        
        formatted_history.insert(0, system_instruction)
        
        # Add current user message
        formatted_history.append({
            "role": "user",
            "parts": [{"text": user_text}]
        })
        
        data = {
            "contents": formatted_history,
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 500,
            }
        }
        
        response = requests.post(url, json=data)
        response.raise_for_status()
        
        return response.json()["candidates"][0]["content"]["parts"][0]["text"]
    
    def get_grok_response(self, user_text, history):
        """Get a response from Grok AI API"""
        api_key = settings.GROK_API_KEY
        url = "https://api.grok.ai/v1/chat/completions"  # Example URL - update with actual Grok API endpoint
        
        # Format the history for Grok
        system_message = {
            "role": "system",
            "content": (
                "You are a virtual gynecology assistant designed to provide support, information, "
                "and reassurance to users with gynecological concerns. Provide clear, accurate, "
                "and concise information. Emphasize when symptoms are likely benign, but always "
                "recommend consulting a healthcare provider for proper diagnosis when appropriate. "
                "Do not provide definitive diagnoses. Be supportive, informative, and reassuring."
            )
        }
        
        messages = [system_message] + history + [{"role": "user", "content": user_text}]
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "grok-1",
            "messages": messages,
            "max_tokens": 500,
            "temperature": 0.7
        }
        
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        
        # Note: The response parsing may need to be adjusted based on Grok's actual API format
        return response.json()["choices"][0]["message"]["content"]