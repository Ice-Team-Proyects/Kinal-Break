import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
    {
        numeroPedido: {
            type: String,
            required: true,
            unique: true
        },
        usuarioId: {
            type: String, 
            required: true
        },
        productos: [
            {
                productoId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                cantidad: {
                    type: Number,
                    required: true
                },
                precioUnitario: {
                    type: Number,
                    required: true
                },
                acompanamientoId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    default: null
                },
                horaReserva: {
                    type: String,
                    default: null
                }
            }
        ],
        estado: {
            type: String,
            enum: ['Pendiente', 'Pagado', 'Entregado', 'No pagado', 'Cancelado'],
            default: 'Pendiente'
        },
        metodoPago: {
            type: String,
            enum: ['Efectivo', 'Transferencia'],
            default: 'Efectivo'
        },
        horaReserva: {
            type: String,
            default: null
        },
        comprobanteUrl: {
            type: String,
            default: null
        },
        totalCobrar: {
            type: Number,
            default: 0
        },
        totalFinal: {
            type: Number,
            default: 0
        },
        activo: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
        collection: 'pedidos'
    }
);

export default model('Order', orderSchema);
