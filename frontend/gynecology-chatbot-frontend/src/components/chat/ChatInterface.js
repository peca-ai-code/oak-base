// src/components/chat/ChatInterface.js

import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import PainScale from './PainScale';
import SuggestionChips from './SuggestionChips';
import MessageList from './MessageList';

const ChatInterface = () => {
  const { sessionId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [chatSession, setChatSession] = useState(null);
  const [inputText, setInputText] = useState('');
  const [painScale, setPainScale] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPainScale, setShowPainScale] = useState(false);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  
  // Fetch or create chat session
  useEffect(() => {
    const fetchOrCreateSession = async () => {
      try {
        setIsLoading(true);
        
        if (sessionId) {
          // Fetch existing session
          const response = await api.get(`/api/chat-sessions/${sessionId}/`);
          setChatSession(response.data);
          setMessages(response.data.messages);
        } else {
          // Create new session
          const response = await api.post('/api/chat-sessions/', {
            title: `Chat ${new Date().toLocaleString()}`,
            user: currentUser.id
          });
          setChatSession(response.data);
          
          // Navigate to the new session URL
          navigate(`/chat/${response.data.id}`);
        }
      } catch (err) {
        console.error('Error fetching/creating chat session:', err);
        setError('Failed to load chat session. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (currentUser) {
      fetchOrCreateSession();
    }
  }, [sessionId, currentUser, navigate]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;
    
    try {
      setIsLoading(true);
      
      const response = await api.post(`/api/chat-sessions/${chatSession.id}/send-message/`, {
        text: inputText,
        pain_scale: painScale
      });
      
      // Add the new messages to the state
      setMessages([...messages, response.data.user_message, response.data.bot_message]);
      
      // Clear input and pain scale
      setInputText('');
      setPainScale(null);
      setShowPainScale(false);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
  };
  
  // Generate context-aware suggestions based on conversation
  const getSuggestions = () => {
    const defaultSuggestions = [
      "I'm experiencing pain",
      "I have a question about my period",
      "I'm concerned about a symptom",
      "Is this normal?",
      "I need advice about contraception"
    ];
    
    // Add more sophisticated suggestion logic here based on conversation context
    if (messages.length > 0) {
      const lastBotMessage = [...messages].reverse().find(m => m.message_type === 'bot');
      
      if (lastBotMessage && lastBotMessage.text.includes('pain')) {
        return [
          "Can you rate your pain on a scale of 1-10?",
          "Where exactly is the pain located?",
          "When did the pain start?",
          "Is the pain constant or intermittent?",
          "What makes the pain better or worse?"
        ];
      }
      
      if (lastBotMessage && lastBotMessage.text.includes('period')) {
        return [
          "My period is irregular",
          "My period is heavier than usual",
          "I'm experiencing severe cramps",
          "I missed my period",
          "My period is lasting longer than usual"
        ];
      }
    }
    
    return defaultSuggestions;
  };
  
  if (isLoading && messages.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }
  
  return (
    <Card className="chat-container">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Virtual Gynecology Assistant</h4>
      </Card.Header>
      
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      
      <MessageList messages={messages} messagesEndRef={messagesEndRef} />
      
      <Card.Footer className="p-0">
        {showPainScale && (
          <div className="p-3 border-bottom">
            <PainScale 
              selectedValue={painScale} 
              onChange={setPainScale} 
              onClose={() => setShowPainScale(false)} 
            />
          </div>
        )}
        
        <div className="p-3">
          <SuggestionChips 
            suggestions={getSuggestions()} 
            onSuggestionClick={handleSuggestionClick} 
          />
          
          <Form onSubmit={handleSubmit}>
            <div className="d-flex">
              <Button 
                variant="outline-secondary" 
                className="me-2"
                onClick={() => setShowPainScale(!showPainScale)}
                title="Rate pain level"
              >
                😖
              </Button>
              
              <Form.Control
                type="text"
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
              />
              
              <Button 
                type="submit" 
                variant="primary" 
                className="ms-2"
                disabled={isLoading || !inputText.trim()}
              >
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <span>Send</span>
                )}
              </Button>
            </div>
          </Form>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default ChatInterface;