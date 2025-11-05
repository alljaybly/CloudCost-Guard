
export interface AlertSettings {
  budget: number;
  warningThreshold: number;
  criticalThreshold: number;
}

export interface Recommendation {
  title: string;
  description: string;
  estimatedSavings: number;
}

// Fix: Add CostBreakdownItem type for CostVisuals.tsx component
export interface CostBreakdownItem {
  service: string;
  cost: number;
}

// Fix: Add ForecastDataPoint type for CostVisuals.tsx component
export interface ForecastDataPoint {
  month: string;
  cost?: number;
  predictedCost?: number;
}

export interface AnalysisResult {
  currentCost: number;
  optimizedCost: number;
  savings: number;
  recommendations: Recommendation[];
  breakdown: {
    compute: number;
    storage: number;
    network: number;
    other: number;
  };
}

export interface AlertStatus {
  level: 'normal' | 'warning' | 'critical';
  color: string;
  message: string;
}

export type DataSource = 'live' | 'demo';

export interface AnalysisResponse {
  result: AnalysisResult;
  source: DataSource;
}