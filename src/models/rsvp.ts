import { Schema, model } from "mongoose";

import type { RSVPDoc } from "../types/index";

const rsvpSchema = new Schema<RSVPDoc>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    eventTitle: {
        type: String,
        required: [true, "Event title is required"],
        uppercase: true,
        trim: true,
        minlength: [3, "Event title must be at least 3 characters"],
        maxlength: [100, "Event title must be at most 100 characters"],
    },


    status: {
        type: String,
        enum: ["pending", "confirmed", "waitlisted"],
        required: true
    },

    submittedAt: {
        type: Date,
        default: Date.now
    }

});

rsvpSchema.set("toJSON", {

  transform(_doc, ret: Record<string, unknown>) {

    ret.id = String(ret._id);

    delete ret._id;

    delete ret.__v;

    return ret;

  },

});


export const RSVP = model<RSVPDoc>("RSVP", rsvpSchema);
