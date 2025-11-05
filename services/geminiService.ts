
import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisResult, AnalysisResponse } from '../types';
import { DEMO_DATASETS } from '../constants';
import { robustJsonParse, validateAnalysisResult } from '../utils/jsonUtils';

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    totalSpend: { type: Type.NUMBER, description: "The total calculated cost from the billing data." },
    potentialSavings: { type: Type.NUMBER, description: "The total estimated savings from all recommendations." },
    costBreakdown: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          service: { type: Type.STRING },
          cost: { type: Type.NUMBER },
        },
        required: ['service', 'cost'],
      },
    },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          estimatedSavings: { type: Type.NUMBER },
        },
        required: ['title', 'description', 'estimatedSavings'],
      },
    },
    forecast: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          month: { type: Type.STRING },
          cost: { type: Type.NUMBER, nullable: true },
          predictedCost: { type: Type.NUMBER, nullable: true },
        },
        required: ['month'],
      },
    },
  },
  required: ['totalSpend', 'potentialSavings', 'costBreakdown', 'recommendations', 'forecast'],
};

/**
 * Selects a relevant demo dataset based on the user's input data.
 * @param billingData The raw billing data string.
 * @returns An AnalysisResult object from the predefined demo datasets.
 */
const selectDemoData = (billingData: string): AnalysisResult => {
  const lowerCaseData = billingData.toLowerCase();
  if (lowerCaseData.includes('enterprise') || (billingData.match(/\$\d{5,}/g)?.length ?? 0) > 0) {
    return DEMO_DATASETS.ENTERPRISE;
  }
  if (lowerCaseData.includes('mid') || lowerCaseData.includes('k8s') || lowerCaseData.includes('kubernetes')) {
    return DEMO_DATASETS.MID_MARKET;
  }
  if (lowerCaseData.includes('dev') || lowerCaseData.includes('staging') || lowerCaseData.includes('waste')) {
    return DEMO_DATASETS.DEV_WASTE;
  }
  if (lowerCaseData.includes('startup') || lowerCaseData.includes('cloud run') || lowerCaseData.includes('firestore')) {
    return DEMO_DATASETS.STARTUP;
  }
  return DEMO_DATASETS.DEFAULT;
};

export const analyzeBillingData = async (billingData: string, apiKey?: string): Promise<AnalysisResponse> => {
  const fallbackResult = selectDemoData(billingData);
  
  if (!apiKey) {
    console.warn("API key not provided. Using fallback demo data.");
    return Promise.resolve({ result: fallbackResult, source: 'demo' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      You are a GCP cost analysis API. Your SOLE function is to analyze the provided GCP billing data and return a JSON object.
      The input data is:
      ---
      ${billingData}
      ---
      Your response MUST be a single, raw JSON object. Do not wrap it in markdown backticks (e.g., \`\`\`json), do not add any introductory or concluding text, and do not add any explanations. The response should be immediately parsable by a JSON parser. Adhere strictly to the provided JSON schema. Any deviation will result in a failed request.

      The JSON object must contain:
      1.  'totalSpend': A number representing the total monthly cost.
      2.  'potentialSavings': A number representing the identified waste or potential savings.
      3.  'costBreakdown': An array of objects for the top 5 services.
      4.  'recommendations': An array of 3-5 specific, actionable recommendation objects.
      5.  'forecast': An array of 6 objects (3 past, 3 future prediction). For past months, use the 'cost' key. For future months, use the 'predictedCost' key.
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
    console.log("Raw Gemini Response:", jsonString); // Log raw response for debugging

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
