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

### 3. Set Up Environment Variables

To connect to the Google Gemini API, you need an API key.

1.  Create a file named `.env` in the root of the project.
2.  Add your API key to the `.env` file:

    ```
    API_KEY=your_google_gemini_api_key_here
    ```

    **Note:** If you do not provide an API key, the application will automatically use the built-in sample data for a complete demo experience.

### 4. Run the Development Server

```bash
npm run dev
```

The application should now be running on `http://localhost:3000`.

## 🏆 Hackathon Strategy

This project is optimized to excel in the Cloud Run Hackathon by focusing on:

-   **Business Value:** Directly addresses the critical business need for cloud cost management, demonstrating clear and significant ROI.
-   **Technical Execution:** Utilizes a modern, type-safe stack (React/TS) and showcases a best-practice multi-service architecture on Cloud Run.
-   **AI Integration:** Highlights the powerful capabilities of the Gemini AI for complex data analysis, turning raw data into actionable business intelligence.
-   **User Experience:** Features a professional, polished, and intuitive UI that makes complex data easy to understand and act upon.
-   **Demo Readiness:** Includes a robust fallback mechanism to ensure a smooth and impressive live demonstration under any circumstances.
