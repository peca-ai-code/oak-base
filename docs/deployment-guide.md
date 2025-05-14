# Virtual Gynecology Chatbot - Deployment Guide

This guide provides instructions for setting up, running, and deploying the Virtual Gynecology Chatbot application with a Django backend and React frontend.

## System Requirements

- Python 3.8+
- Node.js 14+
- PostgreSQL 12+
- Linux environment (as specified)

## Setting Up the Development Environment

### 1. Backend Setup (Django)

```bash
# Clone the repository (if applicable)
git clone <repository-url>
cd <repository-directory>

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file (see .env.example)
cp .env.example .env
# Edit the .env file with your configuration

# Set up the database
psql -U postgres
CREATE DATABASE gynecology_chatbot;
\q

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create a superuser
python manage.py createsuperuser

# Run the development server
python manage.py runserver
```

### 2. Frontend Setup (React)

```bash
# Navigate to the frontend directory
cd gynecology-chatbot-frontend

# Install dependencies
npm install

# Create .env file for frontend
echo "REACT_APP_API_URL=http://localhost:8000" > .env

# Start the development server
npm start
```

### 3. Setting Up AI API Integration

The application is designed to use three AI providers: ChatGPT, Gemini, and Grok. You need to obtain API keys for each service and add them to your `.env` file.

1. **ChatGPT API Key**:
   - Sign up for an account at https://platform.openai.com/
   - Navigate to API Keys and create a new secret key
   - Add the key to your `.env` file as `CHATGPT_API_KEY`

2. **Gemini API Key**:
   - Sign up for Google AI Studio at https://makersuite.google.com/
   - Create an API key in the Google AI Studio
   - Add the key to your `.env` file as `GEMINI_API_KEY`

3. **Grok API Key**:
   - Sign up for Grok API access (when available)
   - Add the key to your `.env` file as `GROK_API_KEY`

## Production Deployment

### 1. Backend Deployment

For a production deployment on Linux, you can use Gunicorn as the WSGI server and Nginx as the reverse proxy.

```bash
# Install production dependencies
pip install gunicorn

# Create a systemd service file
sudo nano /etc/systemd/system/gynecology-chatbot.service

# Add the following content (adjust paths as needed)
[Unit]
Description=Gynecology Chatbot Backend
After=network.target

[Service]
User=your-user
Group=your-user
WorkingDirectory=/path/to/your/project
ExecStart=/path/to/your/venv/bin/gunicorn gynecology_chatbot_project.wsgi:application --bind 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target

# Enable and start the service
sudo systemctl enable gynecology-chatbot
sudo systemctl start gynecology-chatbot

# Configure Nginx
sudo nano /etc/nginx/sites-available/gynecology-chatbot

# Add the following configuration (adjust as needed)
server {
    listen 80;
    server_name your-domain.com;

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        root /path/to/your/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}

# Create a symbolic link and test the config
sudo ln -s /etc/nginx/sites-available/gynecology-chatbot /etc/nginx/sites-enabled/
sudo nginx -t

# If the test passes, restart Nginx
sudo systemctl restart nginx
```

### 2. Frontend Deployment

For production, you'll need to build the React application and serve it with Nginx.

```bash
# Navigate to the frontend directory
cd gynecology-chatbot-frontend

# Create production environment file
echo "REACT_APP_API_URL=https://your-domain.com" > .env.production

# Build the application
npm run build

# Copy the build directory to your Nginx served location
sudo cp -r build/* /path/to/your/frontend/build/
```

## Security Considerations

1. **SSL/TLS**: Always use HTTPS in production. You can configure Let's Encrypt with Certbot for free SSL certificates.

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

2. **Environment Variables**: Never commit `.env` files containing sensitive information.

3. **Database Backups**: Set up regular database backups.

4. **API Rate Limiting**: Implement rate limiting for the AI API calls to manage costs.

5. **Data Privacy**: Ensure compliance with healthcare privacy regulations in your jurisdiction.

## Troubleshooting

### Common Issues

1. **Django migrations fail**:
   - Ensure PostgreSQL is running and the database exists
   - Check database credentials in `.env`

2. **API calls to AI services fail**:
   - Verify API keys in `.env`
   - Check network connectivity
   - Ensure you have sufficient quota/credits on the AI service

3. **CORS issues**:
   - Check that the frontend URL is properly configured in Django settings
   - Verify that `corsheaders` middleware is correctly set up

### Logs

- Django logs: Check the console where the Django server is running
- Nginx logs: `/var/log/nginx/access.log` and `/var/log/nginx/error.log`
- System logs: `journalctl -u gynecology-chatbot.service`