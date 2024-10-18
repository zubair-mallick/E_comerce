import { TryCatch } from "../middleware/error.js";
import { Request, Response } from "express";
import { NewProductRequestBody } from "../types/types.js";
import { Product } from "../models/products.js";

export const newProduct = TryCatch(async(req: Request<{}, {}, NewProductRequestBody>, res, next) => {
  const { name, price, stock, category } = req.body;
  const photo = req.file;

  if (!photo) {
    return res.status(400).json({
      success: false,
      message: 'Photo is required'
    });
  }

  const photoUrl = photo.path; // Cloudinary provides the file URL in 'path'

  await Product.create({ name, price, stock, category: category.toLowerCase(), photo: photoUrl });

  return res.status(201).json({
    success: true,
    message: 'Product created successfully'
  });
});
