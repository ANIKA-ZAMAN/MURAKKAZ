import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../config/database';
import { safeDbCall } from '../../services/resilientDb';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await safeDbCall(
      async () => {
        const [
          totalUsers,
          totalOrders,
          nonCancelledOrders,
          totalProducts,
          recentOrders,
          ordersByStatus,
          allOrderItems
        ] = await Promise.all([
          prisma.user.count(),
          prisma.order.count(),
          prisma.order.findMany({
            where: { status: { notIn: ['CANCELLED', 'REFUNDED'] } },
            select: { grandTotal: true, createdAt: true }
          }),
          prisma.product.count({ where: { isActive: true } }),
          prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
              user: { select: { firstName: true, lastName: true, email: true } },
              items: true,
              payment: true
            }
          }),
          prisma.order.groupBy({
            by: ['status'],
            _count: true
          }),
          prisma.orderItem.findMany({
            include: {
              product: {
                select: { id: true, name: true, image: true, sizes: true }
              }
            }
          })
        ]);

        const totalRevenue = nonCancelledOrders.reduce((acc: number, order: any) => acc + (Number(order.grandTotal) || 0), 0);

        // Aggregate Top Products by Product + Selected Size with real cost & ml
        const productStatsMap: Record<string, {
          id: string;
          name: string;
          size: string;
          unitPrice: number;
          sales: number;
          revenue: number;
          image: string;
        }> = {};

        for (const item of allOrderItems) {
          const key = `${item.productName}_${item.selectedSize}`;
          if (!productStatsMap[key]) {
            productStatsMap[key] = {
              id: item.productId || key,
              name: item.productName,
              size: item.selectedSize || '30ml',
              unitPrice: item.unitPrice || 0,
              sales: 0,
              revenue: 0,
              image: item.productImage || item.product?.image || ''
            };
          }
          productStatsMap[key].sales += item.quantity || 1;
          productStatsMap[key].revenue += item.totalPrice || ((item.unitPrice || 0) * (item.quantity || 1));
          if (!productStatsMap[key].unitPrice && item.unitPrice) {
            productStatsMap[key].unitPrice = item.unitPrice;
          }
        }

        const topProducts = Object.values(productStatsMap)
          .sort((a, b) => b.revenue - a.revenue || b.sales - a.sales)
          .slice(0, 6)
          .map(p => ({
            id: p.id,
            name: p.name,
            size: p.size,
            unitPrice: p.unitPrice,
            unitPriceFormatted: `৳ ${p.unitPrice.toLocaleString()}`,
            sales: p.sales,
            revenue: `৳ ${p.revenue.toLocaleString()}`,
            rawRevenue: p.revenue,
            image: p.image
          }));

        // Dynamic 6-month revenue calculation
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();
        const revenueMap: Record<string, number> = {};

        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${monthNames[d.getMonth()]} ${d.getFullYear() !== now.getFullYear() ? d.getFullYear() : ''}`.trim();
          revenueMap[key] = 0;
        }

        for (const order of nonCancelledOrders) {
          const d = new Date(order.createdAt);
          const key = `${monthNames[d.getMonth()]} ${d.getFullYear() !== now.getFullYear() ? d.getFullYear() : ''}`.trim();
          if (revenueMap[key] !== undefined) {
            revenueMap[key] += Number(order.grandTotal) || 0;
          }
        }

        const revenueData = Object.entries(revenueMap).map(([name, revenue]) => ({
          name,
          revenue
        }));

        return {
          totalUsers,
          totalOrders,
          totalRevenue,
          totalProducts,
          recentOrders,
          ordersByStatus: ordersByStatus.map(s => ({ name: s.status, value: s._count })),
          topProducts,
          revenueData
        };
      },
      () => {
        return {
          totalUsers: 0,
          totalOrders: 0,
          totalRevenue: 0,
          totalProducts: 0,
          recentOrders: [],
          ordersByStatus: [],
          topProducts: [],
          revenueData: []
        } as any;
      }
    ) as any;

    res.json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
});

export default router;
