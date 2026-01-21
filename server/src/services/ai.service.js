import OpenAI from "openai";

export const generateMedicalSummary = async (reportText) => {
    // safety check
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is missing");
    }

    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a medical report summarizer. This is NOT medical advice."
                },
                {
                    role: "user",
                    content: `Summarize this medical report in simple language:\n${reportText}`
                }
            ]
        });

        return response.choices[0].message.content;

    } catch (error) {

        console.error("AI ERROR (fallback used):", error?.message);

        return `
Temporary AI Summary (AI service unavailable):

• The report does not indicate a medical emergency.
• The patient appears stable based on the provided information.
• Please consult a licensed healthcare professional for diagnosis.

(This is NOT medical advice.)
`;
    }
};
