import { GoogleGenAI, type Content } from "@google/genai";
import { MODEL, SYSTEM_PROMPT, EXAMPLES, wrap } from "./prompt";
import {
    rsvpReviewSchema,
    rsvpReviewJsonSchema,
    type RsvpSystemReview,
} from "../schemas/rsvpReview";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error(
            "GEMINI_API_KEY is missing. Add it to .env, and to Vercel.",
        );
    }

    if (client === null) {
        client = new GoogleGenAI({ apiKey });
    }

    return client;
}

function buildRsvpContents(description: string): Content[] {
    const shots: Content[] = EXAMPLES.flatMap((example) => [
        { role: "user", parts: [{ text: wrap(example.description) }] },
        {
            role: "model",
            parts: [{ text: JSON.stringify(example.response) }],
        },
    ]);

    return [
        ...shots,
        { role: "user", parts: [{ text: wrap(description) }] },
    ];
}

export class AiReplyError extends Error {}

export async function reviewRsvpSystem(
    description: string,
): Promise<RsvpSystemReview> {
    const response = await getClient().models.generateContent({
        model: MODEL,
        contents: buildRsvpContents(description),
        config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: "application/json",
            responseJsonSchema: rsvpReviewJsonSchema,
        },
    });

    const text = response.text;

    if (!text) {
        throw new AiReplyError("Gemini sent back no text");
    }

    let data: unknown;

    try {
        data = JSON.parse(text);
    } catch {
        throw new AiReplyError("Gemini's reply was not JSON");
    }

    const result = rsvpReviewSchema.safeParse(data);

    if (!result.success) {
        throw new AiReplyError("Gemini's reply did not match the RSVP schema");
    }

    return result.data;
}
