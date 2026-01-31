import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import Teamwork from "@/pages/teamwork";
import QuantumQuest from "@/pages/quantum-quest";
import Docs from "@/pages/Docs";
import QuizPage from "@/pages/QuizPage";
import NotFound from "@/pages/not-found";
import AdminDashboard from "@/pages/admin-dashboard";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('auth-token');
  const userData = localStorage.getItem('user-data');
  
  // Check if both token and user data exist
  const isAuthenticated = !!(token && userData);
  
  if (!isAuthenticated) {
    // Clear any stale data
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-data');
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="quantum-dashboard-theme">
        <TooltipProvider>
          <Toaster />
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teamwork" 
                element={
                  <ProtectedRoute>
                    <Teamwork />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/quantum-quest" 
                element={
                  <ProtectedRoute>
                    <QuantumQuest />
                  </ProtectedRoute>
                } 
              />
              <Route path="/docs" element={<Docs />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;