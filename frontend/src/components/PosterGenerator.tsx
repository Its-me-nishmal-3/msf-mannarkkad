import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Upload, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PosterGenerator: React.FC = () => {
    const navigate = useNavigate();
    const exportRef = useRef<HTMLDivElement>(null); // High-res hidden element
    const [name, setName] = useState('');
    const [userImage, setUserImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Coordinate config (adjust these if template changes)
    // Based on original: 
    // Width: ~1600 (Assumed from X max 1322 + padding)
    // Actually we will auto-detect dimension from the image itself.

    // For the PREVIEW (Responsive), we use percentages relative to the image size.
    // We need to KNOW the image size to calculate percentages accurately if we want identical match.
    // Or we can just use the pixel values if we create a "scaled" container.

    // Let's use the Pixel-based Scaled Container approach. 
    // It's WYSIWYG and simplest to maintain coords.
    // We render ONE container.
    // We scale it using CSS `transform` to fit the screen.
    // On download, we remove the transform (or clone it), render, then restore? 
    // Or just html2canvas(element, { scale: ... })?

    // Better: Render transparent/hidden High Res version for export.
    // Render responsive version for user.

    // Let's use PERCENTAGES for the Preview.
    // Photo: 345 / 1792 (approx width) ?
    // Let's just use the loaded dimensions to compute styles dynamically.

    const [imgDim, setImgDim] = useState<{ w: number, h: number } | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setUserImage(event.target.result as string);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleDownload = async () => {
        if (!exportRef.current) return;
        setIsGenerating(true);

        try {
            // Force the export ref to be visible for capture if needed, or just capture it.
            // Since it is 'absolute' and 'z-index: -10', it is in DOM but hidden.
            const canvas = await html2canvas(exportRef.current, {
                useCORS: true,
                scale: 1, // Capture at native resolution
                backgroundColor: null,
            });

            const link = document.createElement('a');
            link.download = `karimpuzha - poster - ${name || 'msf'}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        } catch (err) {
            console.error(err);
            alert('Failed to generate poster');
        } finally {
            setIsGenerating(false);
        }
    };

    const getStyle = (isExport: boolean) => {
        if (!imgDim) return {};

        // Coords
        const PHOTO = { x: 345, y: 1132, w: 793, h: 953 };
        const NAME = { x: 476, y: 2173, w: 846, h: 74 };

        // Convert to Percentages
        const photoStyle: React.CSSProperties = {
            position: 'absolute',
            left: `${(PHOTO.x / imgDim.w) * 100}% `,
            top: `${(PHOTO.y / imgDim.h) * 100}% `,
            width: `${(PHOTO.w / imgDim.w) * 100}% `,
            height: `${(PHOTO.h / imgDim.h) * 100}% `,
        };

        const nameStyle: React.CSSProperties = {
            position: 'absolute',
            left: `${(NAME.x / imgDim.w) * 100}% `,
            top: `${(NAME.y / imgDim.h) * 100}% `,
            width: `${(NAME.w / imgDim.w) * 100}% `,
            height: `${(NAME.h / imgDim.h) * 100}% `,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        };

        // Font scaling for responsive preview
        // For export, use fixed px. For preview, use vw or %? 
        // Simple: Font size is ~60px relative to ~2000px height. 
        // 60/2000 = 3%.
        const fontSize = isExport ? '60px' : '3cqi'; // container query units? or just 3%?

        return { photoStyle, nameStyle, fontSize };
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white p-4 flex flex-col items-center">
            <button
                onClick={() => navigate('/')}
                className="self-start text-gray-400 hover:text-white flex items-center gap-2 mb-6"
            >
                <ArrowLeft className="w-5 h-5" /> Back
            </button>

            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-6 text-center">
                Poster Generator
            </h1>

            {/* Inputs */}
            <div className="w-full max-w-md bg-gray-900 rounded-2xl p-4 space-y-4 mb-8 border border-gray-800">
                <div className="flex gap-3">
                    <div className="relative flex-1 bg-gray-800 rounded-xl overflow-hidden hover:ring-2 ring-emerald-500/50 transition-all cursor-pointer h-14 flex items-center justify-center border border-gray-700">
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            onChange={handleImageUpload}
                            accept="image/*"
                        />
                        {userImage ? (
                            <img src={userImage} className="w-full h-full object-cover opacity-50" alt="" />
                        ) : (
                            <Upload className="w-6 h-6 text-gray-400" />
                        )}
                        <span className="absolute text-xs font-bold text-white drop-shadow-md">
                            {userImage ? 'Change Photo' : 'Upload Photo'}
                        </span>
                    </div>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-[2] bg-gray-800 border border-gray-700 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 h-14"
                        placeholder="Enter your name"
                    />
                </div>
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="w-full max-w-sm relative rounded-xl overflow-hidden shadow-2xl border border-gray-800 bg-gray-900">
                {/* Loader until dimensions known */}
                {!imgDim && (
                    <div className="h-96 flex items-center justify-center text-gray-500 gap-2">
                        <Loader2 className="animate-spin" /> Loading Template...
                    </div>
                )}

                {/* 
                   Hidden "Source of Truth" Image to detect natural size 
                   Once loaded, we set dimensions and show the UI.
                */}
                <img
                    src="/challange-frame.png"
                    className="absolute opacity-0 pointer-events-none"
                    onLoad={(e) => setImgDim({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
                    alt=""
                />

                {/* Visible Preview */}
                {imgDim && (
                    <div className="relative w-full text-black" style={{ containerType: 'inline-size' }}>
                        <img src="/challange-frame.png" className="w-full h-auto block" alt="template" />

                        {/* User Photo */}
                        {userImage && (
                            <div style={getStyle(false).photoStyle} className="overflow-hidden">
                                <img src={userImage} className="w-full h-full object-cover" alt="user" />
                            </div>
                        )}

                        {/* Name */}
                        {name && (
                            <div style={getStyle(false).nameStyle}>
                                <span className="font-bold uppercase" style={{ fontSize: '3cqw' }}>{name}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <button
                onClick={handleDownload}
                disabled={!userImage || isGenerating || !imgDim}
                className="mt-8 w-full max-w-sm bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
                {isGenerating ? <Loader2 className="animate-spin" /> : <Download />}
                {isGenerating ? 'Generating...' : 'Download Poster'}
            </button>


            {/* 
                EXPORT CONTAINER (Hidden, High Res)
                This replicates the preview but at fixed 1:1 pixel resolution matching the source image.
                We position it absolutely off-screen.
            */}
            {imgDim && (
                <div
                    ref={exportRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: -9999,
                        width: imgDim.w,
                        height: imgDim.h,
                        backgroundColor: 'white',
                        zIndex: -50,
                    }}
                >
                    <img src="/challange-frame.png" style={{ width: '100%', height: '100%' }} alt="" />

                    {userImage && (
                        <div style={{
                            position: 'absolute',
                            left: 345,
                            top: 1132,
                            width: 793,
                            height: 953,
                            overflow: 'hidden'
                        }}>
                            <img src={userImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        </div>
                    )}

                    {name && (
                        <div style={{
                            position: 'absolute',
                            left: 476,
                            top: 2173,
                            width: 846,
                            height: 74, // Height seems small for a name box? 74px. 
                            // Check map coords: 2173 to 2247. Correct.
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <span style={{
                                fontFamily: 'Arial, sans-serif',
                                fontWeight: 'bold',
                                fontSize: '50px', // Fixed size for export
                                color: 'black',
                                textTransform: 'uppercase'
                            }}>
                                {name}
                            </span>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default PosterGenerator;
