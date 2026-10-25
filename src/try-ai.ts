import "dotenv/config";
import { reviewRsvpSystem } from "./ai/gemini";

async function tryAi() {
    const review = await reviewRsvpSystem(
        "An RSVP Tracker in React and TypeScript lets students register and " +
            "log in, browse events by title and venue, then create an RSVP with " +
            "pending, confirmed, or waitlisted status. The Express and MongoDB " +
            "API uses the authenticated user's id to protect their RSVP records.",
    );

    console.log(JSON.stringify(review, null, 2));
}

tryAi().catch((err: unknown) => {
    console.error("Gemini call failed:", err);
    process.exit(1);
});
