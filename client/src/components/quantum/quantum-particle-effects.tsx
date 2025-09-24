import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Particle system for quantum effects
interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'quantum' | 'entanglement' | 'superposition' | 'measurement' | 'gate';
}

interface QuantumParticleEffectsProps {
  trigger?: string;
  intensity?: 'low' | 'medium' | 'high' | 'ultra';
  effectType?: 'success' | 'error' | 'quantum' | 'entanglement' | 'superposition' | 'measurement' | 'algorithm' | 'celebration';
  width?: number;
  height?: number;
  className?: string;
  algorithm?: string; // For algorithm-specific effects
}

export function QuantumParticleEffects({ 
  trigger, 
  intensity = 'medium',
  effectType = 'quantum',
  width = 400,
  height = 300,
  className = "",
  algorithm
}: QuantumParticleEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [particles, setParticles] = useState<Particle[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  // Enhanced color schemes for quantum concepts
  const colorSchemes = {
    success: ['#22c55e', '#10b981', '#059669', '#047857'],
    error: ['#ef4444', '#dc2626', '#b91c1c', '#991b1b'],
    quantum: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'],
    entanglement: ['#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8'],
    superposition: ['#06b6d4', '#0891b2', '#0e7490', '#155e75'],
    measurement: ['#f59e0b', '#d97706', '#b45309', '#92400e'],
    algorithm: ['#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'],
    celebration: ['#fbbf24', '#f59e0b', '#d97706', '#b45309']
  };

  const colors = colorSchemes[effectType];

  // Create particles based on effect type
  const createParticles = (count: number, centerX: number, centerY: number, type: string) => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = Math.random() * 3 + 1;
      const life = Math.random() * 60 + 30;
      
      newParticles.push({
        id: `${type}-${Date.now()}-${i}`,
        x: centerX + (Math.random() - 0.5) * 20,
        y: centerY + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: life,
        maxLife: life,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
        type: type as any
      });
    }
    
    return newParticles;
  };

  // Enhanced quantum effect patterns
  const createQuantumBurst = (centerX?: number, centerY?: number) => {
    const x = centerX || width / 2;
    const y = centerY || height / 2;
    const intensityMap = { low: 15, medium: 30, high: 50, ultra: 80 };
    const count = intensityMap[intensity] || 30;
    
    return createParticles(count, x, y, 'quantum');
  };

  const createAlgorithmEffect = () => {
    const particles: Particle[] = [];
    
    if (algorithm === 'grovers') {
      // Grover's algorithm: convergent search pattern
      for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 * i) / 20;
        particles.push({
          id: `grovers-${i}`,
          x: width / 2 + Math.cos(angle) * 80,
          y: height / 2 + Math.sin(angle) * 80,
          vx: -Math.cos(angle) * 2,
          vy: -Math.sin(angle) * 2,
          life: 100,
          maxLife: 100,
          color: '#dc2626',
          size: 4,
          type: 'quantum'
        });
      }
    } else if (algorithm === 'shors') {
      // Shor's algorithm: factoring pattern
      for (let i = 0; i < 30; i++) {
        particles.push({
          id: `shors-${i}`,
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 120,
          maxLife: 120,
          color: '#7c3aed',
          size: Math.random() * 3 + 2,
          type: 'quantum'
        });
      }
    }
    
    return particles;
  };

  const createCelebrationFireworks = () => {
    const fireworks: Particle[] = [];
    const fireworkCount = intensity === 'ultra' ? 6 : 3;
    
    for (let f = 0; f < fireworkCount; f++) {
      const centerX = Math.random() * width;
      const centerY = Math.random() * height * 0.6;
      
      for (let i = 0; i < 15; i++) {
        const angle = (Math.PI * 2 * i) / 15;
        const speed = Math.random() * 6 + 3;
        
        fireworks.push({
          id: `firework-${f}-${i}`,
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2, // Add upward bias
          life: 60 + Math.random() * 40,
          maxLife: 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 5 + 3,
          type: 'quantum'
        });
      }
    }
    
    return fireworks;
  };

  const createEntanglementEffect = () => {
    const particles1 = createParticles(10, width * 0.3, height / 2, 'entanglement');
    const particles2 = createParticles(10, width * 0.7, height / 2, 'entanglement');
    return [...particles1, ...particles2];
  };

  const createSuperpositionWave = () => {
    const waveParticles: Particle[] = [];
    const waveCount = 20;
    
    for (let i = 0; i < waveCount; i++) {
      const x = (width / waveCount) * i;
      const baseY = height / 2;
      const amplitude = 30;
      const frequency = 0.02;
      const y = baseY + Math.sin(x * frequency) * amplitude;
      
      waveParticles.push({
        id: `wave-${Date.now()}-${i}`,
        x,
        y,
        vx: 0.5,
        vy: Math.sin(x * frequency * 2) * 0.5,
        life: 120,
        maxLife: 120,
        color: colors[i % colors.length],
        size: 3,
        type: 'superposition'
      });
    }
    
    return waveParticles;
  };

  // Update particle physics
  const updateParticles = (particleList: Particle[]): Particle[] => {
    return particleList
      .map(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Apply quantum effects based on type
        if (particle.type === 'quantum') {
          // Add quantum uncertainty
          particle.vx += (Math.random() - 0.5) * 0.1;
          particle.vy += (Math.random() - 0.5) * 0.1;
          
          // Apply damping
          particle.vx *= 0.99;
          particle.vy *= 0.99;
        } else if (particle.type === 'entanglement') {
          // Entangled particles influence each other
          particle.vx += Math.sin(Date.now() * 0.01) * 0.1;
          particle.vy += Math.cos(Date.now() * 0.01) * 0.1;
        } else if (particle.type === 'superposition') {
          // Wave-like motion
          particle.y += Math.sin(particle.x * 0.02 + Date.now() * 0.01) * 0.2;
        }
        
        // Boundary conditions with quantum tunneling effect
        if (particle.x < 0 || particle.x > width) {
          if (Math.random() < 0.1) {
            // Quantum tunneling - particle appears on other side
            particle.x = particle.x < 0 ? width : 0;
          } else {
            particle.vx *= -0.8;
          }
        }
        
        if (particle.y < 0 || particle.y > height) {
          particle.vy *= -0.8;
        }
        
        // Decrease life
        particle.life--;
        
        return particle;
      })
      .filter(particle => particle.life > 0);
  };

  // Render particles
  const renderParticles = (ctx: CanvasRenderingContext2D, particleList: Particle[]) => {
    ctx.clearRect(0, 0, width, height);
    
    particleList.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      const size = particle.size * alpha;
      
      // Create gradient for glow effect
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, size * 2
      );
      gradient.addColorStop(0, particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, particle.color + '00');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add quantum glow
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = size * 2;
      ctx.fillStyle = particle.color + Math.floor(alpha * 128).toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  };

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      particlesRef.current = updateParticles(particlesRef.current);
      renderParticles(ctx, particlesRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height]);

  // Trigger effects
  useEffect(() => {
    if (trigger) {
      let newParticles: Particle[] = [];
      
      switch (trigger) {
        case 'quantum-burst':
          newParticles = createQuantumBurst();
          break;
        case 'entanglement':
          newParticles = createEntanglementEffect();
          break;
        case 'superposition':
          newParticles = createSuperpositionWave();
          break;
        case 'gate-placement':
          newParticles = createQuantumBurst(Math.random() * width, Math.random() * height);
          break;
        case 'measurement':
          newParticles = createQuantumBurst(width / 2, height / 2);
          break;
        default:
          newParticles = createQuantumBurst();
      }
      
      particlesRef.current = [...particlesRef.current, ...newParticles];
      setParticles(particlesRef.current);
    }
  }, [trigger]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 pointer-events-none z-10"
        style={{ 
          background: 'transparent',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
}

// Quantum success celebration component
export function QuantumSuccessCelebration({ show, onComplete }: { 
  show: boolean; 
  onComplete?: () => void;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          onAnimationComplete={() => {
            setTimeout(() => onComplete?.(), 3000);
          }}
        >
          {/* Central burst */}
          <QuantumParticleEffects
            trigger="quantum-burst"
            intensity="high"
            effectType="success"
            width={800}
            height={600}
            className="absolute inset-0"
          />
          
          {/* Quantum text effect */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-6xl font-bold z-20"
          >
            🎉 QUANTUM SUCCESS! 🎉
          </motion.div>
          
          {/* Floating quantum symbols */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 50,
                rotate: 0,
                scale: 0
              }}
              animate={{ 
                y: -50,
                rotate: 360,
                scale: [0, 1, 0],
                transition: {
                  duration: 3,
                  delay: Math.random() * 2,
                  ease: "easeOut"
                }
              }}
              className="absolute text-4xl"
            >
              {['⚛️', '🔬', '⚡', '🌟', '💫'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Quantum loading/thinking effect
export function QuantumThinkingEffect({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative w-full h-32 flex items-center justify-center"
        >
          <QuantumParticleEffects
            trigger="superposition"
            intensity="medium"
            effectType="quantum"
            width={300}
            height={100}
          />
          
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute text-purple-600 font-medium"
          >
            Quantum Computing...
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}