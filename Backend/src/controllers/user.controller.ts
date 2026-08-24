import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { AppError } from '../middleware/errorHandler';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserProfile(req.user!.id);
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
}

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateUserProfile(req.user!.id, req.body);
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
}

export const uploadPhoto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }
    const photoPath = req.file.filename;
    const user = await userService.updateUserPhoto(req.user!.id, photoPath);
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
}

export const getPreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const preferences = await userService.getUserPreferences(req.user!.id);
    res.status(200).json({ status: 'success', data: preferences });
  } catch (error) {
    next(error);
  }
}

export const updatePreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const preferences = await userService.updateUserPreferences(req.user!.id, req.body);
    res.status(200).json({ status: 'success', data: preferences });
  } catch (error) {
    next(error);
  }
}

export const getAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addresses = await userService.getUserAddresses(req.user!.id);
    res.status(200).json({ status: 'success', data: addresses });
  } catch (error) {
    next(error);
  }
}

export const createAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = await userService.createAddress(req.user!.id, req.body);
    res.status(201).json({ status: 'success', data: address });
  } catch (error) {
    next(error);
  }
}

export const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = await userService.updateAddress(req.user!.id, req.params.id as string, req.body);
    res.status(200).json({ status: 'success', data: address });
  } catch (error) {
    next(error);
  }
}

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.deleteAddress(req.user!.id, req.params.id as string);
    res.status(200).json({ status: 'success', message: 'Address deleted' });
  } catch (error) {
    next(error);
  }
}
