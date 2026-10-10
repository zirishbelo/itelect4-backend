import { Router, type Request, type Response } from "express";

import { RSVP } from "../models/rsvp";

import { requireAuth } from "../middleware/auth";

import type { NewRSVPBody } from "../types/index";

 

export const rsvpRouter = Router();

 

// One line, and every route in this file is behind the token check.

// Anything above this line would be public; everything below needs a

// valid Authorization header.

rsvpRouter.use(requireAuth);

 

interface IdParam {

  id: string;

}

 

// GET /api/rsvp -- only the ones belonging to this token

rsvpRouter.get("/", async (req: Request, res: Response) => {

  const rsvps = await RSVP.find({

    userId: req.userId,

  }).sort({ submittedAt: -1 });

  res.json(rsvps);

});

// GET /api/rsvp/:id

rsvpRouter.get(

  "/:id",

  async (req: Request<IdParam>, res: Response) => {

    // Both halves matter: the right row, AND the right owner. Without

    // userId here, changing the id in the URL reads another row.

    const rsvp = await RSVP.findOne({

      _id: req.params.id,

      userId: req.userId,

    });

 

    if (!rsvp) {

      res.status(404).json({ message: "No RSVP with that id" });

      return;

    }

 

    res.json(rsvp);

  },

);

// POST /api/rsvp

rsvpRouter.post(

  "/",

  async (

    req: Request<unknown, unknown, NewRSVPBody>,

    res: Response,

  ) => {

    const rsvp = await RSVP.create({

      ...req.body,

      // Not req.body.userId. The owner comes off the verified

      // token, so a request cannot claim to be someone else by id.

      userId: req.userId,

    });

 

    res.status(201).json(rsvp);

  },

);

// PATCH /api/rsvp/:id

rsvpRouter.patch(

  "/:id",

  async (

    req: Request<IdParam, unknown, Partial<NewRSVPBody>>,

    res: Response,

  ) => {

    const rsvp = await RSVP.findOneAndUpdate(

      { _id: req.params.id, userId: req.userId },

      req.body,

      // new: return the row AFTER the change, not before.

      // runValidators: schema rules are skipped on updates otherwise.

      { new: true, runValidators: true },

    );

 

    if (!rsvp) {

      res.status(404).json({ message: "No RSVP with that id" });

      return;

    }

 

    res.json(rsvp);

  },

);

// DELETE /api/rsvp/:id

rsvpRouter.delete(

  "/:id",

  async (req: Request<IdParam>, res: Response) => {

    const rsvp = await RSVP.findOneAndDelete({

      _id: req.params.id,

      userId: req.userId,

    });

 

    if (!rsvp) {

      res.status(404).json({ message: "No RSVP with that id" });

      return;

    }

 

    // 204 means "done, and there is deliberately no body to send".

    res.status(204).send();

  },

);

