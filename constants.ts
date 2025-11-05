
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

export const DEFAULT_DEMO_DATA: AnalysisResult = {
  totalSpend: 4847,
  potentialSavings: 1847,
  costBreakdown: [
    { service: 'Compute Engine', cost: 2150 },
    { service: 'BigQuery', cost: 890 },
    { service: 'Cloud SQL', cost: 630 },
    { service: 'Cloud Storage', cost: 550 },
    { service: 'Other', cost: 627 },
  ],
  recommendations: [
    {
      title: 'Right-size Idle Compute Engine VMs',
      description: 'Our analysis identified 5 high-CPU VMs with low utilization (under 10%) over the last 30 days. Consider switching to smaller machine types.',
      estimatedSavings: 950,
    },
    {
      title: 'Implement BigQuery Cost Controls',
      description: 'Several queries were run without byte limits, leading to high scan costs. Enforce user- and project-level quotas to prevent unexpected expenses.',
      estimatedSavings: 420,
    },
    {
      title: 'Archive Cold Cloud Storage Data',
      description: 'Over 10TB of data in Standard Storage buckets has not been accessed in 90 days. Transition this data to Nearline or Coldline storage classes.',
      estimatedSavings: 312,
    },
     {
      title: 'Optimize Cloud SQL Instances',
      description: 'Two Cloud SQL instances are overprovisioned for their current workload. Adjust machine types to better match performance requirements.',
      estimatedSavings: 165,
    },
  ],
  forecast: [
    { month: 'May', cost: 4750 },
    { month: 'Jun', cost: 4980 },
    { month: 'Jul', cost: 4847 },
    { month: 'Aug', predictedCost: 5100 },
    { month: 'Sep', predictedCost: 5250 },
    { month: 'Oct', predictedCost: 5400 },
  ],
};

export const STARTUP_DEMO_DATA: AnalysisResult = {
  totalSpend: 2500,
  potentialSavings: 1125, // 45%
  costBreakdown: [
    { service: 'Cloud Run', cost: 800 },
    { service: 'Firestore', cost: 650 },
    { service: 'Cloud Functions', cost: 450 },
    { service: 'Cloud Build', cost: 300 },
    { service: 'Other', cost: 300 },
  ],
  recommendations: [
    {
      title: 'Optimize Cloud Run CPU Allocation',
      description: 'Services are allocated 1 vCPU but show average utilization below 20%. Set CPU to be allocated only during request processing.',
      estimatedSavings: 450,
    },
    {
      title: 'Add a Caching Layer for Firestore',
      description: 'High read operations on Firestore can be reduced by implementing a caching solution like Memorystore.',
      estimatedSavings: 375,
    },
    {
      title: 'Consolidate Cloud Functions',
      description: 'Multiple small functions can be consolidated to reduce cold starts and management overhead.',
      estimatedSavings: 300,
    },
  ],
  forecast: [
    { month: 'May', cost: 2300 },
    { month: 'Jun', cost: 2400 },
    { month: 'Jul', cost: 2500 },
    { month: 'Aug', predictedCost: 2600 },
    { month: 'Sep', predictedCost: 2750 },
    { month: 'Oct', predictedCost: 2900 },
  ],
};

export const MID_MARKET_DEMO_DATA: AnalysisResult = {
  totalSpend: 8000,
  potentialSavings: 2800, // 35%
  costBreakdown: [
    { service: 'Compute Engine', cost: 3500 },
    { service: 'Cloud SQL', cost: 1800 },
    { service: 'Networking', cost: 1200 },
    { service: 'Kubernetes Engine', cost: 900 },
    { service: 'Other', cost: 600 },
  ],
  recommendations: [
    {
      title: 'Enable Committed Use Discounts for GCE',
      description: 'Your consistent Compute Engine usage is ideal for a 1-year or 3-year committed use discount, saving up to 57%.',
      estimatedSavings: 1500,
    },
    {
      title: 'Optimize Network Egress Costs',
      description: 'Utilize Cloud CDN to cache content closer to users and reduce high-cost cross-region egress traffic.',
      estimatedSavings: 800,
    },
    {
      title: 'Right-size Cloud SQL Instances',
      description: 'Database instances are showing low CPU and memory utilization. Consider scaling down to a more appropriate machine type.',
      estimatedSavings: 500,
    },
  ],
  forecast: [
    { month: 'May', cost: 7800 },
    { month: 'Jun', cost: 7900 },
    { month: 'Jul', cost: 8000 },
    { month: 'Aug', predictedCost: 8200 },
    { month: 'Sep', predictedCost: 8400 },
    { month: 'Oct', predictedCost: 8600 },
  ],
};

