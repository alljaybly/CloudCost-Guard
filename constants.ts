
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

export const DEMO_ANALYSIS_RESULT: AnalysisResult = {
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
