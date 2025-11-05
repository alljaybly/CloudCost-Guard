

import { AnalysisResult, Recommendation } from './types';

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
  // Fix: Converted recommendations from strings to objects to match the Recommendation type.
  recommendations: [
    { title: 'Right-size Idle Compute Engine VMs', description: 'Downsizing idle or underutilized virtual machines can lead to significant cost reductions.', estimatedSavings: 950 },
    { title: 'Implement BigQuery Cost Controls', description: 'Use features like query quotas and cost controls to manage BigQuery expenses effectively.', estimatedSavings: 420 },
    { title: 'Archive Cold Cloud Storage Data', description: 'Transition data that is not frequently accessed to lower-cost storage tiers.', estimatedSavings: 312 },
    { title: 'Optimize Cloud SQL Instances', description: 'Ensure your Cloud SQL instances are appropriately sized for their workload to avoid over-provisioning.', estimatedSavings: 165 },
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
  // Fix: Converted recommendations from strings to objects to match the Recommendation type.
  recommendations: [
    { title: 'Optimize Cloud Run CPU Allocation', description: 'Set CPU allocation to be throttled during idle periods to save on costs for bursty workloads.', estimatedSavings: 450 },
    { title: 'Add a Caching Layer for Firestore', description: 'Implement caching to reduce the number of reads from Firestore, lowering your database costs.', estimatedSavings: 375 },
    { title: 'Consolidate Cloud Functions', description: 'Combine multiple, small functions into fewer, more robust ones to reduce invocation overhead.', estimatedSavings: 300 },
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
  // Fix: Converted recommendations from strings to objects to match the Recommendation type.
  recommendations: [
    { title: 'Enable Committed Use Discounts for GCE', description: 'Commit to a 1 or 3-year term for your Compute Engine resources to receive significant discounts.', estimatedSavings: 1500 },
    { title: 'Optimize Network Egress Costs', description: 'Use Cloud CDN or choose regions strategically to reduce expensive data transfer out of Google Cloud.', estimatedSavings: 800 },
    { title: 'Right-size Cloud SQL Instances', description: 'Analyze performance metrics and adjust instance sizes to match workload demands without over-provisioning.', estimatedSavings: 500 },
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
  // Fix: Converted recommendations from strings to objects to match the Recommendation type.
  recommendations: [
    { title: 'Optimize BigQuery Slot Usage', description: 'Purchase BigQuery slot commitments for predictable workloads instead of paying on-demand prices.', estimatedSavings: 4000 },
    { title: 'Implement Dataflow Streaming Engine', description: 'Move shuffle operations from VM workers to the Dataflow service backend to improve performance and reduce costs.', estimatedSavings: 1800 },
    { title: 'Apply Storage Lifecycle Policies', description: 'Automatically transition or delete objects in Cloud Storage based on age or other conditions to save on storage costs.', estimatedSavings: 1200 },
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
  // Fix: Converted recommendations from strings to objects to match the Recommendation type.
  recommendations: [
    { title: 'Shutdown Idle Dev/Staging Resources', description: 'Automate the shutdown of non-production environments during off-hours (nights and weekends).', estimatedSavings: 1200 },
    { title: 'Clean Up Untagged Snapshots & Images', description: 'Regularly identify and delete old or unassociated disk snapshots and container images to reclaim storage costs.', estimatedSavings: 580 },
    { title: 'Enable Cloud Build Caching', description: 'Use Kaniko cache or native build caching to speed up build times and reduce worker usage.', estimatedSavings: 300 },
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
  // Fix: Converted recommendations from strings to objects to match the Recommendation type.
  recommendations: [
    { title: 'Apply Lifecycle Policy to Buckets', description: 'Automatically transition objects to cheaper storage classes or delete them after a specified period.', estimatedSavings: 950 },
    { title: 'Enable Cloud CDN for High-Egress Buckets', description: 'Cache frequently accessed content closer to users to reduce egress bandwidth costs.', estimatedSavings: 350 },
    { title: 'Delete Unused Persistent Disk Snapshots', description: 'Regularly remove old snapshots that are no longer needed for backups or recovery.', estimatedSavings: 150 },
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
  // Fix: Converted recommendations from strings to objects to match the Recommendation type.
  recommendations: [
    { title: 'Optimize Cross-Zone Egress', description: 'Structure applications to keep traffic within the same zone to avoid charges for cross-zone data transfer.', estimatedSavings: 1100 },
    { title: 'Leverage Cloud CDN', description: 'Serve content from Google\'s edge network to reduce latency and expensive egress traffic.', estimatedSavings: 750 },
    { title: 'Review NAT Gateway Usage', description: 'Ensure NAT gateways are used efficiently and are not a source of unnecessary data processing costs.', estimatedSavings: 250 },
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
  // Fix: Converted recommendations from strings to objects to match the Recommendation type.
  recommendations: [
    { title: 'Right-size Cloud Run Instances', description: 'Adjust memory and CPU settings for Cloud Run services to match their actual usage and avoid over-provisioning.', estimatedSavings: 300 },
    { title: 'Optimize Firestore Indexes', description: 'Review and remove unused composite indexes to reduce storage costs and write latency.', estimatedSavings: 200 },
    { title: 'Exclude Verbose Logs', description: 'Use logging sinks to filter out high-volume, low-value logs to reduce ingestion and storage costs in Cloud Logging.', estimatedSavings: 150 },
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