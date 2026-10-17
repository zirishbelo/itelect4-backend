import { Schema, model } from "mongoose";

import type { EventDoc } from "../types/index";

const eventSchema = new Schema<EventDoc>({
  title: { type: String, required: true },
  venue: { type: String, required: true },
  date: { type: Date, required: true },
});

eventSchema.set("toJSON", {

  transform(_doc, ret: Record<string, unknown>) {

    ret.id = String(ret._id);

    delete ret._id;

    delete ret.__v;

    return ret;

  },

});

 

export const Event = model<EventDoc>("Event", eventSchema);
