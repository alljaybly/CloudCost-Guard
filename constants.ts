

import { AnalysisResult } from './types';

export const SAMPLE_BILLING_DATA = `
Service,Cost
Compute Engine,$2150.75
Cloud Storage,$550.20
BigQuery,$890.50
Cloud Functions,$225.00
Cloud SQL,$630.55
Other,$400.00
`;

// Fix: Updated data structure to conform to AnalysisResult interface
export const DEFAULT_DEMO_DATA: AnalysisResult = {
  currentCost: 4847,
  savings: 1847,
  optimizedCost: 3000,
  breakdown: {
    compute: 2780, // Compute Engine + Cloud SQL
    storage: 550,  // Cloud Storage
    network: 0,
    other: 1517,   // BigQuery + Other
  },
  recommendations: [
    'Right-size Idle Compute Engine VMs (saves ~$950/month)',
    'Implement BigQuery Cost Controls (saves ~$420/month)',
    'Archive Cold Cloud Storage Data (saves ~$312/month)',
    'Optimize Cloud SQL Instances (saves ~$165/month)',
  ],
};

// Fix: Updated data structure to conform to AnalysisResult interface
export const STARTUP_DEMO_DATA: AnalysisResult = {
  currentCost: 2500,
  savings: 1125,
  optimizedCost: 1375,
  breakdown: {
    compute: 1550, // Cloud Run + Cloud Functions + Cloud Build
    storage: 650,  // Firestore
    network: 0,
    other: 300,
  },
  recommendations: [
    'Optimize Cloud Run CPU Allocation (saves ~$450/month)',
    'Add a Caching Layer for Firestore (saves ~$375/month)',
    'Consolidate Cloud Functions (saves ~$300/month)',
  ],
};

// Fix: Updated data structure to conform to AnalysisResult interface
export const MID_MARKET_DEMO_DATA: AnalysisResult = {
  currentCost: 8000,
  savings: 2800,
  optimizedCost: 5200,
  breakdown: {
    compute: 6200, // Compute Engine + Cloud SQL + Kubernetes Engine
    storage: 0,
    network: 1200, // Networking
    other: 600,
  },
  recommendations: [
    'Enable Committed Use Discounts for GCE (saves ~$1,500/month)',
    'Optimize Network Egress Costs (saves ~$800/month)',
    'Right-size Cloud SQL Instances (saves ~$500/month)',
  ],
};

// Fix: Updated data structure to conform to AnalysisResult interface
export const ENTERPRISE_DEMO_DATA: AnalysisResult = {
  currentCost: 25000,
  savings: 7000,
  optimizedCost: 18000,
  breakdown: {
    compute: 18500, // BigQuery + Dataflow + Compute Engine
    storage: 4500,  // Cloud Storage
    network: 0,
    other: 2000,
  },
  recommendations: [
    'Optimize BigQuery Slot Usage (saves ~$4,000/month)',
    'Implement Dataflow Streaming Engine (saves ~$1,800/month)',
    'Apply Storage Lifecycle Policies (saves ~$1,200/month)',
  ],
};

// Fix: Updated data structure to conform to AnalysisResult interface
export const DEV_WASTE_DEMO_DATA: AnalysisResult = {
  currentCost: 4000,
  savings: 2080,
  optimizedCost: 1920,
  breakdown: {
    compute: 3100, // Compute Engine + Cloud SQL + Cloud Build
    storage: 700,  // Artifact Registry
    network: 0,
    other: 200,
  },
  recommendations: [
    'Shutdown Idle Dev/Staging Resources (saves ~$1,200/month)',
    'Clean Up Untagged Snapshots & Images (saves ~$580/month)',
    'Enable Cloud Build Caching (saves ~$300/month)',
  ],
};

// Fix: Updated data structure to conform to AnalysisResult interface
export const STORAGE_HEAVY_DEMO_DATA: AnalysisResult = {
  currentCost: 3250,
  savings: 1450,
  optimizedCost: 1800,
  breakdown: {
    compute: 0,
    storage: 2050, // Cloud Storage + Persistent Disk
    network: 1050, // Data Transfer + Cloud CDN
    other: 150,
  },
  recommendations: [
    'Apply Lifecycle Policy to Buckets (saves ~$950/month)',
    'Enable Cloud CDN for High-Egress Buckets (saves ~$350/month)',
    'Delete Unused Persistent Disk Snapshots (saves ~$150/month)',
  ],
};

// Fix: Updated data structure to conform to AnalysisResult interface
export const NETWORK_HEAVY_DEMO_DATA: AnalysisResult = {
  currentCost: 5620,
  savings: 2100,
  optimizedCost: 3520,
  breakdown: {
    compute: 0,
    storage: 0,
    network: 5220, // Egress + LB + NAT + VPC Controls
    other: 400,
  },
  recommendations: [
    'Optimize Cross-Zone Egress (saves ~$1,100/month)',
    'Leverage Cloud CDN (saves ~$750/month)',
    'Review NAT Gateway Usage (saves ~$250/month)',
  ],
};

// Fix: Updated data structure to conform to AnalysisResult interface
export const SMALL_WORKLOAD_DEMO_DATA: AnalysisResult = {
  currentCost: 2100,
  savings: 650,
  optimizedCost: 1450,
  breakdown: {
    compute: 1250, // Cloud Run + Cloud Functions
    storage: 450,  // Firestore
    network: 0,
    other: 400,    // Cloud Logging + Other
  },
  recommendations: [
    'Right-size Cloud Run Instances (saves ~$300/month)',
    'Optimize Firestore Indexes (saves ~$200/month)',
    'Exclude Verbose Logs (saves ~$150/month)',
  ],
};


export const DEMO_DATASETS = {
  DEFAULT: DEFAULT_DEMO_DATA,
  COMPUTE: DEFAULT_DEMO_DATA, // Alias for default
  STORAGE: STORAGE_HEAVY_DEMO_DATA,
  NETWORK: NETWORK_HEAVY_DEMO_DATA,
  SMALL: SMALL_WORKLOAD_DEMO_DATA,
  STARTUP: STARTUP_DEMO_DATA,
  MID_MARKET: MID_MARKET_DEMO_DATA,
  ENTERPRISE: ENTERPRISE_DEMO_DATA,
  DEV_WASTE: DEV_WASTE_DEMO_DATA,
};