export const ENTERPRISE_DEMO_DATA: AnalysisResult = {
  totalSpend: 25000,
  potentialSavings: 7000, // 28%
  costBreakdown: [
    { service: 'BigQuery', cost: 9000 },
    { service: 'Dataflow', cost: 6500 },
    { service: 'Cloud Storage', cost: 4500 },
    { service: 'Compute Engine', cost: 3000 },
    { service: 'Other', cost: 2000 },
  ],
  recommendations: [
    {
      title: 'Optimize BigQuery Slot Usage',
      description: 'Your on-demand BigQuery usage is expensive. Purchase slot commitments (Flex or Annual) to significantly reduce analysis costs.',
      estimatedSavings: 4000,
    },
    {
      title: 'Implement Dataflow Streaming Engine',
      description: 'Migrate your Dataflow jobs to Streaming Engine to separate compute from state storage for more efficient processing.',
      estimatedSavings: 1800,
    },
    {
      title: 'Apply Storage Lifecycle Policies',
      description: 'Vast amounts of data in Standard Storage are infrequently accessed. Automate moving this data to cheaper storage classes like Nearline or Archive.',
      estimatedSavings: 1200,
    },
  ],
  forecast: [
    { month: 'May', cost: 24500 },
    { month: 'Jun', cost: 24800 },
    { month: 'Jul', cost: 25000 },
    { month: 'Aug', predictedCost: 25500 },
    { month: 'Sep', predictedCost: 26000 },
    { month: 'Oct', predictedCost: 26500 },
  ],
};

export const DEV_WASTE_DEMO_DATA: AnalysisResult = {
  totalSpend: 4000,
  potentialSavings: 2080, // 52%
  costBreakdown: [
    { service: 'Compute Engine', cost: 1800 },
    { service: 'Cloud SQL', cost: 900 },
    { service: 'Artifact Registry', cost: 700 },
    { service: 'Cloud Build', cost: 400 },
    { service: 'Other', cost: 200 },
  ],
  recommendations: [
    {
      title: 'Shutdown Idle Dev/Staging Resources',
      description: 'Multiple GCE VMs and Cloud SQL instances tagged for development are running 24/7. Implement a schedule to shut them down outside of work hours.',
      estimatedSavings: 1200,
    },
    {
      title: 'Clean Up Untagged Snapshots & Images',
      description: 'Over 5TB of old snapshots and container images are consuming storage costs. Implement a policy to delete untagged or old artifacts.',
      estimatedSavings: 580,
    },
    {
      title: 'Enable Cloud Build Caching',
      description: 'Cloud Build times can be improved and costs reduced by caching dependencies between builds.',
      estimatedSavings: 300,
    },
  ],
  forecast: [
    { month: 'May', cost: 3800 },
    { month: 'Jun', cost: 3900 },
    { month: 'Jul', cost: 4000 },
    { month: 'Aug', predictedCost: 4100 },
    { month: 'Sep', predictedCost: 4200 },
    { month: 'Oct', predictedCost: 4300 },
  ],
};


export const DEMO_DATASETS = {
  DEFAULT: DEFAULT_DEMO_DATA,
  STARTUP: STARTUP_DEMO_DATA,
  MID_MARKET: MID_MARKET_DEMO_DATA,
  ENTERPRISE: ENTERPRISE_DEMO_DATA,
  DEV_WASTE: DEV_WASTE_DEMO_DATA,
};
