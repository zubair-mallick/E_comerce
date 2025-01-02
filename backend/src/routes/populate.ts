import mongoose, { Document } from "mongoose";
import { Product } from "../models/products.js";
import { User } from "../models/user.js";
import { Order } from "../models/order.js";
// Assuming the path to your Order model

// Define interfaces for the data models
interface IOrderItem {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: mongoose.Types.ObjectId;
}

interface IOrder extends Document {
  shippingInfo: {
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  user: mongoose.Types.ObjectId;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderItems: IOrderItem[];
}

interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  photo: string;
  role: "admin" | "user";
  gender: "male" | "female" | "other";
  dob: Date;
}

interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  photo: string;
  price: number;
  stock: number;
  category: string;
}

// Function to generate random numbers within a range
const getRandomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Function to generate random shipping info
const generateShippingInfo = (): IOrder["shippingInfo"] => {
  const cities = ["San Francisco", "New York", "Los Angeles", "Chicago", "Miami"];
  const states = ["California", "New York", "Illinois", "Florida", "Texas"];
  const countries = ["USA", "Canada", "UK"];
  return {
    address: `${getRandomNumber(100, 999)} Main Street`,
    city: cities[getRandomNumber(0, cities.length - 1)],
    state: states[getRandomNumber(0, states.length - 1)],
    country: countries[getRandomNumber(0, countries.length - 1)],
    pincode: `${getRandomNumber(10000, 99999)}`
  };
};

// Function to calculate totals
const calculateTotals = (orderItems: IOrderItem[]): { subtotal: number; discount: number; tax: number; shippingCharges: number; total: number } => {
  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = getRandomNumber(0, 150); // Random discount
  const tax = parseFloat((subtotal * 0.1).toFixed(2)); // 10% tax
  const shippingCharges = getRandomNumber(30, 80); // Random shipping charges
  const total = subtotal + tax + shippingCharges - discount;
  return { subtotal, discount, tax, shippingCharges, total };
};

// Function to generate random order items and adjust stock
const generateOrderItems = async (products: IProduct[]): Promise<IOrderItem[]> => {
  const orderItems: IOrderItem[] = [];
  const itemCount = getRandomNumber(1, 4); // Randomly choose 1 to 4 items per order
  for (let i = 0; i < itemCount; i++) {
    const product = products[getRandomNumber(0, products.length - 1)];

    // Ensure there is enough stock for the order
    if (product.stock === 0) continue; // Skip product if out of stock

    const quantity = getRandomNumber(1, Math.min(product.stock, 3)); // Random quantity, but not exceeding stock
    orderItems.push({
      name: product.name,
      photo: product.photo,
      price: product.price,
      quantity: quantity,
      productId: product._id
    });

    // Reduce stock accordingly
    product.stock -= quantity;

    // Update the product's stock in the database
    await Product.updateOne({ _id: product._id }, { $set: { stock: product.stock } });
  }
  return orderItems;
};

// Main function to generate orders
export const generateOrders = async (): Promise<void> => {
  try {
    // Fetch all users and products from the database
    const users: IUser[] = await User.find();
    const products: IProduct[] = await Product.find();

    if (users.length === 0 || products.length === 0) {
      console.log("No users or products found in the database.");
      return;
    }

    const orders: IOrder[] = [];

    // Generate 20 random orders
    for (let i = 0; i < 20; i++) {
      const user = users[getRandomNumber(0, users.length - 1)]._id; // Random user
      const orderItems = await generateOrderItems(products); // Generate random order items
      const totals = calculateTotals(orderItems); // Calculate totals

      const order:any = new Order({
        shippingInfo: generateShippingInfo(),
        user: user,
        subtotal: totals.subtotal,
        tax: totals.tax,
        shippingCharges: totals.shippingCharges,
        discount: totals.discount,
        total: totals.total,
        orderItems
      });

      orders.push(order);
    }

    // Insert all generated orders into the database
    await Order.insertMany(orders);
    
    return ;
  } catch (error) {
    console.error("Error generating orders:", error);
  }
};