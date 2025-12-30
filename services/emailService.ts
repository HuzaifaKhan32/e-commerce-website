import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.NEXT_PUBLIC_API_KEY || process.env.API_KEY || "AIzaSyDU9rZTXCBXg8AevQF7ReDR4BJ2GCw9gaU";

let ai: GoogleGenAI | null = null;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
}

export async function generateEmailContent(type: 'order' | 'shipping', data: any) {
  if (!ai) {
    console.warn("Gemini API Key is missing. Email content generation skipped.");
    return { subject: "Order Update", body: "Please configure your API key to see the AI generated email." };
  }

  const prompt = type === 'order' 
    ? `Write a premium, high-end luxury brand email confirmation for a customer named ${data.customerName} who just purchased ${data.items.join(', ')}. The total was $${data.total}. Use a sophisticated, artisanal tone. Mention heritage and quality. Return only the subject and body as separate lines, separated by "---".`
    : `Write a sophisticated shipping update email for customer ${data.customerName}. Their artisanal order is now in transit. Mention the anticipation of luxury. Return subject and body separated by "---".`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
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
  } catch (error) {
      console.error("Gemini API Error:", error);
      return { subject: "Notification", body: "Unable to generate email content." };
  }
}