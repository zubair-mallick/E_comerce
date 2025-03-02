import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Name"],
    },
    photos: [
      {
        type: String,
        required: [true, "Please enter Photo"],
      },
    ],
    price: {
      type: Number,
      required: [true, "Please enter Price"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter Stock"],
    },
    category: {
      type: String,
      required: [true, "Please enter Category"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter Description"],
      maxlength: [500, "Description should not exceed 500 characters"],
    
    }
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", schema);
