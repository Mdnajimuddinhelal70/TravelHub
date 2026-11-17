import { GoogleGenAI } from "@google/genai";
import httpStatus from "http-status-codes";
import { z } from "zod";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAiTripPlanInput } from "./ai.interface";

/* ============================================================
 *  ZOD SCHEMA
 * ============================================================ */
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

/* ============================================================
 *  GEMINI SCHEMA HELPER ($ref/$defs flatten)
 * ============================================================ */
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
      for (const k of Object.keys(node)) {
        out[k] = resolve(node[k]);
      }
      return out;
    }
    return node;
  };

  return resolve(s);
};

/* ============================================================
 *  AI CLIENT
 * ============================================================ */
const ai = new GoogleGenAI({ apiKey: envVars.GEMINI_API_KEY });

/* ============================================================
 *  HELPERS — Sleep
 * ============================================================ */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ============================================================
 *  RETRY LOGIC — Try multiple models + retries
 * ============================================================ */
const MODEL_PRIORITY = [
  "gemini-3.8-flash",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
];

const generateWithRetry = async (prompt: string): Promise<any> => {
  let lastError: any;

  for (const model of MODEL_PRIORITY) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[AI] Trying model: ${model} (attempt ${attempt}/2)...`);

        const interaction = await ai.interactions.create({
          model,
          input: prompt,
          response_format: {
            type: "text",
            mime_type: "application/json",
            schema: sanitizeSchemaForGemini(z.toJSONSchema(tripPlanSchema)),
          },
        });

        console.log(`[AI] ✅ Success with model: ${model}`);
        return interaction;
      } catch (error: any) {
        lastError = error;
        const status = error?.status ?? error?.statusCode;
        const msg = error?.message ?? "Unknown";

        console.error(
          `[AI] ❌ ${model} attempt ${attempt} failed: ${status} — ${msg}`,
        );
        if (status === 404) {
          break;
        }
        if ((status === 503 || status === 429) && attempt < 2) {
          const waitMs = attempt * 3000; // 3s
          console.log(`[AI] Waiting ${waitMs}ms before retry...`);
          await sleep(waitMs);
          continue;
        }
        break;
      }
    }
  }

  throw lastError;
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
      const interaction = await generateWithRetry(prompt);

      const text = interaction.output_text ?? "{}";
      const parsed = tripPlanSchema.parse(JSON.parse(text));

      return parsed;
    } catch (error: any) {
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        "AI service is currently busy. Please try again in a few moments.",
      );
    }
  },
};
