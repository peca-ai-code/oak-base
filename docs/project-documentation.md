# Virtual Gynecology Chatbot - Project Documentation

## Project Overview

The Virtual Gynecology Chatbot is a web-based platform designed to provide women with a comfortable and accessible way to express gynecological concerns and receive reliable information. The application uses AI to provide reassuring and informative responses while also offering the option to connect with real gynecologists.

## Key Features

1. **AI-Powered Chat Interface**
   - Natural language conversation with context awareness
   - Pain scale rating system (1-10)
   - Suggestive input options that adapt to conversation context
   - Concise, reassuring responses

2. **User Account System**
   - Secure authentication (email/password)
   - User profile management
   - Chat history storage and retrieval

3. **Doctor Consultation Panel**
   - Browse available gynecologists
   - View doctor qualifications and experience
   - Book appointments with preferred doctors

4. **Multi-AI Provider Integration**
   - Primary support from ChatGPT
   - Fallback options using Gemini and Grok
   - Seamless provider switching if one API fails

## Project Structure

### Backend (Django)

```
gynecology_chatbot_project/
├── gynecology_chatbot_project/  # Project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── users/                       # User management app
│   ├── models.py                # Custom User model
│   ├── serializers.py
│   └── views.py
├── chatbot/                     # Chat functionality app
│   ├── models.py                # ChatSession and Message models
│   ├── serializers.py
│   └── views.py
├── doctors/                     # Doctor profiles app
│   ├── models.py                # DoctorProfile and Appointment models
│   ├── serializers.py
│   └── views.py
└── manage.py
```

### Frontend (React)

```
gynecology-chatbot-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/                # Authentication components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── PrivateRoute.js
│   │   ├── chat/                # Chat interface components
│   │   │   ├── ChatInterface.js
│   │   │   ├── MessageList.js
│   │   │   ├── PainScale.js
│   │   │   ├── SuggestionChips.js
│   │   │   └── ChatHistory.js
│   │   ├── doctors/             # Doctor-related components
│   │   │   └── DoctorList.js
│   │   ├── layout/              # Layout components
│   │   │   └── NavBar.js
│   │   └── user/                # User profile components
│   │       └── UserProfile.js
│   ├── context/
│   │   └── AuthContext.js       # Authentication context
│   ├── services/
│   │   └── api.js               # API service
│   ├── App.js                   # Main application component
│   └── index.js                 # Entry point
└── package.json
```

## Database Schema

### User Model
- `id`: Primary key
- `username`: Unique username
- `email`: User email
- `password`: Hashed password
- `first_name`: User's first name
- `last_name`: User's last name
- `user_type`: Either 'patient' or 'doctor'
- `age`: User's age (numerical)
- `phone_number`: Optional phone number

### ChatSession Model
- `id`: Primary key
- `user`: Foreign key to User
- `title`: Session title
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Message Model
- `id`: Primary key
- `chat_session`: Foreign key to ChatSession
- `message_type`: Either 'user' or 'bot'
- `text`: Message content
- `timestamp`: Message timestamp
- `pain_scale`: Optional pain scale rating (1-10)
- `ai_provider`: Which AI provider generated the response

### DoctorProfile Model
- `id`: Primary key
- `user`: Foreign key to User (where user_type='doctor')
- `specialization`: Doctor's specialty
- `qualification`: Doctor's qualifications
- `experience_years`: Years of experience
- `bio`: Doctor's biographical information
- `availability`: JSON field with availability data

### Appointment Model
- `id`: Primary key
- `patient`: Foreign key to User (patient)
- `doctor`: Foreign key to DoctorProfile
- `appointment_time`: Scheduled date/time
- `reason`: Reason for appointment
- `status`: 'pending', 'confirmed', 'cancelled', or 'completed'
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## API Endpoints

### Authentication
- `POST /api/auth/token/`: Get OAuth token
- `POST /api/users/`: Register new user

### User Management
- `GET /api/users/me/`: Get current user profile
- `PATCH /api/users/:id/`: Update user profile

### Chat Sessions
- `GET /api/chat-sessions/`: List user's chat sessions
- `POST /api/chat-sessions/`: Create new chat session
- `GET /api/chat-sessions/:id/`: Get specific chat session

### Messages
- `GET /api/chat-sessions/:id/messages/`: List messages in a session
- `POST /api/chat-sessions/:id/messages/`: Add message to session
- `POST /api/chat-sessions/:id/send-message/`: Send message and get AI response

### Doctors
- `GET /api/doctors/`: List all doctors
- `GET /api/doctors/:id/`: Get specific doctor details

### Appointments
- `GET /api/appointments/`: List user's appointments
- `POST /api/appointments/`: Create new appointment
- `PATCH /api/appointments/:id/`: Update appointment status

## AI Integration

The application integrates with three AI providers:

1. **ChatGPT (OpenAI)**
   - Primary provider
   - Used for generating responses to user queries
   - Model: GPT-4

2. **Gemini (Google)**
   - Secondary provider
   - Used as fallback if ChatGPT fails
   - Model: Gemini Pro

3. **Grok (xAI)**
   - Tertiary provider
   - Used as fallback if both ChatGPT and Gemini fail
   - Model: Grok-1

The application attempts to use these providers in order, falling back to the next one if the current one fails. This ensures high availability and reliability of the chat service.

## Data Privacy and Security

The application implements several measures to ensure user data privacy:

1. **Secure Authentication**
   - OAuth2 token-based authentication
   - Password hashing with Django's built-in security

2. **Data Encryption**
   - All API requests use HTTPS
   - Sensitive data is not stored in plaintext

3. **Access Control**
   - Users can only access their own data
   - Doctors can only see appointments booked with them

## Future Enhancements

Potential future enhancements for the platform:

1. **Video Consultation**
   - Add WebRTC integration for video appointments

2. **Symptom Tracking**
   - Allow users to track symptoms over time
   - Visualize symptom patterns

3. **Medication Reminders**
   - Set up reminders for medications
   - Track medication adherence

4. **Health Articles**
   - Curated educational content on gynecological health

5. **Multi-language Support**
   - Expand to support multiple languages

6. **Mobile App**
   - Develop native mobile applications for iOS and Android