import Payment from "./payment.model.js";

export const createPaymentRecord = async (data) => {
    const payment = new Payment(data);
    await payment.save();
    return payment;
};

export const fetchPayments = async () => {
    return await Payment.find({ isDeleted: false })
};

export const fetchPaymentByOrder = async (orderId) => {
    return await Payment.findOne({ orderId });
};

export const getFinancialReport = async () => {
    const total = await Payment.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: "$amount" },
                totalTransactions: { $sum: 1 }
            }
        }
    ]);
    return total;
};

export const deletePayment = async (id) => {
    return await Payment.findByIdAndUpdate(
        id,
        {
            isDeleted: true,
            deletedAt: new Date()
        },
        { new: true }
    );
};
export const restorePayment = async (id) => {
    return await Payment.findByIdAndUpdate(
        id,
        {
            isDeleted: false,
            deletedAt: null
        },
        { new: true }
    );
};

export const markAsUnpaid = async (id, confirmation) => {
    if (!confirmation) {
        throw new Error("Debe Confirmar El Pago");
    }

    const payment = await Payment.findByIdAndUpdate(
        id,
        {
            status: "No Pagado",
            confirmedUnpaid: true
        },
        { new: true }
    );

    return payment;
};