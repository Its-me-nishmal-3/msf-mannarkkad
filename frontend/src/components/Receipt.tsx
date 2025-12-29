import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Home } from 'lucide-react';

const Receipt: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const receiptRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!state?.payment) {
            navigate('/');
        }
    }, [state, navigate]);

    if (!state?.payment) return null;

    const { payment } = state;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div
                ref={receiptRef}
                className="bg-white text-gray-900 p-8 rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden"
            >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-emerald-500" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-50" />

                <div className="text-center mb-8 relative z-10">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 mb-2">
                        Fruit Challenge
                    </h1>
                    <p className="text-gray-500 text-sm">Thank you for your support! 🍎</p>
                </div>

                <div className="space-y-4 relative z-10">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500">Date</span>
                        <span className="font-semibold">{new Date(payment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500">Name</span>
                        <span className="font-semibold">{payment.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500">Ward</span>
                        <span className="font-semibold">{payment.ward}</span>
                    </div>
                    {payment.quantity > 1 && (
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500">Packs</span>
                            <span className="font-semibold">{payment.quantity}</span>
                        </div>
                    )}
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500">Payment ID</span>
                        <span className="font-mono text-xs">{payment.paymentId}</span>
                    </div>

                    <div className="mt-8 pt-4 border-t-2 border-dashed border-gray-200">
                        <div className="flex justify-between items-center text-xl font-bold">
                            <span>Total Paid</span>
                            <span className="text-emerald-600">₹{payment.amount}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-gray-400">
                    <p>This is a computer generated receipt.</p>
                </div>
            </div>

            <div className="mt-8 flex gap-4">
                <button
                    onClick={() => window.print()}
                    className="glass-button flex items-center gap-2"
                >
                    <Download size={18} /> Download
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="glass-button bg-gray-600 hover:bg-gray-500 flex items-center gap-2"
                >
                    <Home size={18} /> Home
                </button>
            </div>
        </div>
    );
};

export default Receipt;
