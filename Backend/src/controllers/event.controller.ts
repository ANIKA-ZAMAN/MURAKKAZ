import { Request, Response, NextFunction } from 'express';
import * as eventService from '../services/event.service';

export const listEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const upcoming = req.query.upcoming === 'true' ? true : req.query.upcoming === 'false' ? false : undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    const result = await eventService.getEvents({ upcoming, page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventService.getEventBySlug(req.params.slug as string);
    res.json(event);
  } catch (error) {
    next(error);
  }
};

export const setReminder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    const reminder = await eventService.setEventReminder(req.params.slug as string, req.body, userId);
    res.status(201).json(reminder);
  } catch (error) {
    next(error);
  }
};
