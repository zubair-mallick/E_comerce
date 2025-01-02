import multer from 'multer';
import { cloudinary } from '../config/cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v4 as uuid } from 'uuid';
import { Request } from 'express'; // Import Request from express for typing

// Extend the default params with folder
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',  // Specify the folder in Cloudinary where images will be uploaded
    format: async (req: Request, file: Express.Multer.File): Promise<string> => {
      // Specify allowed formats based on the file's mimetype or originalname
      const ext = file.mimetype.split('/')[1]; // Extract format from mimetype
      return ext === 'png' || ext === 'jpeg' ? ext : 'jpeg'; // Default to jpeg if not png
    },
    public_id: (req: Request, file: Express.Multer.File): string => uuid(), // Unique ID for the file
  } as Record<string, unknown>  // Cast 'params' to accept extra fields
});

export const multiUpload = multer({ storage }).array('photos', 5); // 'photos' is the field name, allowing up to 5 files

