import { Router } from 'express';
import { addOrder, listOrders, editOrder, removeOrder } from './order.controller.js';
import { validateMongoId } from '../../middlewares/validate-mongo-id.js';

const router = Router();

router.post('/', addOrder);
router.get('/', listOrders);
router.put('/:id', validateMongoId, editOrder);
router.delete('/:id', validateMongoId, removeOrder);

export default router;