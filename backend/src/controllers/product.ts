import { extractPublicId } from "cloudinary-build-url";
import { Request } from "express";
import { redis } from "../app.js";
import { cloudinary } from "../config/cloudinary.js"; // Import Cloudinary
import { TryCatch } from "../middleware/error.js";
import { Product } from "../models/products.js";
import { Review } from "../models/review.js";
import { User } from "../models/user.js";
import { NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import {
  findAverageRatings,
  invalidateCache,
} from "../utils/features.js";
import ErrorHandler from "../utils/utitlity-class.js";


export const getlatestProducts = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    let products;

     products = await redis.get("latest-product")

    if (products)
      products = JSON.parse(products);
    else {
      products = await Product.find({ stock: { $gt: 0 } }).sort({ createdAt: -1 }).limit(6);
      await redis.set("latest-product", JSON.stringify(products));
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
    let categories

    categories = await redis.get("categories")
    if (categories)
      categories = JSON.parse(categories);
    else
    { categories = await Product.distinct("category");
     await  redis.set("categories", JSON.stringify(categories));
    }

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
    products = await redis.get("adminProducts")
    if (products)
      products = JSON.parse(products);
    else {
      products = await Product.find({});
      await redis.set("adminProducts", JSON.stringify(products));
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
  product = await redis.get(`singleProduct-${id}`)
  if (product)
    product = JSON.parse(product);
  else {
    product = await Product.findById(id);

    if (!product) {
      return next(new ErrorHandler(`No product found `, 404));
    }

    await  redis.set(`singleProduct-${id}`, JSON.stringify(product));
  }

  return res.status(200).json({
    success: true,
    product,
    message: "product fetched sucessfully",
  });
});

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, price, stock, category,description } = req.body;
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
    if (!description) missingFields.push("description");
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

    await invalidateCache({ product: true });


    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      description,
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
  const { name, price, stock, category,description } = req.body;
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
  if (description) product.description = description;

  const updatedProduct = await product.save();
  await invalidateCache({ product: true, productId: String(product._id) });

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
  await invalidateCache({ product: true, productId: String(product._id) });

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
      minPrice, 
      page: pageFromQuery,
      limit: limitFromQuery,
    } = req.query;

    const page = Number(pageFromQuery) || 1;
    const limit = Number(limitFromQuery) || Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = limit * (page - 1);

    let key = `products-${search}-${sort}-${category}-${price}-${minPrice}-${page}-${limit}`;

    try {
      // Check Redis cache
      let cachedata = await redis.get(key);
      if (cachedata) {
        const parsedData = JSON.parse(cachedata);
        return res.status(200).json({
          success: true,
          ...parsedData,
          message: "Products fetched from cache successfully",
        });
      }

      // Build the query object
      const query: any = {};

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }
      if (category) {
        query.category = category;
      }
      if (minPrice || price) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (price) query.price.$lte = Number(price);
      }

      // Fetch products and total count in parallel
      const [products, allProductsWithFilters] = await Promise.all([
        Product.find(query)
          .sort(sort && { price: sort === "asc" ? 1 : -1 })
          .skip(skip)
          .limit(limit),
        Product.find(query).countDocuments(),
      ]);

      const totalPage = Math.ceil(allProductsWithFilters / limit);
      if (products.length === 0) {
        return next(new ErrorHandler(`No products found for the provided criteria`, 404));
      }

      const responseData = {
        isFirstPage: page === 1,
        isLastPage: totalPage === page,
        totalPage,
        products,
      };

      // Store in Redis cache for future requests
      await redis.setex(key, 60,JSON.stringify(responseData) ); // Cache expires in 1 hour

      return res.status(200).json({
        success: true,
        ...responseData,
        message: "Products based on query fetched successfully",
      });

    } catch (error) {
      return next(error);
    }
  }
);


//review section is here
export const allReviewsOfProduct = TryCatch(async (req, res, next) => {
  let reviews;
  const key = `reviews-${req.params.id}`;

  reviews = await redis.get(key)
  if (reviews) {
    reviews = JSON.parse(reviews);
  }
  else{

    reviews = await Review.find({
      product: req.params.id,
    })
      .populate("user", "name photo")
      .sort({ updatedAt: -1 });

      await redis.setex(key, 60*10, JSON.stringify(reviews) ); // Cache expires in 1 hour
  }
  

  return res.status(200).json({
    success: true,
    reviews,
  });
});





export const newReview = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.query.id);

  if (!user) return next(new ErrorHandler("Not Logged In", 404));

  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  const { comment, rating } = req.body;

  const alreadyReviewed = await Review.findOne({
    user: user._id,
    product: product._id,
  });

  if (alreadyReviewed) {
    alreadyReviewed.comment = comment;
    alreadyReviewed.rating = rating;

    await alreadyReviewed.save();
  } else {
    await Review.create({
      comment,
      rating,
      user: user._id,
      product: product._id,
    });
  }

  const { ratings, numOfReviews } = await findAverageRatings(product._id);

  product.ratings = ratings;
  product.numOfReviews = numOfReviews;

  await product.save();

  await redis.del(`reviews-${req.params.id}`)

  await invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
    // review: true,
  });

  return res.status(alreadyReviewed ? 200 : 201).json({
    success: true,
    message: alreadyReviewed ? "Review Update" : "Review Added",
  });
});

export const deleteReview = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.query.id);

  if (!user) return next(new ErrorHandler("Not Logged In", 404));

  const review = await Review.findById(req.params.id);
  if (!review) return next(new ErrorHandler("Review Not Found", 404));

  const isAuthenticUser = review.user.toString() === user._id.toString();

  if (!isAuthenticUser) return next(new ErrorHandler("Not Authorized", 401));

  await review.deleteOne();

  const product = await Product.findById(review.product);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  const { ratings, numOfReviews } = await findAverageRatings(product._id);

  product.ratings = ratings;
  product.numOfReviews = numOfReviews;

  await product.save();

  await invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  await redis.del(`reviews-${req.params.id}`)


  return res.status(200).json({
    success: true,
    message: "Review Deleted",
  });
});



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





