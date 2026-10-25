import { Router, type Request, type Response } from "express";

import { Event } from "../models/events";



export const eventRouter = Router();



// There is no requireAuth line in this file, and that is the point.

// rsvp.ts puts one at the top so every route below it is

// private; the event list is what the app shows before anybody has

// logged in, so these two are public on purpose.



// GET /api/events

eventRouter.get("/", async (_req: Request, res: Response) => {

    const events = await Event.find().sort({ title: 1 });

    res.json(events);

});

interface TitleParam {
    title: string;
}

// GET /api/events/:title

eventRouter.get(

    "/:title",

    async (req: Request<TitleParam>, res: Response) => {

        // The frontend requests a single event by its title.

        // The real API returns the matching event directly.

        // This returns the matching event directly.

        //

        const event = await Event.findOne({

            // Event titles are stored as entered, so query the exact title.

            //

            title: req.params.title,

        });



        if (!event) {

            res.status(404).json({

                message: `No event with title "${req.params.title}"`,

            });

            return;

        }



        res.json(event);

    },

);
