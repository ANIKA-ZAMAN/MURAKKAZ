import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { safeDbCall, dbStore } from './resilientDb';

export const getEvents = async (params: { upcoming?: boolean; page?: number; limit?: number }) => {
  const page = params.page || 1;
  const limit = params.limit || 6;
  const skip = (page - 1) * limit;

  return safeDbCall(
    async () => {
      const where: any = {};
      if (params.upcoming !== undefined) {
        where.isUpcoming = params.upcoming;
      }

      const orderBy = params.upcoming
        ? { eventDate: 'asc' as const }
        : { eventDate: 'desc' as const };

      const [events, total] = await Promise.all([
        prisma.event.findMany({
          where,
          orderBy,
          skip,
          take: limit,
        }),
        prisma.event.count({ where }),
      ]);

      return {
        data: events,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    },
    () => {
      let events = dbStore.events as any[];
      if (params.upcoming !== undefined) {
        events = events.filter((e) => e.isUpcoming === params.upcoming);
      }
      const total = events.length;
      const paginated = events.slice(skip, skip + limit);
      return {
        data: paginated,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    }
  );
};

export const getEventBySlug = async (slug: string) => {
  return safeDbCall(
    async () => {
      const event = await prisma.event.findUnique({
        where: { slug },
        include: { galleryImages: true },
      });

      if (!event) throw new AppError('Event not found', 404);
      return event;
    },
    () => {
      const event = dbStore.events.find((e) => e.slug === slug || e.id === slug);
      if (!event) throw new AppError('Event not found', 404);
      return event as any;
    }
  );
};

export const setEventReminder = async (
  slug: string,
  data: { name: string; email: string },
  userId?: string
) => {
  return safeDbCall(
    async () => {
      const event = await prisma.event.findUnique({ where: { slug } });
      if (!event) throw new AppError('Event not found', 404);

      const existingReminder = await prisma.eventReminder.findFirst({
        where: { eventId: event.id, email: data.email },
      });

      if (existingReminder) throw new AppError('Reminder already set', 409);

      const reminder = await prisma.eventReminder.create({
        data: { eventId: event.id, name: data.name, email: data.email, userId },
      });

      return reminder;
    },
    () => {
      const event = dbStore.events.find((e) => e.slug === slug || e.id === slug);
      if (event) {
        event.remindersCount += 1;
      }
      return {
        id: String(Date.now()),
        eventId: event ? event.id : 'evt-1',
        userId: userId || null,
        name: data.name,
        email: data.email,
        sentAt: null,
        createdAt: new Date()
      };
    }
  );
};

export const subscribeNewsletter = async (email: string, source: string = 'upcoming_events') => {
  return safeDbCall(
    async () => {
      const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
      if (existing) {
        return { message: 'Already subscribed', subscriber: existing };
      }
      const subscriber = await prisma.newsletterSubscriber.create({
        data: { email, source },
      });
      return { message: 'Subscription successful', subscriber };
    },
    () => {
      return {
        message: 'Subscription successful',
        subscriber: { id: String(Date.now()), email, source, createdAt: new Date() }
      };
    }
  );
};

