import { GoogleGenAI } from "@google/genai";
import httpStatus from "http-status-codes";
import { z } from "zod";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAiTripPlanInput } from "./ai.interface";

const tripPlanSchema = z.object({
  destination: z.string(),
  duration: z.number(),
  estimatedCost: z.number(),
  days: z.array(
    z.object({
      day: z.number(),
      title: z.string(),
      activities: z.array(z.string()),
      meals: z.array(z.string()).optional(),
      accommodation: z.string().optional(),
    }),
  ),
  tips: z.array(z.string()),
});

const sanitizeSchemaForGemini = (schema: unknown): unknown => {
  const s = JSON.parse(JSON.stringify(schema));
  if (!s.$defs) return s;
  const defs = s.$defs;
  delete s.$defs;
  const resolve = (node: any): any => {
    if (Array.isArray(node)) return node.map(resolve);
    if (node && typeof node === "object") {
      if (node.$ref && typeof node.$ref === "string") {
        const key = node.$ref.replace("#/$defs/", "");
        return resolve(defs[key]);
      }
      const out: any = {};
      for (const k of Object.keys(node)) out[k] = resolve(node[k]);
      return out;
    }
    return node;
  };
  return resolve(s);
};

const ai = new GoogleGenAI({ apiKey: envVars.GEMINI_API_KEY });

const generateFast = async (prompt: string): Promise<any> => {
  const schema = sanitizeSchemaForGemini(z.toJSONSchema(tripPlanSchema));

  try {
    console.log("[AI] Trying gemini-3.8-flash (thinking: low)...");
    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: prompt,
      generation_config: {
        thinking_level: "low",
      },
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema,
      },
    });
    console.log("[AI] ✅ Success with 3.8-flash");
    return interaction;
  } catch (error: any) {
    const status = error?.status ?? error?.statusCode;
    console.error(`[AI] 3.8-flash failed: ${status} — ${error?.message}`);

    if (status === 404 || status === 503) {
      console.log("[AI] Falling back to gemini-2.0-flash...");
      const interaction = await ai.interactions.create({
        model: "gemini-2.0-flash",
        input: prompt,
        generation_config: {
          thinking_level: "low",
        },
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema,
        },
      });
      console.log("[AI] ✅ Success with 2.0-flash");
      return interaction;
    }
    if (status === 429) {
      console.log("[AI] Rate limited. Waiting 2s...");
      await new Promise((r) => setTimeout(r, 2000));
      const interaction = await ai.interactions.create({
        model: "gemini-3.8-flash",
        input: prompt,
        generation_config: { thinking_level: "low" },
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema,
        },
      });
      return interaction;
    }

    throw new AppError(
      httpStatus.BAD_GATEWAY,
      error?.message?.includes("high demand")
        ? "AI model is busy. Please try again in a few minutes."
        : "AI daily limit reached. Please try again tomorrow.",
    );
  }
};

export const AiServices = {
  generateTripPlan: async (input: IAiTripPlanInput) => {
    const prompt = `You are a travel planner for TravelHub, a Bangladesh-based travel agency.
Generate a ${input.days}-day trip plan for ${input.destination}.
Budget: ৳${input.budget} total for ${input.adults} adults and ${input.children} children.
${input.interests ? `Interests: ${input.interests}` : ""}

Return a JSON object with EXACTLY this structure:
{
  "destination": "string",
  "duration": number,
  "estimatedCost": number,
  "days": [
    {
      "day": number,
      "title": "string",
      "activities": ["string", "string"],
      "meals": ["string"],
      "accommodation": "string"
    }
  ],
  "tips": ["string"]
}

Make it realistic for Bangladesh travel. Use BDT currency.`;

    try {
      const interaction = await generateFast(prompt);
      const text = interaction.output_text ?? "{}";
      const parsed = tripPlanSchema.parse(JSON.parse(text));
      return parsed;
    } catch (error: any) {
      console.error("=== GEMINI FINAL ERROR ===");
      console.error("Message:", error?.message);
      console.error("Status:", error?.status);
      console.error("=========================");

      throw new AppError(
        httpStatus.BAD_GATEWAY,
        "AI service is currently busy. Please try again in a moment.",
      );
    }
  },
};
