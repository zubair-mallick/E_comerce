import { extractPublicId } from "cloudinary-build-url";
import { Request } from "express";
import { myCache } from "../app.js";
import { cloudinary } from "../config/cloudinary.js"; // Import Cloudinary
import { TryCatch } from "../middleware/error.js";
import { Product } from "../models/products.js";
import { NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import { invalidateCache } from "../utils/features.js";
import ErrorHandler from "../utils/utitlity-class.js";

export const getlatestProducts = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    let products = [];

    if (myCache.has("latest-product"))
      products = JSON.parse(myCache.get("latest-product") as string);
    else {
      products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
      myCache.set("latest-product", JSON.stringify(products));
    }

    return res.status(200).json({
      success: true,
      products,
      message: "latest products fetched sucessfully",
    });
  }
);

export const getAllCategories = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const categories = await Product.distinct("category");

    return res.status(200).json({
      success: true,
      categories,
      message: "ALL categories fetched sucessfully",
    });
  }
);

export const getAdminProducts = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    let products;
    if (myCache.has("adminProducts"))
      products = JSON.parse(myCache.get("adminProducts") as string);
    else {
      products = await Product.find({});
      myCache.set("adminProducts", JSON.stringify(products));
    }

    return res.status(200).json({
      success: true,
      products,
      message: "all products fetched sucessfully",
    });
  }
);

export const getSingleProduct = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  let product;
  if (myCache.has(`singleProduct-${id}`))
    product = JSON.parse(myCache.get(`singleProduct-${id}`) as string);
  else {
    product = await Product.findById(id);

    if (!product) {
      return next(new ErrorHandler(`No product found `, 404));
    }

    myCache.set(`singleProduct-${id}`, JSON.stringify(product));
  }

  return res.status(200).json({
    success: true,
    product,
    message: "product fetched sucessfully",
  });
});

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    if (!photo) {
      return res.status(400).json({
        success: false,
        message: "Photo is required",
      });
    }

    const missingFields: string[] = [];
    if (!name) missingFields.push("product name");
    if (!price) missingFields.push("price");
    if (!stock) missingFields.push("stock");
    if (!category) missingFields.push("category");

    // Check for missing fields and delete image if there are any
    if (missingFields.length > 0) {
      // Extract public_id from the Cloudinary URL for deletion
      const publicId = photo.filename;

      // Delete the uploaded photo from Cloudinary
      await cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error("Error deleting image from Cloudinary:", error);
          return next(new ErrorHandler("Image deletion failed", 500));
        }
      });

      // Throw the error for missing fields after image deletion
      return next(
        new ErrorHandler(`Missing fields: ${missingFields.join(", ")}`, 405)
      );
    }

    const photoUrl = photo.path; // Cloudinary provides the file URL in 'path'

    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photoUrl,
    });

    // await invalidateCache({product:true});

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  }
);

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const { name, price, stock, category } = req.body;
  const photo = req.file;

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler(`No product found`, 404));
  }

  if (photo) {
    const imageUrl = product.photo;
    const publicId = extractPublicId(imageUrl);

    cloudinary.uploader.destroy(
      publicId!,
      { invalidate: true, resource_type: "image" },
      function (error, result) {
        if (result) {
          console.log("old photo Deleted successfully:", result);
        } else {
          console.log("Error:", error);
        }

        console.log(photo.path);

        product.photo = photo.path;
      }
    );
  }

  if (photo) product.photo = photo.path;
  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  const newproduct = await product.save();

  await invalidateCache({ product: true, productId: String(product._id) });
  return res.status(200).json({
    success: true,
    product,
    newproduct,
    message: "product updated successfully",
  });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler(`No product found`, 404));
  }
  console.log(product)
  const imageUrl = product.photo;
  const publicId = extractPublicId(imageUrl);

  if (imageUrl && publicId) {
    cloudinary.uploader.destroy(
      publicId!,
      { invalidate: true, resource_type: "image" },
      function (error, result) {
        if (result) {
          console.log("old photo Deleted successfully:", result);
        } else {
          console.log("Error:", error);
        }
      }
    );
  }

  await product.deleteOne();

  await invalidateCache({ product: true, productId: String(product._id) });

  return res.status(200).json({
    success: true,
    message: "product deleted sucessfully",
  });
});

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const {
      search,
      sort,
      category,
      price,
      page: pageFromQuery,
      limit: limitFromQuery,
    } = req.query;
    const page = Number(pageFromQuery) || 1;
    const limit =
      Number(limitFromQuery) || Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = limit * (page - 1);

    // Build the query object
    const query: any = {};

    // Search with regex if the search term exists
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }
    // Filter by category if it exists
    if (category) {
      query.category = category;
    }
    // Filter by price if it exists (less than or equal to the provided price)
    if (price) {
      query.price = { $lte: Number(price) };
    }

    const [products, allProductsWithFilters] = await Promise.all([
      Product.find(query)
        .sort(sort && { price: sort == "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit),

      Product.find(query),
    ]);
    const totatPage = Math.ceil(allProductsWithFilters.length / limit);

    if (page > totatPage) {
      return next(
        new ErrorHandler(`No products found for the provided criteria`, 404)
      );
    }

    return res.status(200).json({
      success: true,
      isFirstPAge: page == 1,
      isLastPage: totatPage == page,
      products,
      message: "Products based on query fetched successfully",
    });
  }
);
