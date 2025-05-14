// src/components/chat/ChatHistory.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, ListGroup, Spinner, Alert, Button } from 'react-bootstrap';
import api from '../../services/api';

const ChatHistory = () => {
  const [chatSessions, setChatSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/chat-sessions/');
        setChatSessions(response.data);
      } catch (err) {
        console.error('Error fetching chat history:', err);
        setError('Failed to load chat history. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChatHistory();
  }, []);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getSessionPreview = (session) => {
    if (!session.messages || session.messages.length === 0) {
      return 'No messages';
    }
    
    const lastMessage = session.messages[session.messages.length - 1];
    return lastMessage.text.length > 70
      ? `${lastMessage.text.substring(0, 70)}...`
      : lastMessage.text;
  };
  
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }
  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Chat History</h3>
        <Button as={Link} to="/" variant="primary">
          New Chat
        </Button>
      </div>
      
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      
      {chatSessions.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <h5>No chat history yet</h5>
            <p>Start a new conversation to ask questions about gynecological health.</p>
            <Button as={Link} to="/" variant="primary">
              Start New Chat
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <ListGroup>
          {chatSessions.map(session => (
            <ListGroup.Item 
              key={session.id} 
              action 
              as={Link} 
              to={`/chat/${session.id}`}
              className="d-flex justify-content-between align-items-center py-3"
            >
              <div>
                <div className="fw-bold">{session.title || `Chat ${session.id}`}</div>
                <div className="text-muted small">{getSessionPreview(session)}</div>
              </div>
              <div className="text-muted small">{formatDate(session.updated_at)}</div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default ChatHistory;