import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from './env';
import { AppError } from '../middleware/errorHandler';

const uploadDir = path.join(__dirname, '../../', env.UPLOAD_DIR || 'uploads');
const avatarsDir = path.join(uploadDir, 'avatars');
const productsDir = path.join(uploadDir, 'products');

fs.mkdirSync(avatarsDir, { recursive: true });
fs.mkdirSync(productsDir, { recursive: true });

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only JPEG, PNG and WEBP are allowed', 400));
  }
};

export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter,
  limits: { fileSize: env.MAX_FILE_SIZE || 5 * 1024 * 1024 },
}).single('photo');

export const uploadProductImages = multer({
  storage: productStorage,
  fileFilter,
  limits: { fileSize: env.MAX_FILE_SIZE || 5 * 1024 * 1024 },
}).array('images', 10);
