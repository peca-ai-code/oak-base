// src/components/chat/MessageList.js

import React from 'react';
import { Card } from 'react-bootstrap';

const MessageList = ({ messages, messagesEndRef }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Card.Body className="messages-container">
      {messages.length === 0 ? (
        <div className="text-center text-muted my-5">
          <p>Start a conversation with our virtual gynecology assistant.</p>
          <p>You can ask questions about symptoms, concerns, or general gynecological health.</p>
          <p>All conversations are private and secure.</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <div 
            key={message.id || index}
            className={`d-flex ${message.message_type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
          >
            <div 
              className={`message-enter ${message.message_type === 'user' ? 'user-message' : 'bot-message'}`}
              style={{ maxWidth: '75%' }}
            >
              <div>{message.text}</div>
              
              {message.pain_scale && (
                <div className="mt-1">
                  <small>Pain level: {message.pain_scale}/10</small>
                </div>
              )}
              
              <div className="message-time text-end">
                {formatTimestamp(message.timestamp)}
                {message.ai_provider && message.message_type === 'bot' && (
                  <span className="ms-1">· via {message.ai_provider}</span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </Card.Body>
  );
};

export default MessageList;