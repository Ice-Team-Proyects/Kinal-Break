import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    pedidoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pedido",
        required: [true, "El ID del pedido es obligatorio"]
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Cambia "User" si tu modelo de usuarios se llama distinto
        required: [true, "El ID del usuario es obligatorio"]
    },
    montoFinal: {
        type: Number,
        required: [true, "El monto es obligatorio"],
        min: [0, "El monto no puede ser negativo"]
    },
    metodoPago: {
        type: String,
        enum: ["Efectivo", "Tarjeta"],
        default: "Efectivo"
    },
    estado: {
        type: String,
        enum: ["Pendiente", "Completado", "Cancelado"],
        default: "Completado"
    },
    referencia: {
        type: String,
        default: "PAGO-CAJA"
    }
}, {
    timestamps: true,
    versionKey: false // Quita el __v de mongo que no nos sirve aquí
});

export default mongoose.model("Transaction", transactionSchema);