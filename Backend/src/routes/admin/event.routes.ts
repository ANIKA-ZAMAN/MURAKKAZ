import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { uploadEventImage } from '../../config/upload';

const router = Router();

// Upload event image endpoint
router.post('/upload', uploadEventImage, (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new AppError('No image file uploaded', 400));
    }
    const relativePath = `/uploads/events/${req.file.filename}`;
    res.status(200).json({
      status: 'success',
      data: {
        url: relativePath,
        filename: req.file.filename,
        size: req.file.size
      }
    });
  } catch (error) {
    next(error);
  }
});

// List all events for admin
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        _count: {
          select: { reminders: true }
        }
      },
      orderBy: [
        { isUpcoming: 'desc' },
        { eventDate: 'desc' }
      ]
    });
    res.json({ status: 'success', data: events });
  } catch (error) {
    next(error);
  }
});

// Get single event
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const event = await prisma.event.findFirst({
      where: {
        OR: [{ id }, { slug: id }]
      },
      include: {
        galleryImages: true,
        _count: { select: { reminders: true } }
      }
    });

    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    res.json({ status: 'success', data: event });
  } catch (error) {
    next(error);
  }
});

// Create event
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      slug: customSlug,
      description,
      image,
      day,
      month,
      time,
      location,
      category,
      isUpcoming,
      eventDate
    } = req.body;

    if (!title || !description) {
      return next(new AppError('Event title and description are required', 400));
    }

    // Generate unique slug
    let baseSlug = (customSlug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (!baseSlug) baseSlug = `event-${Date.now()}`;

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.event.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Parse event date
    let parsedDate = new Date();
    if (eventDate) {
      const d = new Date(eventDate);
      if (!isNaN(d.getTime())) parsedDate = d;
    }

    const event = await prisma.event.create({
      data: {
        title,
        slug: uniqueSlug,
        description,
        image: image || '/images/events/sadid.jpg',
        day: day ? String(day).padStart(2, '0') : String(parsedDate.getDate()).padStart(2, '0'),
        month: month ? String(month).toUpperCase() : parsedDate.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        time: time || '4:00 PM - 7:00 PM',
        location: location || 'Dhaka Flagship Atelier',
        category: category || 'Exhibition',
        isUpcoming: isUpcoming !== undefined ? Boolean(isUpcoming) : true,
        eventDate: parsedDate
      }
    });

    res.status(201).json({ status: 'success', data: event });
  } catch (error) {
    next(error);
  }
});

// Update event
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const {
      title,
      slug,
      description,
      image,
      day,
      month,
      time,
      location,
      category,
      isUpcoming,
      eventDate
    } = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (day !== undefined) updateData.day = String(day).padStart(2, '0');
    if (month !== undefined) updateData.month = String(month).toUpperCase();
    if (time !== undefined) updateData.time = time;
    if (location !== undefined) updateData.location = location;
    if (category !== undefined) updateData.category = category;
    if (isUpcoming !== undefined) updateData.isUpcoming = Boolean(isUpcoming);
    if (eventDate !== undefined) {
      const d = new Date(eventDate);
      if (!isNaN(d.getTime())) updateData.eventDate = d;
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData
    });

    res.json({ status: 'success', data: event });
  } catch (error) {
    next(error);
  }
});

// Delete event
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await prisma.event.delete({ where: { id } });
    res.json({ status: 'success', message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
