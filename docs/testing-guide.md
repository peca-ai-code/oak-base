# Testing and Running Guide

This guide provides instructions for testing and running the Virtual Gynecology Chatbot application during development.

## Running the Application

### Backend (Django)

1. **Start the development server**:

```bash
# Activate virtual environment
source venv/bin/activate

# Run the server
python manage.py runserver
```

The Django API will be available at http://localhost:8000/

You can access the admin interface at http://localhost:8000/admin/

### Frontend (React)

1. **Start the development server**:

```bash
# Navigate to frontend directory
cd gynecology-chatbot-frontend

# Run the development server
npm start
```

The React application will be available at http://localhost:3000/

## Manual Testing

### 1. User Authentication

- **Registration**:
  - Navigate to http://localhost:3000/register
  - Fill in the registration form with valid data
  - Submit the form
  - Verify that you're redirected to the chat interface

- **Login**:
  - Navigate to http://localhost:3000/login
  - Enter your credentials
  - Submit the form
  - Verify that you're redirected to the chat interface

- **Profile Management**:
  - Navigate to http://localhost:3000/profile
  - Update your profile information
  - Verify that the changes are saved and displayed correctly

### 2. Chat Interface

- **Starting a New Chat**:
  - Navigate to http://localhost:3000/
  - Verify that a new chat session is created
  - Try sending a message
  - Verify that you receive a response from the AI

- **Using the Pain Scale**:
  - Click the pain scale button (😖)
  - Select a pain level
  - Send a message
  - Verify that the pain level is included with your message

- **Using Suggestion Chips**:
  - Click on one of the suggested messages
  - Verify that it's added to the input field
  - Send the message
  - Verify that you receive a relevant response

- **Chat History**:
  - Navigate to http://localhost:3000/history
  - Verify that your chat sessions are listed
  - Click on a previous session
  - Verify that all messages are loaded correctly

### 3. Doctor Consultation

- **Viewing Doctors**:
  - Navigate to http://localhost:3000/doctors
  - Verify that doctor profiles are displayed

- **Booking an Appointment**:
  - Click "Book Appointment" for a doctor
  - Fill in the appointment form
  - Submit the form
  - Verify that a success message is displayed

## API Testing

You can test the API endpoints using tools like Postman or curl.

### 1. Authentication

```bash
# Get token
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"grant_type":"password","username":"your_email@example.com","password":"your_password","client_id":"your_client_id","client_secret":"your_client_secret"}'
```

### 2. Chat Sessions

```bash
# Get all chat sessions (requires token)
curl -X GET http://localhost:8000/api/chat-sessions/ \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create a new chat session
curl -X POST http://localhost:8000/api/chat-sessions/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Chat Session"}'
```

### 3. Messages

```bash
# Send a message and get AI response
curl -X POST http://localhost:8000/api/chat-sessions/1/send-message/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"I have a question about menstrual cramps","pain_scale":5}'
```

## Setting Up Test Data

You can populate the database with test data using Django's admin interface or management commands.

### Creating a Test Doctor

1. Create a user with `user_type` set to 'doctor'
2. Create a `DoctorProfile` linked to this user

```bash
# Using Django shell
python manage.py shell

# Execute the following Python code
from users.models import User
from doctors.models import DoctorProfile

# Create doctor user
doctor = User.objects.create_user(
    username='doctor1',
    email='doctor1@example.com',
    password='password123',
    first_name='Jane',
    last_name='Smith',
    user_type='doctor'
)

# Create doctor profile
DoctorProfile.objects.create(
    user=doctor,
    specialization='Gynecology',
    qualification='MD, OBGYN',
    experience_years=10,
    bio='Dr. Jane Smith is a board-certified gynecologist with 10 years of experience.',
    availability={"monday": ["9:00", "10:00", "11:00"], "tuesday": ["13:00", "14:00", "15:00"]}
)
```

## Automated Testing

The project includes automated tests for both the backend and frontend.

### Backend Tests

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test users
python manage.py test chatbot
python manage.py test doctors
```

### Frontend Tests

```bash
# Navigate to frontend directory
cd gynecology-chatbot-frontend

# Run tests
npm test
```

## Common Issues and Solutions

### Backend Issues

1. **Database connection errors**:
   - Ensure PostgreSQL is running
   - Verify database credentials in `.env`
   - Check that the database exists

2. **Migration errors**:
   - Try resetting migrations: `python manage.py migrate --fake appname zero`
   - Then remigrate: `python manage.py migrate appname`

3. **API key errors**:
   - Verify that all API keys in `.env` are correct
   - Check for API rate limits or quotas

### Frontend Issues

1. **API connection errors**:
   - Ensure the backend server is running
   - Check that `REACT_APP_API_URL` is set correctly in `.env`
   - Verify that CORS is properly configured

2. **Authentication issues**:
   - Clear browser localStorage
   - Check browser console for errors
   - Verify that the OAuth client is properly configured

## Performance Testing

For production deployment, you should test the application's performance:

1. **Load Testing**:
   - Use tools like Apache JMeter or Locust to simulate many users
   - Test the chat endpoints specifically as they will receive the most traffic

2. **AI Response Time**:
   - Monitor the response time from different AI providers
   - Set appropriate timeouts to fall back to alternative providers if one is slow

3. **Database Performance**:
   - Monitor query performance using Django Debug Toolbar
   - Add indexes to fields that are frequently queried