# 🛡️ CloudCost Guard: AI-Powered GCP Cost Optimization

**CloudCost Guard** is an intelligent, enterprise-grade platform designed for the Cloud Run Hackathon. It leverages the power of the Google Gemini AI to analyze Google Cloud Platform (GCP) billing data, identify waste, provide actionable cost-saving recommendations, and forecast future spending.

This project demonstrates a modern, multi-service architecture deployed on Cloud Run, showcasing a real-world solution to a common challenge for businesses operating on the cloud.

---

## ✨ Key Features

-   **🤖 AI Cost Analysis Dashboard:** Simply paste raw GCP billing data, and let Gemini's advanced reasoning capabilities perform a detailed analysis to identify key cost drivers.
-   **💡 Actionable Recommendations:** Receive specific, high-impact optimization suggestions with estimated monthly savings, such as right-sizing idle VMs or archiving cold data.
-   **📊 Interactive Data Visualization:** Understand your spending at a glance with a dynamic cost breakdown bar chart and a predictive forecasting line chart powered by Recharts.
-   **🔔 Real-time Alert System:** Set a monthly budget and configure custom warning/critical thresholds. A visual progress meter and an alert history provide immediate feedback on spending velocity.
-   **🖱️ Interactive Threshold Adjustment:** Visually adjust alert thresholds by dragging handles directly on the budget progress bar for a more intuitive user experience.
-   **🔒 Secure API Key Management:** Enter your Gemini API key directly in the app. It's stored securely in your browser's session storage for the current session and is never sent to our servers.
-   **🌐 Demo-Ready Fallback:** The application includes built-in sample data, ensuring a full-featured and impressive demonstration is always possible, even without a configured API key.

## 🚀 Tech Stack & Architecture

CloudCost Guard is built with a modern, scalable, and production-ready tech stack.

-   **Frontend:** React 18, TypeScript, Tailwind CSS
-   **AI Integration:** Google Generative AI (Gemini 2.5 Flash) for cost analysis and forecasting.
-   **Data Visualization:** Recharts for interactive and responsive charts.
-   **Deployment:** Designed for a multi-service architecture on **Google Cloud Run**.

### Multi-service Architecture on Cloud Run

The application is architected to run as a set of independent, scalable services on Cloud Run:

1.  **Frontend Service:** Hosts the React dashboard, providing the user interface for cost visualization and interaction.
2.  **Analysis Service (API):** A backend service responsible for securely handling requests, interfacing with the Google Gemini AI, and returning structured analysis data.
3.  **Alert Service:** A conceptual service designed for real-time budget monitoring and dispatching proactive alerts (simulated on the frontend for this demo).

## Local Development

Follow these steps to get the CloudCost Guard dashboard running on your local machine.

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm, yarn, or pnpm

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cloudcost-guard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

The application should now be running on `http://localhost:3000`.

### 4. Using the Application

-   **Demo Mode:** By default, the application runs in demo mode using built-in sample data. This allows you to explore all features without an API key.
-   **Live Analysis:** To perform a real-time analysis on your own data:
    1.  Click the **"Set API Key"** button on the dashboard.
    2.  In the modal that appears, paste your Google Gemini API key.
    3.  Click **"Save Key"**. The key is securely stored in your browser's session storage for the duration of your session.
    4.  You can now paste your GCP billing data and click "Analyze Costs" to get a live analysis from Gemini.

## 🏆 Hackathon Strategy

This project is optimized to excel in the Cloud Run Hackathon by focusing on:

-   **Business Value:** Directly addresses the critical business need for cloud cost management, demonstrating clear and significant ROI.
-   **Technical Execution:** Utilizes a modern, type-safe stack (React/TS) and showcases a best-practice multi-service architecture on Cloud Run.
-   **AI Integration:** Highlights the powerful capabilities of the Gemini AI for complex data analysis, turning raw data into actionable business intelligence.
-   **User Experience:** Features a professional, polished, and intuitive UI that makes complex data easy to understand and act upon.
-   **Demo Readiness:** Includes a robust fallback mechanism to ensure a smooth and impressive live demonstration under any circumstances.