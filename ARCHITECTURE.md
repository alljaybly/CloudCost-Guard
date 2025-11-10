# CloudCost Guard - Cloud Run Microservices Architecture

## System Architecture Overview
┌─────────────────────────────────────────────────────────────────┐
│ PLANNED PRODUCTION ARCHITECTURE │
├─────────────────┐ ┌──────────────────┐ ┌─────────────────┤
│ FRONTEND │ │ API GATEWAY │ │ ANALYSIS │
│ SERVICE │ │ SERVICE │ │ SERVICE │
│ (Cloud Run) │◄──►│ (Cloud Run) │◄──►│ (Cloud Run) │
└─────────────────┘ └──────────────────┘ └─────────────────┘
│ │ │
│ │ │
▼ ▼ ▼
┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│ Current Demo │ │ Google Cloud │ │ External │
│ Netlify Hosting│ │ Services │ │ APIs │
└─────────────────┘ └──────────────────┘ └─────────────────┘

## Current Demo Deployment
**For hackathon demonstration purposes, deployed as a single application on Netlify with all microservices logic included.**

## Production Cloud Run Architecture (Planned)

### Service 1: Frontend Service (Cloud Run)
- **Technology**: React 18, TypeScript, Tailwind CSS
- **Purpose**: Serves the main user interface and dashboard
- **Status**: Ready for Cloud Run deployment

### Service 2: API Gateway Service (Cloud Run)  
- **Technology**: Node.js/Express
- **Purpose**: Handles API routing and authentication
- **Status**: Logic implemented, ready for service separation

### Service 3: Analysis Service (Cloud Run)
- **Technology**: Node.js with Gemini AI SDK
- **Purpose**: Processes cost analysis using Google Gemini AI
- **Status**: AI integration complete, ready for microservice deployment

## Why This Architecture for Hackathon Demo?
- **Single deployment** ensures reliable judging experience
- **All microservices logic** is implemented and functional
- **Easy to test** without complex service coordination
- **Production-ready** code that can be deployed to Cloud Run immediately

## Technology Stack Demonstrated
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI/ML**: Google Gemini API integration
- **Cloud Ready**: Dockerized, environment variables, microservices design
- **Deployment**: Netlify (demo) → Cloud Run (production)

## Key Architecture Features
✅ **Microservices Design** - Code structured for Cloud Run  
✅ **Service Separation Ready** - Logical separation implemented  
✅ **Cloud Native** - Container-ready with proper configuration  
✅ **Production Architecture** - Enterprise-grade design patterns  
✅ **Scalable** - Ready for multi-service Cloud Run deployment
