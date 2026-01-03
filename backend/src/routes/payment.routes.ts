import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment';
import { io } from '../server';

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'test_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_key_secret'
});

// Create Order
router.post('/create-order', async (req, res) => {
    try {
        const { quantity = 1 } = req.body;
        const amount = 350 * quantity;

        const options = {
            amount: amount * 100, // amount in paisa
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.json({ ...order, quantity }); // Pass quantity back to frontend if needed
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send('Error creating order');
    }
});

// Verify Payment
router.post('/verify', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, name, ward } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_key_secret')
            .update(body.toString())
            .digest('hex');

        const isValid = expectedSignature === razorpay_signature;

        if (isValid) {
            // Save Payment
            const { quantity = 1, mobile } = req.body; // Expect quantity and mobile
            const payment = new Payment({
                name,
                ward,
                amount: 350 * quantity,
                quantity,
                mobile,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                status: 'success'
            });
            await payment.save();

            // Emit Socket Update
            io.emit('payment_success', {
                amount: payment.amount,
                ward: ward,
                quantity: payment.quantity,
                payment
            });

            res.json({ status: 'success', payment });
        } else {
            res.status(400).json({ status: 'failure', message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// Get Stats
router.get('/stats', async (req, res) => {
    try {
        const totalAmount = await Payment.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Sum quantity instead of countDocuments for total packs/participants
        const totalCount = await Payment.aggregate([
            { $group: { _id: null, total: { $sum: '$quantity' } } }
        ]);

        const wardStats = await Payment.aggregate([
            { $group: { _id: '$ward', total: { $sum: '$amount' } } }
        ]);

        const wardWise: Record<string, number> = {};
        wardStats.forEach(stat => {
            wardWise[stat._id] = stat.total;
        });

        res.json({
            totalAmount: totalAmount[0]?.total || 0,
            totalCount: totalCount[0]?.total || 0,
            wardWise
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

// Get History (Limit 50)
router.get('/history', async (req, res) => {
    try {
        const history = await Payment.find().sort({ createdAt: -1 }).limit(50);
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Error fetching history' });
    }
});

export default router;
