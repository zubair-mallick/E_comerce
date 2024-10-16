import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import mongoose from "mongoose";
import ErrorHandler from "../utils/utitlity-class.js";
import { TryCatch } from "../middleware/error.js";

export const newUser = TryCatch(async (
  req: Request<{}, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name, email, photo, gender, _id, dob } = req.body;
    
    // Check for missing fields
    const missingFields: string[] = [];
    if (!name) missingFields.push("name");
    if (!email) missingFields.push("email");
    if (!gender) missingFields.push("gender");
    if (!_id) missingFields.push("ID (_id)");
    if (!dob) missingFields.push("date of birth (dob)");

    // If there are missing fields, respond with a 405 error
    if (missingFields.length > 0) {
      return next(new ErrorHandler(`Missing fields: ${missingFields.join(", ")}`, 405));
    }

    // Create the user
    const user = await User.create({
      name,
      email,
      photo,
      gender,
      _id,
      dob: new Date(dob),
    });

    // Send success response
    return res.status(200).json({
      success: true,
      message: `User created successfully: Welcome, ${user.name}`,
    });
  } catch (error: any) {
    // Handle specific error cases using ErrorHandler

    // Handle duplicate key error (e.g., email or _id already exists)
    if (error.code === 11000) {
      return next(new ErrorHandler("Duplicate entry: A user with this email or ID already exists.", 409));
    }

    // Handle invalid object ID errors (MongoDB)
    if (error instanceof mongoose.Error.CastError) {
      return next(new ErrorHandler(`Invalid ID format: ${error.message}`, 400));
    }

    // Handle validation errors (schema validation)
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new ErrorHandler(`${error.message}`, 400));
    }

    // Handle any other unexpected errors
    return next(error);
  }
})
