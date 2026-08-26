import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

const router = Router();

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
          createdAt: true,
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
      ordersCount: u._count?.orders || 0,
      role: u.role,
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

export default router;
