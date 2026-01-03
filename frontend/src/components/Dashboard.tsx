import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import PaymentModal from './PaymentModal';

import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Assets
import mainImage from '../assets/main_program.jpg';
import banner1 from '../assets/banner_1.jpg';
import banner2 from '../assets/banner_2.jpg';
import banner3 from '../assets/banner_3.jpg';
import banner4 from '../assets/banner_4.jpg';
import banner5 from '../assets/banner_5.jpg';
import banner6 from '../assets/banner_6.jpg';
import banner7 from '../assets/banner_7.jpg';

const SOCKET_URL = 'https://frute.nichu.dev';

const UNIT_NAMES = [
    'ATTASSERY', 'AMBALAMPADAM', 'THOTTARA', 'KARIPAMANNA',
    'PEZHUMATTA', 'KULUKKILIYAD', 'KARIMPUZHA', 'POMBRA',
    'KOOTTILAKKADAV', 'KOLLAMKODE', 'VAKKADAPURAM', 'OTHERS'
];

const BANNERS = [banner1, banner2, banner3, banner4, banner5, banner6, banner7];

interface Stats {
    totalAmount: number;
    totalCount: number;
    wardWise: Record<string, number>;
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<Stats>({
        totalAmount: 0,
        totalCount: 0,
        wardWise: {}
    });
    const [showModal, setShowModal] = useState(false);


    const fetchStats = async () => {
        try {
            const res = await fetch(`${SOCKET_URL}/api/payment/stats`);
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    useEffect(() => {
        fetchStats();
        const newSocket = io(SOCKET_URL);
        newSocket.on('connect', () => console.log('Connected to socket'));
        newSocket.on('payment_success', (data: any) => {
            console.log('Payment success event:', data);
            fetchStats();
        });
        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-emerald-500/30 pb-24 relative overflow-hidden">



            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 space-y-12 pt-8">
                {/* Header */}
                <header className="flex justify-between items-center backdrop-blur-md bg-white/5 p-4 rounded-2xl border border-white/10 sticky top-4 z-50">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                            msf കരിമ്പുഴ
                        </h1>
                        <p className="text-gray-400 text-xs md:text-sm">ഈത്തപ്പഴ ചലഞ്ച് 2026</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/history')}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all border border-white/10"
                        >
                            History
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Image & Text */}
                    <div className="lg:col-span-12 xl:col-span-8 space-y-8">

                        {/* Welcome Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent blur-2xl" />

                            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-emerald-100 font-malayalam leading-tight">
                                പ്രിയമുള്ളവരെ…
                            </h2>
                            <div className="space-y-4 text-gray-300 leading-relaxed text-base md:text-lg font-malayalam">
                                <p>
                                    നമ്മുടെ നാട്ടിലെ സാമൂഹിക-വിദ്യാഭ്യാസ രംഗങ്ങളിൽ സജീവമായി പ്രവർത്തിക്കുന്ന വിദ്യാർത്ഥി സംഘടനയാണല്ലോ എം.എസ്.എഫ്.
                                </p>
                                <p>
                                    വിദ്യാർത്ഥികളുടെ അവകാശങ്ങൾ സംരക്ഷിക്കുകയും സമൂഹത്തിന്റെ പുരോഗതിക്കായി സേവനപരമായ ഇടപെടലുകളും നടത്തി കഴിഞ്ഞ കാലങ്ങളിൽ സാമൂഹിക, വിദ്യാഭ്യാസ, സാംസ്കാരിക മേഖലകളിൽ msf കരിമ്പുഴ പഞ്ചായത്ത് കമ്മിറ്റിക്ക് നമ്മുടെ നാടിനായി ഒരുപാട് പ്രവർത്തനങ്ങൾ കാഴ്ചവെക്കാൻ സാധിച്ചിട്ടുണ്ട്.
                                </p>
                                <p className="font-semibold text-emerald-300">
                                    തുടർന്നുള്ള നമ്മുടെ പ്രവർത്തനങ്ങൾക്കും പ്രയത്നങ്ങൾക്കും ശക്തിപകരാൻ വേണ്ടിയുള്ള ഒരു ഈത്തപ്പഴ ചലഞ്ചാണിത്.
                                </p>
                                <p>
                                    നിങ്ങളുടെ പൂർണ്ണ സഹകരണവും പങ്കാളിത്തവും പ്രതീക്ഷിക്കുന്നു.
                                </p>
                            </div>
                        </motion.div>

                        {/* Main Stats (Mobile/Desktop friendly) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-gradient-to-br from-emerald-900/40 to-emerald-900/10 border border-emerald-500/20 p-6 rounded-2xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm0-10a1 1 0 100 2 1 1 0 000-2z" /></svg>
                                </div>
                                <h3 className="text-emerald-400 text-sm uppercase tracking-wider font-semibold">Total Collected</h3>
                                <p className="text-4xl md:text-5xl font-bold mt-2 text-white">₹{stats.totalAmount.toLocaleString()}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-gradient-to-br from-blue-900/40 to-blue-900/10 border border-blue-500/20 p-6 rounded-2xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>
                                </div>
                                <h3 className="text-blue-400 text-sm uppercase tracking-wider font-semibold">Total Packs</h3>
                                <p className="text-4xl md:text-5xl font-bold mt-2 text-white">{stats.totalCount}</p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Column: Main Image */}
                    <div className="lg:col-span-12 xl:col-span-4 flex justify-center lg:justify-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10"
                            style={{ aspectRatio: '9/16' }}
                        >
                            <img
                                src={mainImage}
                                alt="Main Program"
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-full p-6 text-center pointer-events-none">

                            </div>
                        </motion.div>
                    </div>

                </div>

                {/* Banner Gallery */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-200 pl-2 border-l-4 border-emerald-500">Gallery</h3>
                    <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
                        {BANNERS.map((banner, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="min-w-[280px] md:min-w-[350px] h-48 md:h-64 rounded-2xl overflow-hidden snap-center shadow-lg border border-white/10 relative group"
                            >
                                <img
                                    src={banner}
                                    alt={`Banner ${idx + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Live Unit Stats */}
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 bg-emerald-500 rounded-full" />
                        Live Unit Details
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {UNIT_NAMES.map((unitName, i) => {
                            const amount = stats.wardWise[unitName] || 0;
                            const isActive = amount > 0;
                            return (
                                <motion.div
                                    key={unitName}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`relative p-4 rounded-xl border transition-all duration-300 group ${isActive
                                        ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 truncate" title={unitName}>{unitName}</p>
                                    <p className={`text-xl font-bold ${isActive ? 'text-emerald-400' : 'text-gray-500'}`}>
                                        ₹{amount.toLocaleString()}
                                    </p>
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500/50 rounded-b-xl overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: '100%' }}
                                                className="h-full bg-emerald-400"
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Floating Pay Button */}
                <div className="fixed bottom-8 left-0 w-full flex justify-center px-4 z-40 pointer-events-none">
                    <motion.button
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowModal(true)}
                        className="pointer-events-auto bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg md:text-xl py-4 px-12 rounded-full shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 border border-emerald-400/20 backdrop-blur-sm flex items-center gap-2"
                    >
                        Pay Now ₹350
                    </motion.button>
                </div>

                {/* Footer Spacer */}
                <div className="h-24" />
            </div>

            <AnimatePresence>
                {showModal && <PaymentModal onClose={() => setShowModal(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
