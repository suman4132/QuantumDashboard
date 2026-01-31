import { useRef, useEffect, useState } from 'react';

export default function QuantumParticles() {
  const [hasCanvas, setHasCanvas] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setHasCanvas(false);
        return;
      }

      const particles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        color: string;
      }> = [];

      // Create particles
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const z = Math.random() * canvas.width;
        const y = Math.exp(-(Math.pow((x - canvas.width/2)/80, 2) + Math.pow((z - canvas.width/2)/80, 2))) * 150 + 100;
        
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          color: `hsla(${250 + Math.random() * 40}, 70%, 60%, ${Math.random() * 0.8 + 0.2})`
        });
      }

      const animate = () => {
        ctx.fillStyle = 'rgba(88, 28, 135, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle) => {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
          ctx.fillStyle = particle.color;
          ctx.fill();
          
          // Add glow effect
          ctx.shadowBlur = 10;
          ctx.shadowColor = particle.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        requestAnimationFrame(animate);
      };

      animate();
    } catch (error) {
      console.error('Canvas error:', error);
      setHasCanvas(false);
    }
  }, []);

  if (!hasCanvas) {
    return (
      <div className="w-full h-[300px] bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg flex items-center justify-center text-slate-400">
        Quantum Wave Function Visualization
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={300}
        className="max-w-full rounded-lg"
      />
    </div>
  );
}
