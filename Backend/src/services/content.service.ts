import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { safeDbCall } from './resilientDb';

const contentMemoryStore: Record<string, any> = {
  'brand-ticker': '100% Extrait de Parfum Concentration • Handcrafted in Dhaka • Free Express Delivery Over ৳3,000',
  'difference-points': [
    { title: 'Artisanal Hydro-Distillation', desc: 'Preserving delicate floral oils in traditional copper alembic stills.' },
    { title: '12+ Hour Beast-Mode Longevity', desc: 'High oil concentration engineered for tropical heat and humidity.' },
    { title: 'Ethical Botanical Sourcing', desc: 'Supporting sustainable agarwood plantation farms across Sylhet.' },
    { title: '100% Satisfaction Guarantee', desc: 'Try sample vials risk-free before opening full-size bottles.' }
  ],
  'our-story': 'Murakkaz was born out of a deep reverence for heritage perfumery and Eastern agarwood traditions.',
  'stats': [
    { label: 'Niche Fragrances', value: '50+' },
    { label: 'Collector Circle Members', value: '15,000+' },
    { label: 'Average Review Rating', value: '4.9★' },
    { label: 'Distillation Heritage', value: '3 Generations' }
  ]
};

export const getContentByKey = async (key: string) => {
  return safeDbCall(
    async () => {
      const content = await prisma.siteContent.findUnique({
        where: { key },
      });
      if (!content) throw new AppError('Content not found', 404);
      return content.value;
    },
    () => {
      const val = contentMemoryStore[key];
      if (!val) return { message: 'Default content', key };
      return val;
    }
  );
};

export const updateContent = async (key: string, value: any) => {
  return safeDbCall(
    async () => {
      const content = await prisma.siteContent.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
      return content;
    },
    () => {
      contentMemoryStore[key] = value;
      return { id: String(Date.now()), key, value };
    }
  );
};
