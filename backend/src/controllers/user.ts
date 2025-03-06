import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import mongoose from "mongoose";
import ErrorHandler from "../utils/utitlity-class.js";
import { TryCatch } from "../middleware/error.js";
import { redis } from "../app.js"; // Import Redis instance
import { invalidateCache } from "../utils/features.js";

// =========================== GET ALL USERS ===========================
export const getAllUsers = TryCatch(async (req, res, next) => {
  let users;
  const cacheKey = "all-users";

  // Check Redis Cache
  const cachedUsers = await redis.get(cacheKey);
  if (cachedUsers) {
    users = JSON.parse(cachedUsers);
  } else {
    users = await User.find({});
    await redis.set(cacheKey, JSON.stringify(users), "EX", 3600); // Cache for 1 hour
  }

  return res.status(200).json({
    success: true,
    users,
    message: "All users list sent successfully",
  });
});

// =========================== GET SINGLE USER ===========================
export const getUser = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const cacheKey = `user-${id}`;
  let user;

  // Check Redis Cache
  const cachedUser = await redis.get(cacheKey);
  if (cachedUser) {
    user = JSON.parse(cachedUser);
  } else {
    user = await User.findById(id);
    if (!user) {
      return next(new ErrorHandler(`No user found with id: ${id}`, 404));
    }
    await redis.set(cacheKey, JSON.stringify(user)); // Cache for 1 hour
  }

  return res.status(200).json({
    success: true,
    user,
    message: "User details sent successfully",
  });
});

// =========================== CREATE NEW USER ===========================
export const newUser = TryCatch(async (
  req: Request<{}, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name, email, photo, gender, _id, dob } = req.body;

    console.log("👋", _id);
    
    let user = await User.findById(_id);
    if (user) {
      return res.status(200).json({
        success: true,
        message: `Welcome, ${user.name}`,
      });
    }

    // Check for missing fields
    const missingFields: string[] = [];
    if (!name) missingFields.push("name");
    if (!email) missingFields.push("email");
    if (!gender) missingFields.push("gender");
    if (!_id) missingFields.push("ID (_id)");
    if (!dob) missingFields.push("date of birth (dob)");

    if (missingFields.length > 0) {
      return next(new ErrorHandler(`Missing fields: ${missingFields.join(", ")}`, 405));
    }

    user = await User.create({
      name,
      email,
      photo,
      gender,
      _id,
      dob: new Date(dob),
    });

    await invalidateCache({ user: true });

    return res.status(200).json({
      success: true,
      message: `User created successfully: Welcome, ${user.name}`,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return next(new ErrorHandler("Duplicate entry: A user with this email or ID already exists.", 409));
    }
    if (error instanceof mongoose.Error.CastError) {
      return next(new ErrorHandler("Invalid ID format", 400));
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new ErrorHandler("Validation error: Input all fields properly", 400));
    }
    return next(error);
  }
});

// =========================== DELETE USER ===========================
export const deleteUser = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler(`No user found with id: ${id}`, 404));
  }

  await User.deleteOne({ _id: id });

  await invalidateCache({ user: true, userId: id });


  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
