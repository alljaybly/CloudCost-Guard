# 🛡️ CloudCost Guard: AI-Powered GCP Cost Optimization

CloudCost Guard is an intelligent dashboard that leverages the Google Gemini AI to analyze Google Cloud Platform (GCP) billing data, identify savings opportunities, and provide real-time budget monitoring.

This project demonstrates a real-world, polished solution to a common challenge for businesses operating on the cloud, built with a modern frontend stack.

## Table of Contents

- [✨ Key Features](#-key-features)
- [🚀 Tech Stack](#-tech-stack)
- [📁 File Structure](#-file-structure)
- [🔧 Core Components](#-core-components)
- [⚙️ Getting Started](#️-getting-started)
- [💻 Usage](#-usage)

---

## ✨ Key Features

-   **🤖 AI Cost Analysis:** Paste raw GCP billing data to let Gemini's advanced reasoning capabilities perform a detailed analysis and identify key cost drivers.
-   **💡 Actionable Recommendations:** Receive specific, high-impact optimization suggestions with estimated monthly savings.
-   **📊 Interactive Data Visualization:** Understand your spending at a glance with a dynamic cost breakdown bar chart powered by Recharts.
-   **🔔 Real-Time Budget Alerts:** Set a monthly budget and configure custom warning/critical thresholds. A visual progress meter provides immediate feedback, and all settings are saved to your browser's local storage for persistence.
-   **🔒 Secure API Key Management:** Your Gemini API key is stored securely in your browser's session storage and is never sent to any server.
-   **🌐 Dynamic Demo Mode:** The app intelligently selects a relevant demo scenario based on keywords in your input, ensuring a full-featured demonstration is always possible, even without an API key.

---

## 🚀 Tech Stack

-   **Frontend:** React 18, TypeScript, Tailwind CSS
-   **AI Integration:** Google Generative AI (`@google/genai`) for cost analysis using the Gemini 2.5 Flash model.
-   **Data Visualization:** Recharts for interactive and responsive charts.

---

## 📁 File Structure

```
/
├── public/
├── src/
│   ├── components/         # Reusable React components
│   │   ├── Alerts.tsx      # Real-time budget alerts dashboard
│   │   ├── CostAnalysis.tsx  # Input form for billing data and API key
│   │   └── MetricsDashboard.tsx # Displays AI analysis results and charts
│   ├── services/
│   │   └── geminiService.ts  # Logic for Gemini API calls and demo data
│   ├── utils/
│   │   └── jsonUtils.ts      # Robust JSON parsing and validation
│   ├── App.tsx             # Main application component and state management
│   ├── constants.ts        # Sample data and constants
│   └── types.ts            # TypeScript type definitions
├── index.html
└── package.json
```

---

## 🔧 Core Components

-   **`RealTimeAlerts.tsx`**: A self-contained dashboard for budget monitoring. It handles its own state for settings (budget, thresholds) and saves them to `localStorage`. The progress circle and alert status update in real-time as the user types.
-   **`CostAnalysis.tsx`**: The main user interaction area where users paste billing data. It manages the API key modal and triggers the analysis process.
-   **`ResultsDisplay.tsx`**: A component that takes a complete `AnalysisResult` object and renders the key metrics, actionable recommendations, and the cost breakdown chart.

---

## ⚙️ Getting Started

Follow these steps to get the CloudCost Guard dashboard running on your local machine.

### Prerequisites

-   Node.js (v18 or later recommended)
-   An npm-compatible package manager (npm, yarn, pnpm)

### Installation

1.  Clone the repository:
    ```sh
    git clone <repository-url>
    cd cloudcost-guard
    ```
2.  Install the dependencies:
    ```sh
    npm install
    ```
3.  Run the development server:
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the next available port).

---

## 💻 Usage

The application is divided into two main sections: Real-Time Alerts and AI-Powered Cost Analysis.

### 1. Real-Time Budget Alerts

This section allows you to monitor your current spending against a defined budget.

-   **Set Your Budget:** Enter your total monthly budget in the "Monthly Budget" field.
-   **Configure Thresholds:** Adjust the "Warning" and "Critical" percentages to define when alerts should change color.
-   **Automatic Saving:** All changes are validated and saved to your browser's local storage automatically as you type.
-   **Instant Feedback:** The progress circle, percentage, and status message will update in real-time based on your settings and the current spend data from the analysis below.

### 2. AI-Powered Cost Analysis

This is where you can get insights into your cloud spending.

-   **Demo Mode (Default):**
    -   Without an API key, the app runs in demo mode.
    -   Paste any text into the text area. The app will analyze the text for keywords (e.g., "compute", "storage", "network") and provide a relevant demo dataset.
    -   This allows you to explore the full functionality of the results display.

-   **Live Analysis:**
    1.  Click the **"Set API Key"** button.
    2.  In the modal, paste your Google Gemini API key and click **"Save Key"**.
    3.  The key is stored in session storage for your current session only.
    4.  Paste your actual GCP billing data (CSV or JSON format) into the text area.
    5.  Click **"Analyze with AI"**. A live request will be sent to the Gemini API, and the results will be displayed.
    6.  If the API call fails or the response is invalid, the app will gracefully fall back to a relevant demo dataset and show a warning message.
