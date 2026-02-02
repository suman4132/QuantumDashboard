
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function AdminRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // SECRET KEY VALIDATION (Client-side simulation for demo)
      // In production, this key should be validated by the backend during signup
      if (adminKey !== 'QUANTUM_ADMIN_2026') {
          throw new Error("Invalid Administrative Secret Key. Access Denied.");
      }

      await signup(name, email, password); // We will manually patch role after mock signup

      // PATCH: Force role to admin since our basic mock signup might default to 'user'
      // This is a DEMO hack. In real backend, we'd pass { role: 'admin', secretKey: ... } to endpoint.
      const userData = localStorage.getItem('user-data');
      if (userData) {
          const user = JSON.parse(userData);
          user.role = 'admin';
          localStorage.setItem('user-data', JSON.stringify(user));
      }

      toast({
        title: "Administrative Access Granted",
        description: "Admin account initialized successfully.",
      });

      navigate('/admin');

    } catch (error) {
      toast({
        title: "Registration Rejected",
        description: error instanceof Error ? error.message : "Security Protocol Failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Warning Tape Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
         <div className="absolute top-0 left-0 w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,#000_20px,#000_40px)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg"
      >
        <Card className="bg-slate-900 border-red-900/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />
          
          <CardHeader className="space-y-1 text-center pb-6">
             <div className="mx-auto bg-red-500/10 p-3 rounded-full w-fit mb-2 border border-red-500/20">
                <ShieldAlert className="w-8 h-8 text-red-500" />
             </div>
            <CardTitle className="text-2xl font-bold text-white">Initialize Admin Node</CardTitle>
            <CardDescription className="text-slate-400">
              Enter secure credentials and authorization key
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">Admin Name</Label>
                    <Input
                        id="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-slate-950 border-slate-800 text-white focus:border-red-500/50"
                        required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">System Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="admin@corp.io"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-slate-950 border-slate-800 text-white focus:border-red-500/50"
                        required
                    />
                  </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 bg-slate-950 border-slate-800 text-white focus:border-red-500/50"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="key" className="text-red-400 font-semibold text-xs uppercase tracking-wider">Root Authorization Key</Label>
                <Input
                    id="key"
                    type="text" // Visible for demo ease, often masked in real life
                    placeholder="Required for admin creation"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    className="bg-red-950/20 border-red-900/50 text-red-200 placeholder:text-red-900/50 focus:border-red-500 focus:bg-red-950/30 font-mono tracking-widest text-center"
                    required
                />
                <p className="text-[10px] text-slate-500 text-center">
                    Hint: Use key <span className="text-slate-400 font-mono">QUANTUM_ADMIN_2026</span> for demo verification.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-5 mt-4"
                disabled={isLoading}
              >
                {isLoading ? "Verifying Protocols..." : "Initialize Admin Access"}
              </Button>
            </form>
            <div className="mt-6 text-center">
                <Link to="/admin/login" className="text-sm text-slate-500 hover:text-white flex items-center justify-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Back to Admin Login
                </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
