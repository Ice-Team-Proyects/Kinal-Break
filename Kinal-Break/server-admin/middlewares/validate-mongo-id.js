import mongoose from 'mongoose';

export const validateMongoId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ 
            success: false, 
            msg: 'Invalid MongoDB ID format' 
        });
    }
    next();
};