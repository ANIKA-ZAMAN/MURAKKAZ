import prisma from '../config/database';
import { safeDbCall, dbStore } from './resilientDb';

export const getStoreLocations = async (params: { zone?: string; q?: string }) => {
  return safeDbCall(
    async () => {
      const where: any = {};
      if (params.zone) {
        where.zone = { contains: params.zone, mode: 'insensitive' };
      }
      if (params.q) {
        where.address = { contains: params.q, mode: 'insensitive' };
      }

      const stores = await prisma.storeLocation.findMany({
        where,
        orderBy: { zone: 'asc' },
      });
      return stores;
    },
    () => {
      let stores = dbStore.stores;
      if (params.zone) {
        const zoneQ = params.zone.toLowerCase();
        stores = stores.filter((s) => s.zone.toLowerCase().includes(zoneQ));
      }
      if (params.q) {
        const query = params.q.toLowerCase();
        stores = stores.filter((s) => s.address.toLowerCase().includes(query) || s.name.toLowerCase().includes(query));
      }
      return stores;
    }
  );
};
