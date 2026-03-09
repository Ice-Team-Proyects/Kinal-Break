import { Schema, model } from "mongoose";

const PaymentSchema = new Schema({
    orderId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["Efectivo", "Transferencia"]
    },
    status: {
        type: String,
        enum: ["Pagado", "Pendiente", "No Pagado"]
    },
    confirmedUnpaid: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

export default model("Payment", PaymentSchema);