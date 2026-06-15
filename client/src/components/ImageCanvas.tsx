import React, { useRef, useEffect } from 'react';

interface BoundingBox {
  label: string;
  confidence: number;
  bbox: [number, number, number, number];
}

interface ImageCanvasProps {
  imageUrl: string;
  detections: BoundingBox[];
}

const ImageCanvas: React.FC<ImageCanvasProps> = ({ imageUrl, detections }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const containerWidth = canvas.parentElement?.clientWidth || 800;
      // Make it slightly smaller if it's too big, just like the mockup where it's a nice centered block
      const scale = Math.min(1, containerWidth / img.width);
      
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;
      
      canvas.width = drawWidth;
      canvas.height = drawHeight;

      // Make image rounded corners in the mockup? Actually the mockup has a rounded canvas
      ctx.drawImage(img, 0, 0, drawWidth, drawHeight);

      detections.forEach((det) => {
        const [x, y, w, h] = det.bbox;
        const sx = x * scale;
        const sy = y * scale;
        const sw = w * scale;
        const sh = h * scale;

        // Thin glowing purple bounding box like mockup
        ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(sx, sy, sw, sh);
        ctx.shadowBlur = 0;

        // Label background block inside top-left of bounding box
        const labelText = `${det.label} ${Math.round(det.confidence * 100)}%`;
        ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
        const textMetrics = ctx.measureText(labelText);
        
        ctx.fillStyle = '#a855f7'; // Solid purple block
        
        const lw = textMetrics.width + 12;
        const lh = 20;
        // Draw inside the box starting at top left
        ctx.fillRect(sx - 1.25, sy - 1.25, lw, lh);

        ctx.fillStyle = '#ffffff';
        ctx.fillText(labelText, sx + 6, sy + 13);
      });
    };
  }, [imageUrl, detections]);

  return (
    <div className="w-full flex justify-center overflow-hidden rounded-2xl shadow-2xl">
      <canvas ref={canvasRef} className="max-w-full h-auto rounded-xl" />
    </div>
  );
};

export default ImageCanvas;
