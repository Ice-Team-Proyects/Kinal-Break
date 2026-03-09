import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    price: Number,
    isActive: Boolean,
    isDeleted: Boolean
});

export default mongoose.model("Product", productSchema, "products");