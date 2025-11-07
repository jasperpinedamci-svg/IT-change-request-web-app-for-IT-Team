import { GoogleGenAI } from "@google/genai";
import { NewChangeRequest } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeChangeRequest = async (
  requestDetails: Pick<NewChangeRequest, 'description' | 'reason' | 'impact' | 'system'>
): Promise<string> => {
  const { description, reason, impact, system } = requestDetails;

  const prompt = `
    Summarize the following IT change request into a single, concise paragraph. 
    Focus on the core objective, the justification, and the potential business or technical impact.
    Be professional and clear.

    Change Request Details:
    - System/Module: ${system}
    - Description: ${description}
    - Reason for Change: ${reason}
    - Impact Assessment: ${impact}

    Summary:
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error summarizing change request:", error);
    return "Could not generate summary due to an error.";
  }
};