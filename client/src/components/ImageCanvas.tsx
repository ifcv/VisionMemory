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
      const scale = Math.min(1, containerWidth / img.width);
      
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;
      
      canvas.width = drawWidth;
      canvas.height = drawHeight;

      ctx.drawImage(img, 0, 0, drawWidth, drawHeight);

      detections.forEach((det) => {
        const [x, y, w, h] = det.bbox;
        const sx = x * scale;
        const sy = y * scale;
        const sw = w * scale;
        const sh = h * scale;

        // Glow effect
        ctx.shadowColor = 'rgba(139, 92, 246, 0.5)';
        ctx.shadowBlur = 8;
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.strokeRect(sx, sy, sw, sh);
        ctx.shadowBlur = 0;

        // Label background
        const labelText = `${det.label} ${Math.round(det.confidence * 100)}%`;
        ctx.font = 'bold 13px Inter, sans-serif';
        const textMetrics = ctx.measureText(labelText);
        
        ctx.fillStyle = 'rgba(139, 92, 246, 0.85)';
        ctx.beginPath();
        const radius = 4;
        const lw = textMetrics.width + 10;
        const lh = 22;
        const lx = sx;
        const ly = sy - lh - 2;
        ctx.moveTo(lx + radius, ly);
        ctx.lineTo(lx + lw - radius, ly);
        ctx.quadraticCurveTo(lx + lw, ly, lx + lw, ly + radius);
        ctx.lineTo(lx + lw, ly + lh - radius);
        ctx.quadraticCurveTo(lx + lw, ly + lh, lx + lw - radius, ly + lh);
        ctx.lineTo(lx + radius, ly + lh);
        ctx.quadraticCurveTo(lx, ly + lh, lx, ly + lh - radius);
        ctx.lineTo(lx, ly + radius);
        ctx.quadraticCurveTo(lx, ly, lx + radius, ly);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillText(labelText, sx + 5, sy - 8);
      });
    };
  }, [imageUrl, detections]);

  return (
    <div className="w-full flex justify-center glass-light rounded-xl overflow-hidden">
      <canvas ref={canvasRef} className="max-w-full h-auto" />
    </div>
  );
};

export default ImageCanvas;
