import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisResult, AnalysisResponse } from '../types';

const COMPUTE_HEAVY_DATASET: AnalysisResult = {
  currentCost: 4847,
  optimizedCost: 1847,
  savings: 3000,
  recommendations: [
    'Switch to preemptible VMs for batch workloads (saves $1200/month)',
    'Right-size overprovisioned instances (saves $1000/month)',
    'Use committed use discounts (saves $800/month)',
  ],
  breakdown: { compute: 3500, storage: 800, network: 447, other: 100 },
};

const STORAGE_HEAVY_DATASET: AnalysisResult = {
  currentCost: 3250,
  optimizedCost: 1450,
  savings: 1800,
  recommendations: [
    'Move to Nearline/Coldline storage (saves $900/month)',
    'Enable object lifecycle policies (saves $600/month)',
    'Compress stored objects (saves $300/month)',
  ],
  breakdown: { compute: 500, storage: 2400, network: 250, other: 100 },
};

const NETWORK_HEAVY_DATASET: AnalysisResult = {
  currentCost: 5620,
  optimizedCost: 2820,
  savings: 2800,
  recommendations: [
    'Use Cloud CDN to reduce egress (saves $1400/month)',
    'Optimize inter-region transfers (saves $800/month)',
    'Enable compression (saves $600/month)',
  ],
  breakdown: { compute: 1200, storage: 600, network: 3620, other: 200 },
};

const SMALL_WORKLOAD_DATASET: AnalysisResult = {
  currentCost: 2100,
  optimizedCost: 1350,
  savings: 750,
  recommendations: [
    'Enable autoscaling (saves $300/month)',
    'Use preemptible VMs for dev/test (saves $250/month)',
    'Clean up unused resources (saves $200/month)',
  ],
  breakdown: { compute: 1000, storage: 600, network: 400, other: 100 },
};

const DEFAULT_DATASET: AnalysisResult = {
  currentCost: 6850,
  optimizedCost: 3120,
  savings: 3730,
  recommendations: [
    'Automated resource scheduling (saves $1500/month)',
    'Migrate to Cloud Run (saves $1200/month)',
    'Use sustained/committed discounts (saves $1030/month)',
  ],
  breakdown: { compute: 3800, storage: 1650, network: 1200, other: 200 },
};

const getDemoDataset = (billingData: string): AnalysisResult => {
  const text = billingData.toLowerCase();

  if (text.includes('compute') || text.includes('vm') || text.includes('instance')) {
    return COMPUTE_HEAVY_DATASET;
  }

  if (text.includes('storage') || text.includes('bucket') || text.includes('disk')) {
    return STORAGE_HEAVY_DATASET;
  }

  if (text.includes('network') || text.includes('bandwidth') || text.includes('egress')) {
    return NETWORK_HEAVY_DATASET;
  }

  if (billingData.length < 100) {
    return SMALL_WORKLOAD_DATASET;
  }

  return DEFAULT_DATASET;
};

const robustJsonParse = (text: string): AnalysisResult | null => {
  try { return JSON.parse(text) as AnalysisResult; } catch {}
  
  try {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (match && match[1]) return JSON.parse(match[1]) as AnalysisResult;
  } catch {}
  
  try {
    const match = text.match(/```\s*([\s\S]*?)\s*```/);
    if (match && match[1]) return JSON.parse(match[1]) as AnalysisResult;
  } catch {}
  
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end > start) {
      return JSON.parse(text.substring(start, end + 1)) as AnalysisResult;
    }
  } catch {}
  
  console.error('All JSON parsing methods failed.');
  return null;
};

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
      currentCost: { type: Type.NUMBER },
      optimizedCost: { type: Type.NUMBER },
      savings: { type: Type.NUMBER },
      recommendations: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      breakdown: {
        type: Type.OBJECT,
        properties: {
          compute: { type: Type.NUMBER },
          storage: { type: Type.NUMBER },
          network: { type: Type.NUMBER },
          other: { type: Type.NUMBER },
        },
        required: ['compute', 'storage', 'network', 'other'],
      },
    },
    required: ['currentCost', 'optimizedCost', 'savings', 'recommendations', 'breakdown'],
};

const validateAnalysisResult = (data: any): data is AnalysisResult => {
    if (!data) return false;
    return (
        typeof data.currentCost === 'number' &&
        typeof data.optimizedCost === 'number' &&
        typeof data.savings === 'number' &&
        Array.isArray(data.recommendations) &&
        typeof data.breakdown === 'object' &&
        data.breakdown !== null &&
        typeof data.breakdown.compute === 'number' &&
        typeof data.breakdown.storage === 'number' &&
        typeof data.breakdown.network === 'number' &&
        typeof data.breakdown.other === 'number'
    );
};

export const analyzeBillingData = async (billingData: string, apiKey?: string): Promise<AnalysisResponse> => {
    const fallbackResult = getDemoDataset(billingData);
    
    if (!apiKey) {
      console.warn("API key not provided. Using fallback demo data.");
      return Promise.resolve({ result: fallbackResult, source: 'demo' });
    }
  
    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Analyze this GCP billing data and provide cost optimization recommendations.

        Billing Data:
        ${billingData}
        
        Respond ONLY with valid JSON (no markdown, no explanation):
        The JSON object must contain:
        1. "currentCost": The total current cost.
        2. "optimizedCost": The estimated cost after optimizations.
        3. "savings": The total potential savings (currentCost - optimizedCost).
        4. "recommendations": An array of 3-5 specific, actionable recommendation strings.
        5. "breakdown": An object with cost breakdown for "compute", "storage", "network", and "other".
        `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: analysisSchema,
        },
      });
      
      const jsonString = response.text;
      const parsedResult = robustJsonParse(jsonString);
  
      if (parsedResult && validateAnalysisResult(parsedResult)) {
        return { result: parsedResult, source: 'live' };
      } else {
        console.warn("Failed to parse or validate the AI response. Falling back to demo data.");
        return { result: fallbackResult, source: 'demo' };
      }
  
    } catch (error) {
      console.error("Error analyzing billing data with Gemini:", error);
      console.warn("Falling back to demo data due to API error.");
      return { result: fallbackResult, source: 'demo' };
    }
  };
