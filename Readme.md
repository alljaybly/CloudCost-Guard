# 🛡️ CloudCost Guard: AI-Powered GCP Cost Optimization

CloudCost Guard is an intelligent dashboard that leverages the Google Gemini AI to analyze Google Cloud Platform (GCP) billing data, identify savings opportunities, and provide real-time budget monitoring.

This project demonstrates a real-world, polished solution to a common challenge for businesses operating on the cloud, built with a modern frontend stack and configured according to security best practices.

## Table of Contents

- [✨ Key Features](#-key-features)
- [🚀 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Configuration](#️-configuration)
- [💻 Running the Application](#-running-the-application)
- [💡 How to Use](#-how-to-use)

---

## ✨ Key Features

-   **🤖 AI-Powered Cost Analysis:** Paste raw GCP billing data (or upload a CSV) and let Gemini perform a detailed analysis to identify key cost drivers.
-   **💡 Actionable Recommendations:** Receive specific, high-impact optimization suggestions with estimated monthly savings, which can be filtered and sorted.
-   **📊 Interactive Data Visualizations:** Understand spending with a dynamic cost breakdown bar chart and a 3-month cost forecast, all powered by Recharts.
-   **🔔 Real-Time Budget Alerts:** Set a monthly budget and configure custom warning/critical thresholds. A visual progress meter provides immediate feedback, and settings are saved to your browser's local storage for persistence.
-   **🔒 Secure Configuration:** The application is configured via an environment variable for the Gemini API key, ensuring keys are not exposed in the client-side code, adhering to security best practices.
-   **🌐 Dynamic Demo Mode:** The app provides a full-featured demonstration using relevant sample data, which works offline and does not require an API key.

---

## 🚀 Tech Stack

-   **Frontend:** React 18, TypeScript, Tailwind CSS
-   **AI Integration:** Google Generative AI (`@google/genai`) for cost analysis using the Gemini 2.5 Flash model.
-   **Data Visualization:** Recharts for interactive and responsive charts.

---

## 📁 Project Structure

```
/
├── components/           # Reusable React components
│   ├── Alerts.tsx        # Real-time budget alerts dashboard
│   ├── CostAnalysis.tsx  # Input form for billing data
│   ├── ErrorDisplay.tsx  # Component to show errors/warnings
│   ├── Header.tsx        # Application header and currency selector
│   ├── LoadingSpinner.tsx# Spinner for loading states
│   └── MetricsDashboard.tsx# Displays AI analysis results and charts
├── services/
│   └── geminiService.ts    # Logic for Gemini API calls and demo data
├── utils/
│   └── currencyUtils.ts  # Currency formatting and constants
├── App.tsx               # Main application component and state management
├── constants.ts          # Sample data and constants
├── types.ts              # TypeScript type definitions
├── index.html            # Main HTML entry point
└── index.tsx             # React application bootstrap
```

---

## ⚙️ Configuration

To enable live analysis with the Gemini API, you must configure your API key as an environment variable.

1.  **Obtain an API Key:** Get your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  **Set the Environment Variable:** This application is designed to run in an environment where `process.env.API_KEY` is available. When running locally or deploying, ensure this variable is set. For example, you can create a `.env` file in the project root:

    ```
    API_KEY="YOUR_GEMINI_API_KEY_HERE"
    ```

    *Note: The project setup must support loading environment variables (e.g., using Vite, Create React App, or another bundler that handles `.env` files).*

---

## 💻 Running the Application

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd cloudcost-guard
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Configure your API key** as described in the [Configuration](#️-configuration) section.
4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will now be running on your local machine.

---

## 💡 How to Use

The application is divided into two main sections: Real-Time Alerts and AI-Powered Cost Analysis.

### 1. Real-Time Budget Alerts

This section allows you to monitor your current spending against a defined budget.

-   **Set Your Budget:** Enter your total monthly budget.
-   **Configure Thresholds:** Adjust the "Warning" and "Critical" percentages.
-   **Automatic Saving:** Changes are validated and saved to your browser's local storage automatically.
-   **Instant Feedback:** The progress circle updates based on your settings and the current spend from the analysis.

### 2. AI-Powered Cost Analysis

This is where you can get insights into your cloud spending.

-   **Demo Mode (No API Key):**
    -   If the `API_KEY` environment variable is not set, the app runs in demo mode.
    -   Click "Analyze with AI" with the default data, or paste your own, to see a demonstration with sample analysis results. This allows you to explore the full functionality of the dashboard.

-   **Live Analysis (API Key Configured):**
    1.  Ensure your `API_KEY` is correctly configured.
    2.  Paste your actual GCP billing data (e.g., from a CSV export) into the text area, or use the "Upload CSV" button.
    3.  Click **"Analyze with AI"**. A live request will be sent to the Gemini API.
    4.  The dashboard will update with a real-time analysis, cost breakdown, and actionable recommendations based on your data.
    5.  If the API call fails, the app will gracefully fall back to a relevant demo dataset and show a warning message.
