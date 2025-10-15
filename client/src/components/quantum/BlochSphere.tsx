import { useRef, useEffect, useState } from 'react';

export default function BlochSphere() {
  const [hasWebGL, setHasWebGL] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setHasWebGL(false);
        return;
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 120;
      
      let angle = 0;

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw sphere outline
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw axes
        // X axis (red)
        ctx.beginPath();
        ctx.moveTo(centerX - radius - 20, centerY);
        ctx.lineTo(centerX + radius + 20, centerY);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Y axis (green)
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - radius - 20);
        ctx.lineTo(centerX, centerY + radius + 20);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Z axis (blue) - simulated with ellipse
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 60, radius, 0, 0, 2 * Math.PI);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw state vector (rotating)
        const x = Math.cos(angle) * radius * 0.8;
        const y = Math.sin(angle) * radius * 0.8;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + x, centerY + y);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw state point
        ctx.beginPath();
        ctx.arc(centerX + x, centerY + y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#fbbf24';
        ctx.fill();
        
        angle += 0.01;
        requestAnimationFrame(animate);
      };

      animate();
    } catch (error) {
      console.error('Canvas error:', error);
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-[400px] bg-gradient-to-br from-slate-900 to-indigo-900 rounded-lg flex items-center justify-center text-slate-400">
        Bloch Sphere Visualization
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] bg-gradient-to-br from-slate-900 to-indigo-900 rounded-lg flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={400}
        className="max-w-full"
      />
    </div>
  );
}
