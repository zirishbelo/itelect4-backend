import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../src/app";

const validRsvpSystemDescription =
    "Students browse events and manage their RSVP status.";

vi.mock("../src/config/db", () => ({
    connectDB: async () => { },
}));

function tokenFor(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: "5m",
    });
}

describe("POST /api/ai", () => {
    it("answers 401 when there is no token", async () => {
        const res = await request(app)
            .post("/api/ai")
            .send({ prompt: validRsvpSystemDescription });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe(
            "No token. Send Authorization: Bearer <token>",
        );
    });

    it("lets a valid token through, then checks the body", async () => {
        // "Too short" is 9 characters, so rsvpReviewRequestSchema refuses it
        // before reviewRsvpSystem() runs -- Gemini is never called.
        const res = await request(app)
            .post("/api/ai")
            .set("Authorization", `Bearer ${tokenFor("test-user")}`)
            .send({ prompt: "Too short" });

        expect(res.status).toBe(400);
        expect(res.body.errors).toEqual([
            "Describe the student, event, and RSVP flow in at least 20 characters.",
        ]);
    });
});
