import { Schema, model } from 'mongoose';

const cartItemSchema = new Schema({
    productoId: { 
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true 
    },
    cantidad: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    precioUnitario: { 
        type: Number, 
        required: true 
    },
    acompanamientoId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        default: null
    }
});

const cartSchema = new Schema({
    usuarioId: { 
        type: String,
        required: true,
        unique: true
    },
    productos: [cartItemSchema],
    totalTemporal: { 
        type: Number, 
        default: 0 
    }
}, { 
    timestamps: true,
    versionKey: false,
    collection: 'carritos'
});

export default model('Cart', cartSchema);
