/**
 * @swagger
 * components:
 *   schemas:
 *     AddToCartRequest:
 *       type: object
 *       required:
 *         - productId
 *         - cantidad
 *       properties:
 *         productId:
 *           type: string
 *           description: ID del producto
 *           example: "665f1a2b3c4d5e6f7g8h9i0j"
 *         cantidad:
 *           type: integer
 *           description: Cantidad del producto
 *           example: 2
 *
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Operación realizada correctamente"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Ocurrió un error"
 */

/**
 * @swagger
 * /pedido/carrito:
 *   post:
 *     summary: Agregar producto al carrito
 *     description: Permite al usuario autenticado agregar productos a su carrito.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCartRequest'
 *     responses:
 *       200:
 *         description: Producto agregado al carrito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Error de validación o stock insuficiente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/carrito', [validateJWT], agregarAlCarrito);

/**
 * @swagger
 * /pedido/confirmar:
 *   post:
 *     summary: Confirmar pedido
 *     description: Convierte el carrito actual en un pedido formal.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pedido confirmado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Carrito vacío o error en el proceso
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/confirmar', [validateJWT], confirmarPedido);

/**
 * @swagger
 * /pedido/historial:
 *   get:
 *     summary: Obtener historial de pedidos
 *     description: Devuelve todos los pedidos del usuario autenticado.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 example:
 *                   id: "665f1a2b3c4d5e6f7g8h9i0j"
 *                   total: 150.75
 *                   estado: "CONFIRMADO"
 *                   fecha: "2026-05-01"
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/historial', [validateJWT], obtenerHistorial);

/**
 * @swagger
 * /pedido/{id}:
 *   delete:
 *     summary: Cancelar pedido
 *     description: Permite cancelar un pedido por su ID.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del pedido
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido cancelado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Pedido no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/cancelar/:id', [validateJWT], cancelarPedido);

/**
 * @swagger
 * /pedido/limpiar-expirados:
 *   post:
 *     summary: Limpiar pedidos expirados
 *     description: Elimina o cancela pedidos vencidos (uso administrativo o mantenimiento).
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Limpieza realizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Error interno del servidor
 */
router.post('/limpiar-expirados', limpiarPedidosExpirados);