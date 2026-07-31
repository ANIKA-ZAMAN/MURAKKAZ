import { Request, Response, NextFunction } from 'express';
import { getProducts, getProductBySlug, getProductsForComparison, getRecommendations as getRecs } from '../services/product.service';

export const listProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getProducts(req.query as any);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await getProductBySlug(req.params.slug as string);
    res.status(200).json({ data: product });
  } catch (error) {
    next(error);
  }
};

export const compareProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slugs = req.query.slugs as string;
    const products = await getProductsForComparison(slugs);
    res.status(200).json({ data: products });
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recommendations = await getRecs(req.query as any);
    res.status(200).json({ data: recommendations });
  } catch (error) {
    next(error);
  }
};
