import { genkit, z } from "genkit";
import { vertexAI, gemini20Flash } from "@genkit-ai/vertexai";
import { onCallGenkit } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params"; // ✅ Only import from here
import { enableFirebaseTelemetry } from "@genkit-ai/firebase";

enableFirebaseTelemetry();

const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");

const ai = genkit({
  plugins: [vertexAI({ location: "us-central1" })],
});

const menuSuggestionFlow = ai.defineFlow({
  name: "menuSuggestionFlow",
  inputSchema: z.string().describe("A restaurant theme").default("seafood"),
  outputSchema: z.string(),
  streamSchema: z.string(),
}, async (subject, { sendChunk }) => {
  const prompt = `Suggest an item for the menu of a ${subject} themed restaurant`;
  const { response, stream } = ai.generateStream({
    model: gemini20Flash,
    prompt,
    config: { temperature: 1 },
  });

  for await (const chunk of stream) {
    sendChunk(chunk.text);
  }

  return (await response).text;
});

export const menuSuggestion = onCallGenkit({
  secrets: [apiKey],
}, menuSuggestionFlow);
