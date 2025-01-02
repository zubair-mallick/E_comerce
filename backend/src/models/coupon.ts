import  mongoose  from "mongoose";
const schema= new  mongoose.Schema({
    code:{
        type: String,
        required: [true,"please Enter the Coupon Code"],
        trim: true,
        lowercase: true,
        unique: true
    },
    amount: {
        type: Number,
        required: [true,"Please enter Discount amount"],
    },
    isActive: {
        type: Boolean,
        default: true
    }
})
export const Coupon = mongoose.model('Coupon',schema)