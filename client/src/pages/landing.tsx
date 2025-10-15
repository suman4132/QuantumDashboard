import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Code, 
  BookOpen, 
  Menu,
  X,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Sparkles,
  Atom,
  Check,
  Users,
  Youtube
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';

// Enhanced floating particles component with quantum-like effects
const FloatingParticles = () => {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    animationDelay: Math.random() * 8,
    duration: Math.random() * 15 + 10,
    color: ['blue', 'purple', 'pink', 'cyan'][Math.floor(Math.random() * 4)]
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${
            particle.color === 'blue' ? 'bg-blue-400/30' :
            particle.color === 'purple' ? 'bg-purple-400/30' :
            particle.color === 'pink' ? 'bg-pink-400/30' : 'bg-cyan-400/30'
          }`}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            filter: 'blur(0.5px)',
            boxShadow: `0 0 ${particle.size * 2}px currentColor`
          }}
          animate={{
            y: [0, -window.innerHeight * 0.3, 0],
            x: [0, Math.sin(particle.id) * 100, 0],
            opacity: [0, 1, 0.7, 1, 0],
            scale: [0, 1, 1.2, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.animationDelay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Quantum circuit animation component
const QuantumCircuit = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <svg className="absolute inset-0 w-full h-full">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.line
            key={i}
            x1="0"
            y1={`${(i + 1) * 12.5}%`}
            x2="100%"
            y2={`${(i + 1) * 12.5}%`}
            stroke="currentColor"
            strokeWidth="1"
            className="text-blue-400"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 3
            }}
          />
        ))}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={`${(i + 1) * 6.67}%`}
            cy={`${Math.random() * 80 + 10}%`}
            r="3"
            fill="currentColor"
            className="text-purple-400"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 1.2, 1],
              opacity: [0, 1, 0.7, 1] 
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 4
            }}
          />
        ))}
      </svg>
    </div>
  );
};

// Holographic text effect component
const HolographicText = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent blur-sm"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {children}
      </motion.div>
      <div className="relative bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        {children}
      </div>
    </motion.div>
  );
};

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, login, signup } = useAuth();
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const handleLogin = () => {
    // Navigate to login page
    navigate('/login');
  };

  const handleSignUp = () => {
    // Navigate to signup page
    navigate('/signup');
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-blue-400" />,
      title: "Quantum Systems on Cloud",
      description: "Run real experiments on quantum hardware with instant access"
    },
    {
      icon: <Code className="w-8 h-8 text-purple-400" />,
      title: "Developer-Friendly SDKs",
      description: "Easy integration with Qiskit & APIs for seamless development"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-400" />,
      title: "Scalable & Secure",
      description: "Enterprise-ready platform with bank-level security"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-pink-400" />,
      title: "Learning Resources",
      description: "Comprehensive tutorials, docs, and guided quantum labs"
    }
  ];

  const useCases = [
    "Education & Research",
    "Enterprise Applications", 
    "AI + Quantum Integration",
    "Optimization Problems"
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      features: ["5 quantum jobs/month", "Basic tutorials", "Community support"],
      cta: "Start Free"
    },
    {
      name: "Professional",
      price: "$99",
      features: ["Unlimited jobs", "Priority queue", "Advanced features", "Email support"],
      cta: "Start Trial",
      popular: true
    },
    {
      name: "Enterprise", 
      price: "Custom",
      features: ["Dedicated resources", "Custom integrations", "24/7 support", "SLA guarantee"],
      cta: "Contact Sales"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"
          style={{ y: backgroundY }}
          animate={{
            background: [
              "linear-gradient(135deg, rgba(29, 78, 216, 0.3) 0%, rgba(147, 51, 234, 0.25) 50%, rgba(236, 72, 153, 0.2) 100%)",
              "linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(168, 85, 247, 0.25) 50%, rgba(244, 114, 182, 0.2) 100%)",
              "linear-gradient(135deg, rgba(29, 78, 216, 0.3) 0%, rgba(147, 51, 234, 0.25) 50%, rgba(236, 72, 153, 0.2) 100%)"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Dynamic grid pattern */}
        <div className="absolute inset-0 opacity-30">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"
            animate={{
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `radial-gradient(circle at 30px 30px, rgba(156, 146, 172, 0.15) 2px, transparent 2px)`,
              backgroundSize: '60px 60px'
            }}
            animate={{
              backgroundPosition: ['0px 0px', '60px 60px', '0px 0px']
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Quantum circuit background */}
        <QuantumCircuit />

        {/* Enhanced floating geometric shapes */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 border-2 border-blue-400/30 rounded-full"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            borderColor: [
              "rgba(59, 130, 246, 0.3)",
              "rgba(147, 51, 234, 0.3)",
              "rgba(236, 72, 153, 0.3)",
              "rgba(59, 130, 246, 0.3)"
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <motion.div
          className="absolute top-40 right-20 w-24 h-24 border-2 border-purple-400/30"
          animate={{
            rotate: [0, -180, -360],
            y: [-10, 10, -10],
            scale: [1, 1.2, 1],
            borderColor: [
              "rgba(147, 51, 234, 0.3)",
              "rgba(236, 72, 153, 0.3)",
              "rgba(59, 130, 246, 0.3)",
              "rgba(147, 51, 234, 0.3)"
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className="absolute bottom-40 left-20 w-20 h-20 bg-gradient-to-r from-pink-400/20 to-blue-400/20 rounded-lg"
          animate={{
            rotate: [0, 45, 90, 45, 0],
            x: [-5, 5, -5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Additional quantum-inspired shapes */}
        <motion.div
          className="absolute top-1/3 right-1/3 w-16 h-16"
          animate={{
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.3, 1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full border-2 border-cyan-400/30 transform rotate-45"></div>
          <div className="absolute inset-2 border border-purple-400/30 rounded-full"></div>
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full"
          animate={{
            y: [0, -30, 0],
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <FloatingParticles />
      </div>

      {/* Header */}
      <motion.header 
        className="fixed top-0 w-full z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Atom className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                QuantumCloud
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="hover:text-blue-400 transition-colors">Home</a>
              <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
              <button onClick={() => navigate('/docs')} className="hover:text-blue-400 transition-colors">Docs</button>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={handleLogin}>Login</Button>
                  <Button onClick={handleSignUp} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-gray-800 border-t border-gray-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-4 py-4 space-y-4">
              <a href="#home" className="block hover:text-blue-400 transition-colors">Home</a>
              <a href="#features" className="block hover:text-blue-400 transition-colors">Features</a>
              <a href="#pricing" className="block hover:text-blue-400 transition-colors">Pricing</a>
              <button onClick={() => navigate('/docs')} className="block hover:text-blue-400 transition-colors text-left">Docs</button>
              <div className="pt-4 border-t border-gray-700 space-y-2">
                {isAuthenticated ? (
                  <Button onClick={() => navigate('/dashboard')} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleLogin} variant="ghost" className="w-full">Login</Button>
                    <Button onClick={handleSignUp} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            style={{ y: textY }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Experience the Future of{" "}
              </motion.span>
              <HolographicText className="inline-block">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  whileHover={{ 
                    scale: 1.05,
                    textShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
                  }}
                >
                  Quantum Computing
                </motion.span>
              </HolographicText>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                {" "}in the Cloud
              </motion.span>
            </motion.h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Run, learn, and innovate with powerful quantum systems accessible anywhere. 
              Join the quantum revolution today.
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Button 
                  onClick={handleGetStarted}
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 relative overflow-hidden group border-0"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/20"
                    initial={{ x: "-100%", skewX: -15 }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30"
                    animate={{
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <span className="relative flex items-center font-semibold">
                    <motion.span
                      animate={{ 
                        textShadow: [
                          "0 0 0px rgba(255,255,255,0)",
                          "0 0 10px rgba(255,255,255,0.3)",
                          "0 0 0px rgba(255,255,255,0)"
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      Get Started
                    </motion.span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </motion.div>
                  </span>
                </Button>

                {/* Particle effect around button */}
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-blue-400 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        x: [0, (Math.random() - 0.5) * 20],
                        y: [0, (Math.random() - 0.5) * 20],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(156, 163, 175, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate('/docs')}
                  className="text-lg px-8 py-4 border-2 border-gray-600 text-white hover:bg-gray-800 relative group overflow-hidden backdrop-blur-sm"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative flex items-center font-semibold">
                    <motion.div
                      animate={{ rotate: [0, 15, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <BookOpen className="mr-2 w-5 h-5" />
                    </motion.div>
                    Explore Docs
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Powerful Quantum Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to harness the power of quantum computing
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -15,
                  rotateY: 5,
                  rotateX: 5,
                  scale: 1.02
                }}
                className="perspective-1000"
              >
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 hover:border-blue-500/50 transition-all duration-500 group relative overflow-hidden h-full">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.5 }}
                  />

                  {/* Animated border effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    initial={{ background: "conic-gradient(from 0deg, transparent, transparent)" }}
                    whileHover={{
                      background: [
                        "conic-gradient(from 0deg, rgba(59, 130, 246, 0.3), transparent, transparent, rgba(59, 130, 246, 0.3))",
                        "conic-gradient(from 180deg, rgba(147, 51, 234, 0.3), transparent, transparent, rgba(147, 51, 234, 0.3))",
                        "conic-gradient(from 360deg, rgba(59, 130, 246, 0.3), transparent, transparent, rgba(59, 130, 246, 0.3))"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ padding: '1px', borderRadius: '0.5rem' }}
                  />

                  <CardContent className="p-6 text-center relative z-10 h-full flex flex-col">
                    <motion.div 
                      className="mb-4 group-hover:scale-125 transition-all duration-500"
                      whileHover={{ 
                        rotate: [0, -15, 15, 0],
                        filter: "drop-shadow(0 0 10px currentColor)"
                      }}
                      transition={{ duration: 0.8 }}
                    >
                      <motion.div
                        animate={{
                          filter: [
                            "drop-shadow(0 0 0px currentColor)",
                            "drop-shadow(0 0 5px currentColor)",
                            "drop-shadow(0 0 0px currentColor)"
                          ]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {feature.icon}
                      </motion.div>
                    </motion.div>

                    <motion.h3 
                      className="text-xl font-semibold mb-2"
                      whileHover={{ 
                        color: "#60a5fa",
                        textShadow: "0 0 10px rgba(96, 165, 250, 0.5)"
                      }}
                    >
                      {feature.title}
                    </motion.h3>

                    <motion.p 
                      className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 flex-grow"
                      whileHover={{ scale: 1.02 }}
                    >
                      {feature.description}
                    </motion.p>

                    {/* Floating particles on hover */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-blue-400 rounded-full"
                          style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${20 + Math.random() * 60}%`,
                          }}
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                            x: [0, (Math.random() - 0.5) * 30],
                            y: [0, (Math.random() - 0.5) * 30],
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.3,
                            repeat: Infinity,
                            ease: "easeOut"
                          }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Intuitive Dashboard
            </h2>
            <p className="text-xl text-gray-300">
              Manage jobs, track results, and scale effortlessly
            </p>
          </motion.div>

          <motion.div 
            className="relative max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-xl opacity-50"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-xl relative">
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="h-64 md:h-96 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                    <motion.div
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <Atom className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      </motion.div>
                      <p className="text-gray-400 mb-2">Quantum Dashboard</p>
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                        <Sparkles className="w-4 h-4" />
                        <span>Real-time quantum computing</span>
                        <Globe className="w-4 h-4" />
                      </div>
                    </motion.div>

                    {/* Simulated dashboard elements */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center opacity-30">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="text-xs text-gray-500">QuantumCloud Dashboard</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Use Cases & Solutions
            </h2>
            <p className="text-xl text-gray-300">
              Quantum computing for every industry
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-600 hover:border-blue-500/50 transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Atom className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold">{useCase}</h3>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-300">
              Start free, scale as you grow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`relative bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600">
                      Most Popular
                    </Badge>
                  )}
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== 'Custom' && <span className="text-gray-400">/month</span>}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center justify-center space-x-2">
                          <Check className="w-5 h-5 text-green-400" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      onClick={handleGetStarted}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Join Our Quantum Network
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Connect with researchers, developers, and innovators worldwide
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Users className="w-6 h-6 text-blue-400" />
              <span className="text-lg">10,000+ Active Users</span>
              <span className="text-gray-500">•</span>
              <span className="text-lg">500+ Organizations</span>
              <span className="text-gray-500">•</span>
              <span className="text-lg">50+ Countries</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-pink-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Get Started with Quantum Today
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Ready to explore the quantum frontier? Join thousands of researchers and developers.
            </p>
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-12 py-4"
            >
              Sign Up Free <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo & Tagline */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Atom className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  QuantumCloud
                </span>
              </div>
              <p className="text-gray-400">
                Empowering the future through quantum computing in the cloud.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#about" className="block text-gray-400 hover:text-white transition-colors">About</a>
                <a href="#docs" className="block text-gray-400 hover:text-white transition-colors">Documentation</a>
                <a href="#careers" className="block text-gray-400 hover:text-white transition-colors">Careers</a>
                <a href="#blog" className="block text-gray-400 hover:text-white transition-colors">Blog</a>
                <a href="#contact" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 QuantumCloud. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}