import { extractPublicId } from "cloudinary-build-url";
import { Request } from "express";
import { myCache } from "../app.js";
import { cloudinary } from "../config/cloudinary.js"; // Import Cloudinary
import { TryCatch } from "../middleware/error.js";
import { Product } from "../models/products.js";
import { NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import { invalidateCache } from "../utils/features.js";
import ErrorHandler from "../utils/utitlity-class.js";

import { faker } from "@faker-js/faker";

export const getlatestProducts = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    let products = [];

    if (myCache.has("latest-product"))
      products = JSON.parse(myCache.get("latest-product") as string);
    else {
      products = await Product.find({ stock: { $gt: 0 } }).sort({ createdAt: -1 }).limit(6);
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
    const photos = req.files as Express.Multer.File[]; // Cast files array

    if (!photos || photos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one photo is required",
      });
    }

    const missingFields: string[] = [];
    if (!name) missingFields.push("product name");
    if (!price) missingFields.push("price");
    if (!stock) missingFields.push("stock");
    if (!category) missingFields.push("category");

    if (missingFields.length > 0) {
      // Delete uploaded images from Cloudinary if fields are missing
      for (const photo of photos) {
        const publicId = photo.filename;
        await cloudinary.uploader.destroy(publicId, (error) => {
          if (error) console.error("Error deleting image from Cloudinary:", error);
        });
      }

      return next(
        new ErrorHandler(`Missing fields: ${missingFields.join(", ")}`, 405)
      );
    }

    // Collect photo URLs from Cloudinary
    const photoUrls = photos.map((photo) => photo.path);

    invalidateCache({ product: true });


    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photos: photoUrls, // Store all photo URLs as an array
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  }
);

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;
  const photos = req.files as Express.Multer.File[]; // Cast files array

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler(`No product found`, 404));
  }

  // Delete old photos if new ones are uploaded
  if (photos && photos.length > 0) {
    for (const imageUrl of product.photos) {
      const publicId = extractPublicId(imageUrl);
      await cloudinary.uploader.destroy(publicId, (error) => {
        if (error) console.error("Error deleting image from Cloudinary:", error);
      });
    }

    // Update photos with new ones
    product.photos = photos.map((photo) => photo.path);
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  const updatedProduct = await product.save();
  invalidateCache({ product: true, productId: String(product._id) });

  return res.status(200).json({
    success: true,
    updatedProduct,
    message: "Product updated successfully",
  });
});


export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler(`No product found`, 404));
  }

  console.log(product);

  // Iterate over all photos and delete them from Cloudinary
  const photoUrls = product.photos; // Assuming `photos` is an array of URLs
  if (photoUrls && photoUrls.length > 0) {
    for (const imageUrl of photoUrls) {
      const publicId = extractPublicId(imageUrl); // Extract the public_id from the URL
      if (publicId) {
        await cloudinary.uploader.destroy(
          publicId,
          { invalidate: true, resource_type: "image" },
          function (error, result) {
            if (result) {
              console.log(`Deleted photo (${publicId}) successfully:`, result);
            } else {
              console.error(`Error deleting photo (${publicId}):`, error);
            }
          }
        );
      }
    }
  }

  // Delete the product from the database
  await product.deleteOne();

  // Invalidate cache
  invalidateCache({ product: true, productId: String(product._id) });

  return res.status(200).json({
    success: true,
    message: "Product and all associated photos deleted successfully",
  });
});


export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const {
      search,
      sort,
      category,
      price,
      minPrice, // Added minPrice to the destructured query
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
    // Filter by price range if minPrice and/or maxPrice (price) are provided
    if (minPrice || price) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice); // Greater than or equal to minPrice
      }
      if (price) {
        query.price.$lte = Number(price); // Less than or equal to price (maxPrice)
      }
    }

    const [products, allProductsWithFilters] = await Promise.all([
      Product.find(query)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit),

      Product.find(query),
    ]);
    const totalPage = Math.ceil(allProductsWithFilters.length / limit);

    if (page > totalPage) {
      return next(
        new ErrorHandler(`No products found for the provided criteria`, 404)
      );
    }

    return res.status(200).json({
      success: true,
      isFirstPage: page === 1,
      isLastPage: totalPage === page,
      products,
      message: "Products based on query fetched successfully",
    });
  }
);


// export async function modifyData() {
//   try {
//       // Fetch all products data from the EscuelaJS API
//       const response = await fetch('https://api.escuelajs.co/api/v1/products');
        
//       // Check if the response is OK (status code 200)
//       if (!response.ok) {
//           throw new Error(`Failed to fetch products. Status: ${response.status}`);
//       }

//       const apiProducts = await response.json(); // Parse the JSON response

//       // Fetch all existing products from the MongoDB database
//       const existingProducts = await Product.find();

//       // Check if the number of API products matches the number of MongoDB products
//       // if (apiProducts.length !== existingProducts.length) {
//       //     throw new Error('Number of products from API and MongoDB do not match.');
//       // }

//       // Loop through both API products and existing MongoDB products
//       for (let i = 0; i < apiProducts.length; i++) {
//           const apiProduct = apiProducts[i];
//           const existingProduct = existingProducts[i];

//           // Map API data to your Product model fields
//           const updatedProductData = {
//               name: apiProduct.title,
//               price: (apiProduct.price*100),
//               stock: 100,  // Default value, adjust based on your stock management
//               category: apiProduct.category.name,  // Using category name
//               photos: apiProduct.images, // Replace existing images with new ones from API
//               description: apiProduct.description,
//               createdAt: apiProduct.creationAt,
//               updatedAt: apiProduct.updatedAt,
//           };

//           // Update the existing product in the MongoDB database
//           await Product.findByIdAndUpdate(existingProduct._id, updatedProductData, {
//               new: true,  // Return the updated document
//           });

//           console.log(`Product with ID ${existingProduct._id} updated successfully.`);
//       }

//       console.log('All products updated successfully.');
//   } catch (err) {
//       console.error('Error updating products with EscuelaJS data:', err);
//   }
// }





