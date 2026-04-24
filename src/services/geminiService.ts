import { GoogleGenAI } from "@google/genai";
import { MarketData, TradingSignal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
You are a Professional Trading Strategy Expert. 
Your task is to analyze a user's trading strategy and the current market data to provide a trading signal.

Signal Types:
- BUY: Strong indication to enter a long position.
- SELL: Strong indication to enter a short position.
- WAIT: Market conditions are unclear or strategy conditions aren't met.

Your response MUST be in JSON format:
{
  "signal": "BUY" | "SELL" | "WAIT",
  "reasoning": "A concise professional explanation based on the provided strategy and data."
}
`;

export async function generateSignal(strategy: string, marketData: MarketData[]): Promise<{ signal: string; reasoning: string }> {
  try {
    const currentPrice = marketData[marketData.length - 1].price;
    const dataSummary = marketData.map(d => `Time: ${d.time}, Price: ${d.price}`).join('\n');

    const prompt = `
USER STRATEGY:
"${strategy}"

CURRENT MARKET DATA (Last 20 points):
${dataSummary}

CURRENT PRICE: ${currentPrice}

Analyze the data based on the strategy and provide the signal.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || '{}');
    return {
      signal: result.signal || 'WAIT',
      reasoning: result.reasoning || 'Insufficient data to generate a signal.'
    };
  } catch (error) {
    console.error("Error generating signal:", error);
    return {
      signal: 'WAIT',
      reasoning: 'Error communicating with AI analysis engine.'
    };
  }
}
