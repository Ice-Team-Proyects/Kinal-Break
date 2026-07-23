import Order from '../src/Order/order.model.js';

export const checkPenalty = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return next();
        }

        // Buscar si el usuario tiene algún pedido activo marcado como "No pagado"
        const penalizedOrder = await Order.findOne({
            usuarioId: req.user.id,
            estado: 'No pagado',
            activo: { $ne: false }
        });

        if (penalizedOrder) {
            return res.status(403).json({
                success: false,
                msg: 'USUARIO_PENALIZADO: Tienes un pedido marcado como "No pagado". Por favor, acércate a la cafetería para saldar tu cuenta deudora.'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al comprobar penalización de usuario: ' + error.message
        });
    }
};
