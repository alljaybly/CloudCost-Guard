
import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisResult } from '../types';
import { DEMO_ANALYSIS_RESULT } from '../constants';

const API_KEY = process.env.API_KEY;

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    totalSpend: { type: Type.NUMBER },
    potentialSavings: { type: Type.NUMBER },
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
          cost: { type: Type.NUMBER, optional: true },
          predictedCost: { type: Type.NUMBER, optional: true },
        },
        required: ['month'],
      },
    },
  },
  required: ['totalSpend', 'potentialSavings', 'costBreakdown', 'recommendations', 'forecast'],
};


export const analyzeBillingData = async (billingData: string): Promise<AnalysisResult> => {
  if (!API_KEY) {
    console.warn("API_KEY not found. Using fallback demo data.");
    return Promise.resolve(DEMO_ANALYSIS_RESULT);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const prompt = `
      You are an expert GCP cost optimization analyst named CloudCost Guard.
      Analyze the following GCP billing data. The data is:
      ---
      ${billingData}
      ---
      Based on this data, provide a detailed cost analysis. Your response MUST be a valid JSON object that strictly adheres to the provided schema. Do not include any text, markdown formatting, or explanations outside of the final JSON object.

      The JSON object should contain:
      1.  'totalSpend': A number representing the total monthly cost.
      2.  'potentialSavings': A number representing the identified waste or potential savings. This should be a significant but realistic portion of the total spend.
      3.  'costBreakdown': An array of objects for the top 5 services, each with a 'service' (string) and 'cost' (number).
      4.  'recommendations': An array of 3-5 specific, actionable recommendation objects, each with a 'title' (string), a 'description' (string), and 'estimatedSavings' (number).
      5.  'forecast': An array of 6 objects, each with a 'month' (string e.g., 'Jan', 'Feb'). The first 3 should represent past spending based on the data, using the 'cost' key. The next 3 should be a future prediction, using the 'predictedCost' key.
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
    const result: AnalysisResult = JSON.parse(jsonString);
    return result;

  } catch (error) {
    console.error("Error analyzing billing data with Gemini:", error);
    console.warn("Falling back to demo data due to API error.");
    return DEMO_ANALYSIS_RESULT;
  }
};
