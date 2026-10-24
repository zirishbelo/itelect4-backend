import { z } from "zod";

export const rsvpReviewRequestSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(
      20,
      "Describe the student, event, and RSVP flow in at least 20 characters.",
    )
    .max(2000, "Keep the RSVP system description under 2000 characters."),
});

export const rsvpReviewSchema = z.object({
  summary: z
    .string()
    .describe(
      "One sentence explaining how students/users, events, and RSVP records work together.",
    ),

  userObservations: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe(
      "One to three observations about student identity, authentication, attendee/organizer roles, and RSVP ownership.",
    ),

  eventObservations: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe(
      "One to three observations about event title, venue, date, event discovery, and what users can see.",
    ),

  rsvpObservations: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe(
      "One to three observations about connecting a user to an event title, creating or viewing RSVP records, and handling pending, confirmed, or waitlisted status.",
    ),

  systemStatus: z
    .enum(["complete", "needs-work", "incomplete"])
    .describe(
      "Whether the described student, event, and RSVP flow is complete enough to use.",
    ),
});

export type RsvpSystemReview = z.infer<typeof rsvpReviewSchema>;

// Computed once, when this file is first imported -- not per request.
export const rsvpReviewJsonSchema = z.toJSONSchema(rsvpReviewSchema);
