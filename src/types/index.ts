import type { Types } from "mongoose";

export type StringOrNumber = string | number;

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: "attendee" | "organizer",
  isActive: boolean;
}

export interface Event {
  id: string | number;
  title: string;
  venue: string;
  date: Date;
}
export interface RSVP {
  id: number | string;
  userId: number | string;
  eventTitle: string;
  status: "pending" | "confirmed" | "waitlisted";
  submittedAt: Date;
}

export type UserDoc = Omit<User, "id"> & {

  password: string;

};

export type RSVPDoc = Omit<RSVP, "id" | "userId"> & {

  userId: Types.ObjectId;

};

export type EventDoc = Pick<
Event,
"title" | "venue" | "date">;

export type NewRSVPBody = Pick<RSVP, "eventTitle" | "status">;