import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

const router = Router();

// List all customers with search & pagination
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '100', search = '' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {};
    if (search) {
      const q = String(search);
      where.OR = [
        { firstName: { contains: q } },
        { lastName: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } }
      ];
    }
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          memberTier: true,
          points: true,
          primaryLocation: true,
          createdAt: true,
          lastLoginAt: true,
          _count: {
            select: { orders: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    const formattedUsers = users.map(u => ({
      id: u.id,
      name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Valued Member',
      email: u.email || '—',
      phone: u.phone || '—',
      tier: u.memberTier || 'Collector Circle',
      points: u.points || 0,
      location: u.primaryLocation || 'Dhaka',
      ordersCount: u._count?.orders || 0,
      role: u.role,
      lastLogin: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
      joinedDate: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '—'
    }));

    res.json({
      status: 'success',
      data: formattedUsers,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) { next(error); }
});

// Get single customer details with full order history & addresses
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id as string },
      include: {
        addresses: true,
        orders: {
          include: { items: true, payment: true },
          orderBy: { createdAt: 'desc' }
        },
        reviews: true,
        _count: {
          select: { orders: true, wishlistItems: true, reviews: true }
        }
      }
    });

    if (!user) {
      return next(new AppError('Customer not found', 404));
    }

    res.json({ status: 'success', data: user });
  } catch (error) { next(error); }
});

// Update customer tier or points
router.put('/:id/tier', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { memberTier, points } = req.body;
    const updateData: any = {};
    if (memberTier !== undefined) updateData.memberTier = memberTier;
    if (points !== undefined) updateData.points = Number(points);

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id as string },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        memberTier: true,
        points: true
      }
    });

    res.json({ status: 'success', data: updatedUser });
  } catch (error) { next(error); }
});

// Delete customer
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id as string }
    });
    res.json({ status: 'success', message: 'Customer account deleted successfully' });
  } catch (error) { next(error); }
});

export default router;
