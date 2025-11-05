
export interface CostBreakdownItem {
  service: string;
  cost: number;
}

export interface Recommendation {
  title: string;
  description: string;
  estimatedSavings: number;
}

export interface ForecastDataPoint {
  month: string;
  // FIX: Made `cost` optional to allow for forecast data points that
  // represent future predictions and may only contain a `predictedCost`.
  cost?: number;
  predictedCost?: number;
}

export interface AnalysisResult {
  totalSpend: number;
  potentialSavings: number;
  costBreakdown: CostBreakdownItem[];
  recommendations: Recommendation[];
  forecast: ForecastDataPoint[];
}

export interface Alert {
  id: number;
  level: 'warning' | 'critical';
  message: string;
  timestamp: string;
}
