import "dotenv/config";

import mongoose from "mongoose";

import { connectDB } from "./config/db";

import { Event } from "./models/events";

import { Events } from "./data/events";

 

// npm run seed. Run it once after the database is created, and again

// after anything that empties it. Nothing else in the project writes

// events.

async function seed() {

  await connectDB();

 

  for (const event of Events) {

    // upsert: update the row with this title, or insert it if there is

    // none. Running this a second time leaves the same events, not duplicates.

    await Event.updateOne({ title: event.title }, event, { upsert: true });

  }

 

  console.log(`${Events.length} events in ${mongoose.connection.name}`);

 

  // Without this the script never ends: the connection is an open

  // socket, and Node keeps running while one is still open.

  await mongoose.disconnect();

}

 

seed().catch((err: unknown) => {

  console.error("Seed failed:", err);

  process.exit(1);

});
