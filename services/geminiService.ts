
import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisResult, AnalysisResponse, Recommendation } from '../types';

const COMPUTE_HEAVY_DATASET: AnalysisResult = {
  currentCost: 4847,
  optimizedCost: 1847,
  savings: 3000,
  recommendations: [
    { title: 'Switch to Preemptible VMs', description: 'Use preemptible VMs for batch workloads to significantly reduce compute costs.', estimatedSavings: 1200 },
    { title: 'Right-size Instances', description: 'Analyze usage and downsize overprovisioned instances to match actual demand.', estimatedSavings: 1000 },
    { title: 'Use Committed Use Discounts', description: 'Commit to 1 or 3-year terms for consistent workloads to get significant discounts.', estimatedSavings: 800 },
  ],
  breakdown: { compute: 3500, storage: 800, network: 447, other: 100 },
};

const STORAGE_HEAVY_DATASET: AnalysisResult = {
  currentCost: 3250,
  optimizedCost: 1450,
  savings: 1800,
  recommendations: [
    { title: 'Move to Nearline/Coldline Storage', description: 'Transition infrequently accessed data to cheaper storage classes.', estimatedSavings: 900 },
    { title: 'Enable Object Lifecycle Policies', description: 'Automatically delete or transition old objects to save on storage costs.', estimatedSavings: 600 },
    { title: 'Compress Stored Objects', description: 'Compressing data before storing can lead to substantial savings on storage and network.', estimatedSavings: 300 },
  ],
  breakdown: { compute: 500, storage: 2400, network: 250, other: 100 },
};

const NETWORK_HEAVY_DATASET: AnalysisResult = {
  currentCost: 5620,
  optimizedCost: 2820,
  savings: 2800,
  recommendations: [
    { title: 'Use Cloud CDN', description: 'Cache content closer to users to reduce costly egress traffic.', estimatedSavings: 1400 },
    { title: 'Optimize Inter-Region Transfers', description: 'Review and optimize data transfer patterns between regions to minimize costs.', estimatedSavings: 800 },
    { title: 'Enable VPC Flow Logs', description: 'Analyze network traffic to identify and eliminate unnecessary data transfers.', estimatedSavings: 600 },
  ],
  breakdown: { compute: 1200, storage: 600, network: 3620, other: 200 },
};

const SMALL_WORKLOAD_DATASET: AnalysisResult = {
  currentCost: 2100,
  optimizedCost: 1350,
  savings: 750,
  recommendations: [
    { title: 'Enable Autoscaling', description: 'Automatically scale resources up and down to match demand, avoiding costs for idle resources.', estimatedSavings: 300 },
    { title: 'Use Preemptible VMs for Dev/Test', description: 'Leverage low-cost, short-lived instances for non-critical development and testing environments.', estimatedSavings: 250 },
    { title: 'Clean Up Unused Resources', description: 'Regularly identify and delete unattached disks, unused IP addresses, and idle VMs.', estimatedSavings: 200 },
  ],
  breakdown: { compute: 1000, storage: 600, network: 400, other: 100 },
};

const DEFAULT_DATASET: AnalysisResult = {
  currentCost: 6850,
  optimizedCost: 3120,
  savings: 3730,
  recommendations: [
    { title: 'Automated Resource Scheduling', description: 'Automatically shut down non-production resources during off-hours to reduce idle costs.', estimatedSavings: 1500 },
    { title: 'Migrate to Cloud Run', description: 'For containerized, stateless workloads, migrating from VMs to serverless Cloud Run can lower costs.', estimatedSavings: 1200 },
    { title: 'Use Sustained/Committed Discounts', description: 'Leverage Google\'s automatic or purchased discounts for predictable workloads.', estimatedSavings: 1030 },
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
        items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "A short, actionable title for the recommendation." },
                description: { type: Type.STRING, description: "A brief explanation of the recommendation and why it saves money." },
                estimatedSavings: { type: Type.NUMBER, description: "The estimated monthly savings in the requested currency for this specific action." }
            },
            required: ['title', 'description', 'estimatedSavings']
        },
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

    const recommendationsAreValid = Array.isArray(data.recommendations) && data.recommendations.every(
        (rec: any): rec is Recommendation => 
            typeof rec === 'object' &&
            rec !== null &&
            typeof rec.title === 'string' &&
            typeof rec.description === 'string' &&
            typeof rec.estimatedSavings === 'number'
    );

    return (
        typeof data.currentCost === 'number' &&
        typeof data.optimizedCost === 'number' &&
        typeof data.savings === 'number' &&
        recommendationsAreValid &&
        typeof data.breakdown === 'object' &&
        data.breakdown !== null &&
        typeof data.breakdown.compute === 'number' &&
        typeof data.breakdown.storage === 'number' &&
        typeof data.breakdown.network === 'number' &&
        typeof data.breakdown.other === 'number'
    );
};

// Fix: Per Gemini API guidelines, API key must be from process.env.API_KEY. Removed apiKey parameter.
export const analyzeBillingData = async (billingData: string, currencyCode: string): Promise<AnalysisResponse> => {
    const fallbackResult = getDemoDataset(billingData);
    
    if (!process.env.API_KEY) {
      console.warn("API key not provided. Using fallback demo data.");
      return Promise.resolve({ result: fallbackResult, source: 'demo' });
    }
  
    try {
      // Fix: Per Gemini API guidelines, initialize with apiKey from process.env.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `Analyze this GCP billing data and provide cost optimization recommendations.
        All monetary values in your response MUST be in ${currencyCode}.

        Billing Data:
        ${billingData}
        
        Respond ONLY with valid JSON (no markdown, no explanation):
        The JSON object must contain:
        1. "currentCost": The total current cost in ${currencyCode}.
        2. "optimizedCost": The estimated cost after optimizations in ${currencyCode}.
        3. "savings": The total potential savings (currentCost - optimizedCost) in ${currencyCode}.
        4. "recommendations": An array of 3-5 objects, where each object has "title" (string), "description" (string), and "estimatedSavings" (number in ${currencyCode}).
        5. "breakdown": An object with cost breakdown for "compute", "storage", "network", and "other" in ${currencyCode}.
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
