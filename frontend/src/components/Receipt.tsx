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

    // Coordinates logic based on 2560x3200 image
    // Rect: 285, 861, 1444, 986
    // Top: 861 / 3200 = 26.90625%
    // Left: 285 / 2560 = 11.1328125%
    // Width: (1444 - 285) / 2560 = 1159 / 2560 = 45.2734375%
    // Height: (986 - 861) / 3200 = 125 / 3200 = 3.90625%

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            <div className="relative w-full max-w-lg shadow-2xl rounded-lg overflow-hidden">
                {/* Print container */}
                <div ref={receiptRef} className="relative w-full">
                    <img
                        src="/ricipt_thanks_with_name.jpg"
                        alt="Receipt"
                        className="w-full h-auto block"
                    />

                    <div
                        className="absolute flex items-center justify-center overflow-hidden"
                        style={{
                            top: '26.9%',
                            left: '11.1%',
                            width: '45.3%',
                            height: '3.9%',
                            color: '#751d08',
                        }}
                    >
                        {/* Using responsive font size relative to container width approx via clamp or just confident bold text */}
                        <span className="font-bold text-[1.5vw] sm:text-[2vw] md:text-lg lg:text-xl uppercase tracking-wide truncate px-2 w-full text-center">
                            {payment.name}
                        </span>
                    </div>

                    {/* Hidden fields if we want to add date/amount later in other blank spots, 
                        but requirement was just name. 
                    */}
                </div>
            </div>

            <div className="mt-6 flex gap-4 print:hidden">
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors shadow-lg font-medium"
                >
                    <Download size={18} /> Download
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors shadow-lg font-medium"
                >
                    <Home size={18} /> Home
                </button>
            </div>

            {/* Global print styles to ensure background image prints if user settings allow, 
                but standard img tag usually prints fine. 
                We might want to hide the buttons in print mode.
            */}
            <style>{`
                @media print {
                    @page { margin: 0; }
                    body { -webkit-print-color-adjust: exact; }
                    .print\\:hidden { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default Receipt;
