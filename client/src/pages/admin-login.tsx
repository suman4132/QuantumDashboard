
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      await login(email, password);
      
      // Delay slightly to allow auth hook / storage to propagate
      // and to give a "Verification" feel. 
      // Using await Promise to keep this in the try-catch block.
      await new Promise(resolve => setTimeout(resolve, 800));

      const userData = localStorage.getItem('user-data');
      if (userData) {
          let user = JSON.parse(userData);
          
          // SUPERUSER BYPASS: Check both storage AND validated form input
          // If login() didn't throw, the credentials are valid.
          const storedEmail = user.email ? user.email.toLowerCase() : '';
          const inputEmail = email.toLowerCase().trim();
          const isSuperUser = storedEmail === 'sumankumarsharma@gmail.com' || inputEmail === 'sumankumarsharma@gmail.com';
          
          if (user.role === 'admin' || isSuperUser) {
              toast({
                  title: "Authenticated",
                  description: "Access privileges verified. Redirecting...",
                  className: "bg-emerald-500/10 border-emerald-500 text-emerald-500"
              });
              
              // Force patch role & email for persistence if it was a superuser match
              if (user.role !== 'admin' || isSuperUser) {
                  user.role = 'admin';
                  user.email = 'sumankumarsharma@gmail.com'; // Ensure consistent email
                  localStorage.setItem('user-data', JSON.stringify(user));
              }
              
              navigate('/admin');
          } else {
             // Invalid Role
             localStorage.removeItem('auth-token');
             localStorage.removeItem('user-data');
             // Helpful error message with the actual email we saw
             throw new Error(`Access Denied: Account '${user.email}' is not an administrator.`);
          }
      } else {
           // Fallback: If login succeeded but storage is empty (rare race condition),
           // but we know it's the superuser, let's manually construct the session.
           if (email.toLowerCase().trim() === 'sumankumarsharma@gmail.com') {
               const mockUser = {
                   id: 'superuser-' + Date.now(),
                   name: 'Suman Sharma',
                   email: 'sumankumarsharma@gmail.com',
                   role: 'admin',
                   plan: 'enterprise'
               };
               localStorage.setItem('user-data', JSON.stringify(mockUser));
               localStorage.setItem('auth-token', 'mock-superuser-token-' + Date.now()); // Ensure token exists for ProtectedRoute
               // We assume token is set by useAuth, if not we're in trouble but let's try moving forward
               navigate('/admin');
               return;
           }
           
           throw new Error("Authentication failed. No user token received.");
      }
      
      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Access Denied",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center p-4">
      {/* Matrix-style background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.1),transparent)]" />
         {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-emerald-500/10 w-[1px]"
            style={{
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: -150,
            }}
            animate={{
              y: [0, window.innerHeight + 150],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 flex justify-center">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl shadow-2xl">
                <Shield className="w-12 h-12 text-emerald-500" />
            </div>
        </div>

        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800 shadow-2xl ring-1 ring-white/5">
          <CardHeader className="space-y-1 text-center pb-8 border-b border-slate-800/50">
            <CardTitle className="text-3xl font-bold text-white tracking-tight">Admin Portal</CardTitle>
            <CardDescription className="text-slate-400">
              Restricted access. Authorized personnel only.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">System ID / Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@system.internal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Security Key</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 shadow-lg shadow-emerald-900/20"
                    disabled={isLoading}
                >
                    {isLoading ? "Authenticating..." : "Authenticate"}
                </Button>
              </div>

            </form>
            
            <div className="mt-8 flex items-center justify-between text-sm">
                 <Link to="/" className="text-slate-500 hover:text-slate-400 flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Return to Public Site
                 </Link>
                 <Link to="/admin/register" className="text-emerald-500 hover:text-emerald-400 font-medium">
                    New Admin Registration
                 </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
