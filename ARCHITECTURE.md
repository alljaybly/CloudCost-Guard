# CloudCost Guard - System Architecture

## Architecture Overview
┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│ Frontend │ │ Cloud Run │ │ Google AI │
│ │ │ Services │ │ Services │
│ React App │───▶│ API Gateway │───▶│ Gemini AI │
│ TypeScript │ │ Auth Service │ │ Cloud Storage │
│ Tailwind CSS │ │ Analysis Service│ │ BigQuery │
└─────────────────┘ └──────────────────┘ └─────────────────┘
│ │ │
│ │ │
▼ ▼ ▼
┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│ User │ │ Data Storage │ │ External │
│ Browser │ │ Firestore │ │ GCP Billing │
│ sessionStorage│ │ Local Storage │ │ API │
└─────────────────┘ └──────────────────┘ └─────────────────┘

## Technology Stack:
- **Frontend**: React 18, TypeScript, Tailwind CSS, Recharts
- **Backend**: Google Cloud Run (Multiple Services)
- **AI/ML**: Google Gemini API
- **Storage**: Browser sessionStorage, LocalStorage
- **Deployment**: Netlify (Frontend), Cloud Run (Services)
- **Security**: Environment Variables, Secure API Key Handling
