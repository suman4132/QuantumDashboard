import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Maximize, 
  RotateCcw, 
  Play, 
  Pause,
  Eye,
  Zap,
  Target
} from "lucide-react";

// Complex number representation
interface Complex {
  real: number;
  imaginary: number;
}

// Quantum state for single qubit
interface QubitState {
  alpha: Complex; // |0⟩ coefficient
  beta: Complex;  // |1⟩ coefficient
}

// Bloch sphere coordinates
interface BlochCoordinates {
  x: number;
  y: number;
  z: number;
  theta: number; // polar angle
  phi: number;   // azimuthal angle
}


interface BlochSphereVisualizerProps {
  quantumState?: QubitState;
  onStateChange?: (state: QubitState) => void;
  showControls?: boolean;
  autoRotate?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'card' | 'minimal';
}

// ... imports and state helpers ...

// Convert quantum state to Bloch coordinates
const stateToBloch = (state: QubitState): BlochCoordinates => {
  const { alpha, beta } = state;
  
  // Calculate Bloch coordinates using Pauli matrices
  const x = 2 * (alpha.real * beta.real + alpha.imaginary * beta.imaginary);
  const y = 2 * (alpha.imaginary * beta.real - alpha.real * beta.imaginary);
  const z = alpha.real * alpha.real + alpha.imaginary * alpha.imaginary - 
           (beta.real * beta.real + beta.imaginary * beta.imaginary);
  
  // Calculate spherical coordinates
  const r = Math.sqrt(x*x + y*y + z*z);
  const theta = r > 0 ? Math.acos(z / r) : 0;
  const phi = Math.atan2(y, x);
  
  return { x, y, z, theta, phi };
};

// Convert Bloch coordinates to quantum state
const blochToState = (theta: number, phi: number): QubitState => {
  return {
    alpha: { 
      real: Math.cos(theta / 2), 
      imaginary: 0 
    },
    beta: { 
      real: Math.sin(theta / 2) * Math.cos(phi), 
      imaginary: Math.sin(theta / 2) * Math.sin(phi) 
    }
  };
};

