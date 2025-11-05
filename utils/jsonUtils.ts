
import { AnalysisResult } from '../types';

/**
 * Attempts to parse a JSON string that may be embedded in other text.
 * It tries multiple methods to extract a valid JSON object.
 * @param text The raw string response from the AI.
 * @returns A parsed AnalysisResult object or null if parsing fails.
 */
export function robustJsonParse(text: string): AnalysisResult | null {
  // 1. Try direct parsing, assuming the response is a perfect JSON string.
  try {
    const parsed = JSON.parse(text);
    console.log("Parsing successful: Direct parse.")
    return parsed as AnalysisResult;
  } catch (e) {
    // This is expected if the response is not pure JSON, so we continue.
  }

  // 2. Try extracting JSON from a markdown code block (e.g., ```json ... ```).
  const markdownMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (markdownMatch && markdownMatch[1]) {
    try {
      const parsed = JSON.parse(markdownMatch[1]);
      console.log("Parsing successful: Extracted from markdown code block.")
      return parsed as AnalysisResult;
    } catch (e) {
      // Failed to parse the content of the markdown block.
    }
  }

  // 3. Try finding the first and last curly brace to extract a potential JSON object.
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const potentialJson = text.substring(firstBrace, lastBrace + 1);
    try {
      const parsed = JSON.parse(potentialJson);
      console.log("Parsing successful: Extracted from substring.")
      return parsed as AnalysisResult;
    } catch (e) {
      // The substring was not valid JSON.
    }
  }
  
  console.error('All JSON parsing methods failed.');
  return null;
}

/**
 * Validates that the parsed data object conforms to the AnalysisResult interface.
 * @param data The parsed data object.
 * @returns A boolean indicating whether the data is valid.
 */
export function validateAnalysisResult(data: any): data is AnalysisResult {
  if (!data) return false;
  const hasTotalSpend = typeof data.totalSpend === 'number';
  const hasPotentialSavings = typeof data.potentialSavings === 'number';
  const hasCostBreakdown = Array.isArray(data.costBreakdown);
  const hasRecommendations = Array.isArray(data.recommendations);
  const hasForecast = Array.isArray(data.forecast);
  
  if (!hasTotalSpend || !hasPotentialSavings || !hasCostBreakdown || !hasRecommendations || !hasForecast) {
    console.error('Validation failed: Missing one or more required top-level properties.', {
        hasTotalSpend, hasPotentialSavings, hasCostBreakdown, hasRecommendations, hasForecast
    });
    return false;
  }
  
  console.log("JSON structure validation passed.")
  return true;
}
