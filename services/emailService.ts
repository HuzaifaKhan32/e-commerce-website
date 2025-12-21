
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateEmailContent(type: 'order' | 'shipping', data: any) {
  const prompt = type === 'order' 
    ? `Write a premium, high-end luxury brand email confirmation for a customer named ${data.customerName} who just purchased ${data.items.join(', ')}. The total was $${data.total}. Use a sophisticated, artisanal tone. Mention heritage and quality. Return only the subject and body as separate lines, separated by "---".`
    : `Write a sophisticated shipping update email for customer ${data.customerName}. Their artisanal order is now in transit. Mention the anticipation of luxury. Return subject and body separated by "---".`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.7,
      maxOutputTokens: 400
    }
  });

  const text = response.text || "";
  const [subject, ...bodyParts] = text.split('---');
  
  return {
    subject: subject.replace('Subject:', '').trim(),
    body: bodyParts.join('---').trim()
  };
}