export function BlochSphereVisualizer({ 
  quantumState, 
  onStateChange, 
  showControls = false,
  autoRotate = false,
  size = 'medium',
  variant = 'card'
}: BlochSphereVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isAnimating, setIsAnimating] = useState(autoRotate);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [selectedState, setSelectedState] = useState<QubitState>(
    quantumState || { 
      alpha: { real: 1, imaginary: 0 }, 
      beta: { real: 0, imaginary: 0 } 
    }
  );
  const [manualTheta, setManualTheta] = useState([0]);
  const [manualPhi, setManualPhi] = useState([0]);

  const sizeConfig = {
    small: { width: 200, height: 200, scale: 0.7 },
    medium: { width: 300, height: 300, scale: 1 },
    large: { width: 400, height: 400, scale: 1.3 }
  };

  const config = sizeConfig[size];

  // Draw the Bloch sphere
  const drawBlochSphere = (ctx: CanvasRenderingContext2D, state: QubitState, rotX: number, rotY: number) => {
    const centerX = config.width / 2;
    const centerY = config.height / 2;
    const radius = 80 * config.scale;

    // Clear canvas
    ctx.clearRect(0, 0, config.width, config.height);
    
    // Apply rotation transformations
    ctx.save();
    ctx.translate(centerX, centerY);
    
    // Draw sphere outline
    ctx.strokeStyle = variant === 'minimal' ? 'rgba(59, 130, 246, 0.3)' : '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw equator and meridians
    ctx.strokeStyle = variant === 'minimal' ? 'rgba(59, 130, 246, 0.1)' : '#cbd5e1';
    ctx.lineWidth = 1;
    
    // Equator
    ctx.beginPath();
    ctx.ellipse(0, 0, radius, radius * 0.3, 0, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Vertical meridian
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 0.3, radius, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw axes
    // X axis (red)
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(-radius * 1.2, 0);
    ctx.lineTo(radius * 1.2, 0);
    ctx.stroke();
    
    // Y axis (green)
    const yStartX = -radius * 1.2 * Math.cos(Math.PI / 6);
    const yStartY = radius * 1.2 * Math.sin(Math.PI / 6);
    const yEndX = radius * 1.2 * Math.cos(Math.PI / 6);
    const yEndY = -radius * 1.2 * Math.sin(Math.PI / 6);
    ctx.strokeStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(yStartX, yStartY);
    ctx.lineTo(yEndX, yEndY);
    ctx.stroke();
    
    // Z axis (blue)
    ctx.strokeStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(0, -radius * 1.2);
    ctx.lineTo(0, radius * 1.2);
    ctx.stroke();

    // Draw axis labels
    ctx.font = `${12 * config.scale}px Arial`;
    ctx.textAlign = 'center';
    
    ctx.fillStyle = '#ef4444';
    ctx.fillText('X', radius * 1.3, 5);
    ctx.fillStyle = '#22c55e';
    ctx.fillText('Y', yEndX + 10, yEndY);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('Z', 0, -radius * 1.3);

    // Draw |0⟩ and |1⟩ labels
    ctx.fillStyle = variant === 'minimal' ? '#93c5fd' : '#6366f1';
    ctx.font = `${14 * config.scale}px monospace`;
    ctx.fillText('|0⟩', 0, -radius - 20);
    ctx.fillText('|1⟩', 0, radius + 30);

    // Calculate and draw state vector
    const bloch = stateToBloch(state);
    const stateX = bloch.x * radius;
    const stateY = -bloch.z * radius; // Invert Z for screen coordinates
    const stateZ = bloch.y * radius;

    // Apply 3D rotation for visualization
    const rotatedX = stateX * Math.cos(rotY) + stateZ * Math.sin(rotY);
    const rotatedY = stateY;
    const rotatedZ = -stateX * Math.sin(rotY) + stateZ * Math.cos(rotY);

    // Draw state vector
    ctx.strokeStyle = '#d8b4fe';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(rotatedX, rotatedY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw state point
    ctx.fillStyle = '#d8b4fe';
    ctx.beginPath();
    ctx.arc(rotatedX, rotatedY, 5 * config.scale, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();
  };

  // ... (Keep existing hooks: useEffect for animation, draw, etc.) ...
  // Animation loop
  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        setRotation(prev => ({ 
          x: prev.x + 0.01, 
          y: prev.y + 0.005 
        }));
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating]);

  // Draw on change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawBlochSphere(ctx, selectedState, rotation.x, rotation.y);
  }, [selectedState, rotation, config, variant]);

  // Handle external state updates
  useEffect(() => {
    if (quantumState) setSelectedState(quantumState);
  }, [quantumState]);
  
  // Handle manual controls
  useEffect(() => {
    if (showControls) {
      const newState = blochToState(manualTheta[0], manualPhi[0]);
      setSelectedState(newState);
      onStateChange?.(newState);
    }
  }, [manualTheta, manualPhi, showControls, onStateChange]);


  const content = (
      <div className="flex flex-col items-center justify-center w-full h-full relative">
        <canvas
          ref={canvasRef}
          width={config.width}
          height={config.height}
          className={`${variant === 'card' ? 'border rounded-lg shadow-lg bg-white dark:bg-gray-800' : ''}`}
        />
        {/* Only show Floating Info in Card Mode or if specifically needed */}
        {variant === 'card' && (
             <div className="absolute -bottom-4 bg-white dark:bg-gray-800 p-2 rounded shadow text-xs">
                 |ψ⟩ Viz
             </div>
        )}
      </div>
  );

  if (variant === 'minimal') {
    return content;
  }

  // Preset quantum states
  const presetStates = {
    ground: { alpha: { real: 1, imaginary: 0 }, beta: { real: 0, imaginary: 0 } },
    excited: { alpha: { real: 0, imaginary: 0 }, beta: { real: 1, imaginary: 0 } },
    plus: { alpha: { real: 1/Math.sqrt(2), imaginary: 0 }, beta: { real: 1/Math.sqrt(2), imaginary: 0 } },
    minus: { alpha: { real: 1/Math.sqrt(2), imaginary: 0 }, beta: { real: -1/Math.sqrt(2), imaginary: 0 } },
  };
  
  const blochCoords = stateToBloch(selectedState);

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Bloch Sphere Visualization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
            {content}
        </div>
        
        {/* Only show standard controls if NOT minimal */}
        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
           {/* ... Coordinates info ... */}
           <div className="space-y-1 font-mono text-xs">
              <div>θ: {(blochCoords.theta * 180 / Math.PI).toFixed(1)}°</div>
              <div>φ: {(blochCoords.phi * 180 / Math.PI).toFixed(1)}°</div>
           </div>
        </div>

        <div className="flex gap-2 mt-4">
            <Button size="sm" variant="outline" onClick={() => setIsAnimating(!isAnimating)}>
                {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setRotation({x:0, y:0})}>
                <RotateCcw className="w-4 h-4" />
            </Button>
        </div>

        {showControls && (
             <div className="mt-4 border-t pt-4">
                 <p className="text-xs mb-2">Theta</p>
                 <Slider value={manualTheta} onValueChange={setManualTheta} max={Math.PI} step={0.01} />
                 <p className="text-xs mb-2 mt-2">Phi</p>
                 <Slider value={manualPhi} onValueChange={setManualPhi} min={-Math.PI} max={Math.PI} step={0.01} />
             </div>
        )}
      </CardContent>
    </Card>
  );
}