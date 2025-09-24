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
}

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
  size = 'medium'
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
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw equator and meridians
    ctx.strokeStyle = '#cbd5e1';
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
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    
    // X axis (red)
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(-radius * 1.2, 0);
    ctx.lineTo(radius * 1.2, 0);
    ctx.stroke();
    
    // Y axis (green) - with perspective
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
    ctx.fillStyle = '#1f2937';
    ctx.font = `${12 * config.scale}px Arial`;
    ctx.textAlign = 'center';
    
    ctx.fillStyle = '#ef4444';
    ctx.fillText('X', radius * 1.3, 5);
    ctx.fillStyle = '#22c55e';
    ctx.fillText('Y', yEndX + 10, yEndY);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('Z', 0, -radius * 1.3);

    // Draw |0⟩ and |1⟩ labels
    ctx.fillStyle = '#6366f1';
    ctx.font = `${14 * config.scale}px Arial`;
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
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(rotatedX, rotatedY);
    ctx.stroke();

    // Draw state point
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.arc(rotatedX, rotatedY, 8 * config.scale, 0, 2 * Math.PI);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = '#8b5cf6';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#a78bfa';
    ctx.beginPath();
    ctx.arc(rotatedX, rotatedY, 6 * config.scale, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  };

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

  // Draw whenever state or rotation changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawBlochSphere(ctx, selectedState, rotation.x, rotation.y);
  }, [selectedState, rotation, config]);

  // Update state when manual controls change
  useEffect(() => {
    if (showControls) {
      const newState = blochToState(manualTheta[0], manualPhi[0]);
      setSelectedState(newState);
      onStateChange?.(newState);
    }
  }, [manualTheta, manualPhi, showControls, onStateChange]);

  // Update state when external state changes
  useEffect(() => {
    if (quantumState) {
      setSelectedState(quantumState);
    }
  }, [quantumState]);

  const blochCoords = stateToBloch(selectedState);
  const probability0 = selectedState.alpha.real ** 2 + selectedState.alpha.imaginary ** 2;
  const probability1 = selectedState.beta.real ** 2 + selectedState.beta.imaginary ** 2;

  // Preset quantum states
  const presetStates = {
    ground: { alpha: { real: 1, imaginary: 0 }, beta: { real: 0, imaginary: 0 } },
    excited: { alpha: { real: 0, imaginary: 0 }, beta: { real: 1, imaginary: 0 } },
    plus: { alpha: { real: 1/Math.sqrt(2), imaginary: 0 }, beta: { real: 1/Math.sqrt(2), imaginary: 0 } },
    minus: { alpha: { real: 1/Math.sqrt(2), imaginary: 0 }, beta: { real: -1/Math.sqrt(2), imaginary: 0 } },
    plusI: { alpha: { real: 1/Math.sqrt(2), imaginary: 0 }, beta: { real: 0, imaginary: 1/Math.sqrt(2) } },
    minusI: { alpha: { real: 1/Math.sqrt(2), imaginary: 0 }, beta: { real: 0, imaginary: -1/Math.sqrt(2) } }
  };

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
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <canvas
              ref={canvasRef}
              width={config.width}
              height={config.height}
              className="border rounded-lg shadow-lg bg-white dark:bg-gray-800"
            />
            
            {/* Floating state information */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg border"
            >
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>P(|0⟩) = {(probability0 * 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>P(|1⟩) = {(probability1 * 100).toFixed(1)}%</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Quantum State Information */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium">Bloch Coordinates</h4>
            <div className="space-y-1 font-mono text-xs">
              <div>X: {blochCoords.x.toFixed(3)}</div>
              <div>Y: {blochCoords.y.toFixed(3)}</div>
              <div>Z: {blochCoords.z.toFixed(3)}</div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Spherical Angles</h4>
            <div className="space-y-1 font-mono text-xs">
              <div>θ: {(blochCoords.theta * 180 / Math.PI).toFixed(1)}°</div>
              <div>φ: {(blochCoords.phi * 180 / Math.PI).toFixed(1)}°</div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAnimating(!isAnimating)}
            data-testid="button-toggle-animation"
          >
            {isAnimating ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {isAnimating ? 'Pause' : 'Rotate'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRotation({ x: 0, y: 0 })}
            data-testid="button-reset-rotation"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset View
          </Button>
        </div>

        {/* Preset States */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Quantum States</h4>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(presetStates).map(([name, state]) => (
              <Button
                key={name}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedState(state);
                  onStateChange?.(state);
                }}
                className="text-xs"
                data-testid={`button-preset-${name}`}
              >
                |{name === 'ground' ? '0' : name === 'excited' ? '1' : name}⟩
              </Button>
            ))}
          </div>
        </div>

        {/* Manual Controls */}
        {showControls && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4 border-t pt-4"
          >
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Manual State Control
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium">Polar Angle (θ): {(manualTheta[0] * 180 / Math.PI).toFixed(1)}°</label>
                <Slider
                  value={manualTheta}
                  onValueChange={setManualTheta}
                  max={Math.PI}
                  step={0.01}
                  className="mt-2"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium">Azimuthal Angle (φ): {(manualPhi[0] * 180 / Math.PI).toFixed(1)}°</label>
                <Slider
                  value={manualPhi}
                  onValueChange={setManualPhi}
                  min={-Math.PI}
                  max={Math.PI}
                  step={0.01}
                  className="mt-2"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* State Vector Display */}
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div className="text-xs font-mono">
            <div className="font-medium mb-1">Current State:</div>
            <div>
              |ψ⟩ = {selectedState.alpha.real.toFixed(3)}|0⟩ + 
              ({selectedState.beta.real.toFixed(3)} + {selectedState.beta.imaginary.toFixed(3)}i)|1⟩
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}