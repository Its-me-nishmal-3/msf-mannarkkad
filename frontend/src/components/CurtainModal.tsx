import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CurtainModalProps {
    onLaunch: () => void;
}

const CurtainModal: React.FC<CurtainModalProps> = ({ onLaunch }) => {
    const [isLaunched, setIsLaunched] = useState(false);

    const handleLaunch = () => {
        setIsLaunched(true);
        // Trigger parent callback after animation starts or completes if needed
        // For now, we just let the component handle its own animation state
        onLaunch();
    };

    return (
        <AnimatePresence>
            {!isLaunched ? (
                <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
                    {/* Intro Content - Visible Initially */}
                    <motion.div
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className="absolute z-50 flex flex-col items-center justify-center text-center p-4"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-wider drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                            MSF KARIMPUZHA,<p>EETHAPPAZHA CHALLENGE</p>
                        </h1>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLaunch}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xl md:text-2xl px-12 py-4 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] border border-white/20 transition-all"
                        >
                            LAUNCH NOW 🚀
                        </motion.button>
                    </motion.div>

                    {/* Left Curtain */}
                    <motion.div
                        initial={{ x: '0%' }}
                        exit={{ x: '-100%' }}
                        transition={{
                            duration: 1.5,
                            ease: [0.22, 1, 0.36, 1],
                            delay: 0.2
                        }}
                        className="absolute top-0 left-0 w-[50vw] h-full bg-gradient-to-r from-slate-900 to-slate-800 z-40 border-r border-white/10"
                    >
                        {/* Texture */}
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)]" />
                    </motion.div>

                    {/* Right Curtain */}
                    <motion.div
                        initial={{ x: '0%' }}
                        exit={{ x: '100%' }}
                        transition={{
                            duration: 1.5,
                            ease: [0.22, 1, 0.36, 1],
                            delay: 0.2
                        }}
                        className="absolute top-0 right-0 w-[50vw] h-full bg-gradient-to-l from-slate-900 to-slate-800 z-40 border-l border-white/10"
                    >
                        {/* Texture */}
                        <div className="absolute inset-0 bg-[linear-gradient(-90deg,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)]" />
                    </motion.div>
                </div>
            ) : null}
        </AnimatePresence>
    );
};

export default CurtainModal;
