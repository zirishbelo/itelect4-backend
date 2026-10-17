import mongoose from "mongoose";

let connection: Promise<typeof mongoose> | null = null;



export function connectDB(): Promise<typeof mongoose> {

    const uri = process.env.MONGODB_URI?.trim();



    // Fail here, with a sentence, rather than three screens later with a

    // connection timeout that does not mention .env at all.

    if (!uri) {

        return Promise.reject(

            new Error(

                "MONGODB_URI is missing. Copy .env.example to .env and fill it in.",

            ),

        );

    }



    if (connection === null) {

        // Without this option, a wrong or unreachable connection string

        // does not fail -- it sits there for 31 seconds looking like a

        // hung terminal, and then errors. Five seconds is long enough for

        // a real Atlas connection and short enough to tell you something

        // is wrong.

        connection = mongoose

            .connect(uri, { serverSelectionTimeoutMS: 5000 })

            .then((m) => {

                console.log("MongoDB connected:", m.connection.name);

                return m;

            })

            .catch((err: unknown) => {

                connection = null;

                throw err;

            });

    }



    return connection;

}
