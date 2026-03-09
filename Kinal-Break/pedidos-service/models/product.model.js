import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    price: { type: Number },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
});

export default mongoose.model('Product', productSchema, 'products');