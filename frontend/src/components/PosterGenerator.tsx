
import React, { useRef, useState, useEffect } from 'react';
import { Download, Upload, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PosterGenerator: React.FC = () => {
    const navigate = useNavigate();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [name, setName] = useState('');
    const [userImage, setUserImage] = useState<string | null>(null);
    const [templateLoaded, setTemplateLoaded] = useState(false);

    // Template Coordinates
    const COORDS = {
        PHOTO: { x: 345, y: 1132, w: 793, h: 953 },
        NAME: { x: 476, y: 2173, w: 846, h: 74 }
    };

    useEffect(() => {
        const loadTemplate = async () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const img = new Image();
            img.src = '/challange-frame.png';
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                setTemplateLoaded(true);
                drawComposition();
            };
        };
        loadTemplate();
    }, []);

    useEffect(() => {
        if (templateLoaded) {
            drawComposition();
        }
    }, [name, userImage, templateLoaded]);

    const drawComposition = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. Redraw Template
        const img = new Image();
        img.src = '/challange-frame.png';
        // We assume it's cached/loaded fast enough, or complex logic needed. 
        // Better implementation: keep template image object in state.
        // For simplicity now, let's just re-draw everything.

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // 2. Draw User Photo
        if (userImage) {
            const uImg = new Image();
            uImg.src = userImage;
            uImg.onload = () => {
                // Crop/Fit logic
                // Draw into COORDS.PHOTO
                // Simple stretch for now, or proper aspect ratio fit?
                // Let's do 'cover' style fit
                const { x, y, w, h } = COORDS.PHOTO;

                // Aspect Ratio Calculation
                const imgRatio = uImg.width / uImg.height;
                const targetRatio = w / h;

                let drawW, drawH, offsetX, offsetY;

                if (imgRatio > targetRatio) {
                    // Image is wider than target
                    drawH = h;
                    drawW = h * imgRatio;
                    offsetX = x - (drawW - w) / 2; // Center horizontally
                    offsetY = y;
                } else {
                    // Image is taller than target
                    drawW = w;
                    drawH = w / imgRatio;
                    offsetX = x;
                    offsetY = y - (drawH - h) / 2; // Center vertically
                }

                // Clip region
                ctx.save();
                ctx.beginPath();
                ctx.rect(x, y, w, h);
                ctx.clip();
                ctx.drawImage(uImg, offsetX, offsetY, drawW, drawH);
                ctx.restore();

                // 3. Draw Name (needs to be inside onload to layer correctly if async)
                drawName(ctx);
            };
            // If manual image object creation latency is issue, keep it in state too.
            // But for this flow, onload inside draw is risky if recursive. 
            // Ideally: Load user image once when uploaded.
        } else {
            drawName(ctx);
        }
    };

    // Optimized loading:
    // We should load user image into a state Object when uploaded, not new Image() every render.
    // However, for this turn, let's correct the draw logic to be robust.

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

    // Helper just for name since it doesn't need async load
    const drawName = (ctx: CanvasRenderingContext2D) => {
        if (!name) return;

        const { x, y, w, h } = COORDS.NAME;

        ctx.save();
        ctx.font = 'bold 50px Arial'; // Adjust font size/family as needed to match poster style
        ctx.fillStyle = '#000000'; // Black text? Or checks image.
        // Based on "NAME ;- " label in provided image, likely black or dark text.
        // Let's assume dark text.
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Center of the box
        const centerX = x + w / 2;
        const centerY = y + h / 2;

        ctx.fillText(name.toUpperCase(), centerX, centerY);
        ctx.restore();
    };


    // Correct Draw Logic with State Images would be better, but let's try a simpler reliable approach:
    // Whenever [name, userImage] changes, we trigger a draw.
    // Inside draw, we create new Images. If they load instantly (cached), great.

    // Revamped Draw Effect
    useEffect(() => {
        if (!templateLoaded) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const templateImg = new Image();
        templateImg.src = '/challange-frame.png';

        templateImg.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(templateImg, 0, 0);

            if (userImage) {
                const uImg = new Image();
                uImg.src = userImage;
                uImg.onload = () => {
                    const { x, y, w, h } = COORDS.PHOTO;
                    // Cover fit logic
                    const imgRatio = uImg.width / uImg.height;
                    const targetRatio = w / h;
                    let sx, sy, sw, sh;

                    if (imgRatio > targetRatio) {
                        // Source is wider, crop widths
                        sh = uImg.height;
                        sw = sh * targetRatio;
                        sy = 0;
                        sx = (uImg.width - sw) / 2;
                    } else {
                        // Source is taller, crop height
                        sw = uImg.width;
                        sh = sw / targetRatio;
                        sx = 0;
                        sy = (uImg.height - sh) / 2;
                    }

                    ctx.drawImage(uImg, sx, sy, sw, sh, x, y, w, h);
                    drawNameText(ctx);
                };
            } else {
                drawNameText(ctx);
            }
        };

        const drawNameText = (context: CanvasRenderingContext2D) => {
            if (!name) return;
            const { x, y, h } = COORDS.NAME;
            context.save();
            context.font = 'bold 60px "Malgun Gothic", sans-serif';
            context.fillStyle = '#000000';
            context.textAlign = 'left'; // Align left usually better for names? Or Center? 
            // Request says: "NAME ;-" label exists. 
            // Let's center it in the provided box which seems to be the input area.
            context.textBaseline = 'middle';
            context.fillText(name, x + 20, y + h / 2 + 5); // Slight padding
            context.restore();
        }

    }, [name, userImage, templateLoaded]);


    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `karimpuzha-poster-${name || 'msf'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6 relative flex flex-col items-center">

            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-2 transition-colors z-10"
            >
                <ArrowLeft className="w-5 h-5" /> Back
            </button>

            <div className="w-full max-w-lg space-y-8 mt-12 z-10">
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
                        Poster Generator
                    </h1>
                    <p className="text-gray-400">Create your participation poster!</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl space-y-6">

                    {/* Inputs */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Your Photo</label>
                            <div className="relative border-2 border-dashed border-gray-700 rounded-xl p-4 hover:border-emerald-500 transition-colors bg-gray-800/50 text-center cursor-pointer">
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                />
                                <Upload className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                                <p className="text-sm text-gray-300">Click to upload photo</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Your Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Enter your name"
                            />
                        </div>
                    </div>

                    {/* Canvas Preview */}
                    <div className="relative rounded-xl overflow-hidden border border-gray-700 aspect-[9/16] bg-black">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <button
                        onClick={handleDownload}
                        disabled={!userImage}
                        className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all shadow-lg ${userImage
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-500/20'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <Download className="w-6 h-6" />
                        Download Poster
                    </button>

                </div>
            </div>
        </div>
    );
};

export default PosterGenerator;
