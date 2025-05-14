# chatbot/admin.py
from django.contrib import admin
from .models import ChatSession, Message

class MessageInline(admin.TabularInline):
    """Tabular Inline View for Message"""
    model = Message
    extra = 0
    readonly_fields = ['timestamp']

class ChatSessionAdmin(admin.ModelAdmin):
    """Admin View for ChatSession"""
    list_display = ('id', 'user', 'title', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('title', 'user__username', 'user__email')
    inlines = [MessageInline]
    date_hierarchy = 'created_at'

class MessageAdmin(admin.ModelAdmin):
    """Admin View for Message"""
    list_display = ('id', 'chat_session', 'message_type', 'text_preview', 'timestamp', 'pain_scale')
    list_filter = ('message_type', 'timestamp', 'pain_scale', 'ai_provider')
    search_fields = ('text', 'chat_session__user__username')
    date_hierarchy = 'timestamp'
    
    def text_preview(self, obj):
        """Return first 50 characters of the message text"""
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
    text_preview.short_description = 'Text Preview'

admin.site.register(ChatSession, ChatSessionAdmin)
admin.site.register(Message, MessageAdmin)