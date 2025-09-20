# ESKAPE Analysis Application

A web application for analyzing microscopic urine sample images to detect ESKAPE category bacteria.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB installed locally or MongoDB Atlas account
- Git

## Installation Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following content:
```
MONGODB_URI=your_mongodb_connection_string
```

Replace `your_mongodb_connection_string` with either:
- Local MongoDB: `mongodb://localhost:27017/eskape_analysis`
- MongoDB Atlas: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/eskape_analysis`

## Running the Application

1. Start the development server:
```bash
npm run dev
```

This will start both the backend server and frontend development server.

2. Access the application:
- Open your browser and navigate to `http://localhost:8080`
- The API endpoints will be available at `http://localhost:8080/api`

## Features

- Upload and analyze microscopic urine sample images
- Detect ESKAPE category bacteria
- View analysis results with confidence scores
- Store and retrieve analysis history
- Responsive design for all devices

## API Endpoints

- `GET /api/health` - Check server and database status
- `POST /api/analyze` - Upload and analyze an image
- `GET /api/analyses` - Get all analysis results
- `GET /api/analysis/:id` - Get specific analysis result

## Technology Stack

- Frontend: React with Vite, TailwindCSS, shadcn/ui
- Backend: Express.js, Node.js
- Database: MongoDB with Mongoose
- Image Processing: Sharp
- Machine Learning: TensorFlow.js

## Deployment to AWS EC2

### Prerequisites
- AWS Account
- EC2 Instance (t2.micro or larger recommended)
- MongoDB Atlas account (or MongoDB installed on EC2)

### Deployment Steps

1. **Set up an EC2 instance:**
   - Launch an EC2 instance with Ubuntu Server (20.04 LTS or newer)
   - Configure security groups to allow HTTP (80), HTTPS (443), and SSH (22) traffic
   - Connect to your instance via SSH

2. **Install required software:**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm git nginx
   sudo npm install -g n
   sudo n lts
   hash -r
   ```

3. **Clone and set up the application:**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   npm install
   ```

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   nano .env
   ```
   Update the MongoDB URI and other variables as needed.

5. **Build the application:**
   ```bash
   npm run build
   ```

6. **Configure Nginx as a reverse proxy:**
   ```bash
   sudo nano /etc/nginx/sites-available/eskape-analysis
   ```

   Add the following configuration:
   ```
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Enable the Nginx site and restart:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/eskape-analysis /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Set up the application as a service:**
   ```bash
   sudo nano /etc/systemd/system/eskape-analysis.service
   ```

   Add the following configuration:
   ```
   [Unit]
   Description=ESKAPE Analysis Application
   After=network.target

   [Service]
   Type=simple
   User=ubuntu
   WorkingDirectory=/home/ubuntu/<repository-name>
   ExecStart=/usr/bin/npm start
   Restart=on-failure

   [Install]
   WantedBy=multi-user.target
   ```

9. **Start and enable the service:**
   ```bash
   sudo systemctl enable eskape-analysis
   sudo systemctl start eskape-analysis
   ```

10. **Access your application:**
    - Via the EC2 instance's public IP address or domain name
    - For production environments, set up HTTPS using Certbot/Let's Encrypt
