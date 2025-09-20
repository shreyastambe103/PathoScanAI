# ESKAPE Analysis Application

## Overview

The ESKAPE Analysis Application is a web-based tool for analyzing microscopic urine sample images to detect ESKAPE category bacteria. The application uses machine learning for image classification, specifically leveraging TensorFlow.js with a Teachable Machine model to identify bacterial types including E. coli and S. aureus. Users can upload images, receive automated analysis results with confidence scores, and view historical reports.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom theme configuration
- **State Management**: TanStack Query for server state management and React Hook Form for form handling
- **Routing**: Wouter for lightweight client-side routing
- **ML Integration**: TensorFlow.js for browser-based image classification using a Teachable Machine model

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: Dual storage approach - MongoDB for production with fallback to in-memory storage
- **Image Processing**: Sharp library for image preprocessing and normalization
- **API Design**: RESTful endpoints with JSON responses
- **Development**: Vite middleware for hot module replacement in development mode

### Database Schema
The application uses MongoDB with Mongoose for data modeling:
- **Analysis Collection**: Stores image URLs, classification results (s_aureus, e_coli percentages), optional notes, and timestamps
- **Fallback Storage**: In-memory Map-based storage when MongoDB is unavailable

### Machine Learning Model
- **Model Source**: Teachable Machine exported model hosted on Google's CDN
- **Input Processing**: Images resized to 224x224 pixels, normalized to [-1, 1] range
- **Output**: Probability scores for s_aureus, e_coli, and invalid classifications
- **Browser-based**: All inference runs client-side using TensorFlow.js

### Build and Deployment
- **Development**: Concurrent server and client development with hot reloading
- **Production**: Static file generation with Express serving both API and static assets
- **Docker Support**: Containerization capabilities for deployment
- **Build Tools**: esbuild for server bundling, Vite for client bundling

## External Dependencies

### Core Technologies
- **TensorFlow.js**: Client-side machine learning inference
- **MongoDB**: Primary database for storing analysis results
- **Sharp**: Server-side image processing and optimization
- **Express.js**: Web server framework

### Machine Learning Services
- **Teachable Machine**: Pre-trained model hosted at `https://teachablemachine.withgoogle.com/models/-7jBmA0oM/model.json`
- **Google CDN**: Model file hosting and distribution

### UI and Development Tools
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Vite**: Development server and build tool
- **TanStack Query**: Data fetching and caching

### Database and Storage
- **Mongoose**: MongoDB object modeling
- **MongoDB Atlas**: Cloud database option (configurable via MONGODB_URI)
- **Local MongoDB**: Development database option

### Build and Deployment
- **Docker**: Container runtime for deployment
- **esbuild**: Fast JavaScript bundler for server code
- **TypeScript**: Type safety and development tooling