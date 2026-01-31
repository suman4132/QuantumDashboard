import { useRef, useEffect, useState } from 'react';

export default function QuantumGates() {
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

      const gates = [
        { x: 100, label: 'H', color: '#06b6d4', desc: 'Hadamard' },
        { x: 250, label: 'X', color: '#8b5cf6', desc: 'Pauli-X' },
        { x: 400, label: 'Z', color: '#ec4899', desc: 'Pauli-Z' },
        { x: 550, label: 'CNOT', color: '#10b981', desc: 'Controlled-NOT' },
        { x: 700, label: 'T', color: '#f59e0b', desc: 'T Gate' },
      ];

      let rotation = 0;

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        gates.forEach((gate) => {
          const wobble = Math.sin(rotation + gate.x / 100) * 5;
          
          // Draw gate box
          ctx.save();
          ctx.translate(gate.x, 175 + wobble);
          ctx.rotate(Math.sin(rotation + gate.x / 100) * 0.1);
          
          // Box shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.fillRect(-47, -47, 94, 94);
          
          // Box
          ctx.fillStyle = gate.color;
          ctx.fillRect(-45, -45, 90, 90);
          
          // Label
          ctx.fillStyle = 'white';
          ctx.font = 'bold 32px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(gate.label, 0, 0);
          
          ctx.restore();
          
          // Description
          ctx.fillStyle = '#94a3b8';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(gate.desc, gate.x, 260);
        });

        rotation += 0.02;
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
      <div className="w-full h-[350px] bg-gradient-to-br from-cyan-900 to-blue-900 rounded-lg flex items-center justify-center text-slate-400">
        Quantum Gates Visualization
      </div>
    );
  }

  return (
    <div className="w-full h-[350px] bg-gradient-to-br from-cyan-900 to-blue-900 rounded-lg flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={350}
        className="max-w-full rounded-lg"
      />
    </div>
  );
}
