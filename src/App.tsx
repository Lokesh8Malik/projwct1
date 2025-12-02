import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import StudentDashboard from "./pages/student/Dashboard";
import StudentInternships from "./pages/student/Internships";
import AlumniDashboard from "./pages/alumni/Dashboard";
import AlumniPosts from "./pages/alumni/Posts";
import AdminDashboard from "./pages/admin/Dashboard";
import Notifications from "./pages/Notifications";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Shared Routes */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            
            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/internships"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentInternships />
                </ProtectedRoute>
              }
            />
            
            {/* Alumni Routes */}
            <Route
              path="/alumni/dashboard"
              element={
                <ProtectedRoute allowedRoles={['alumni']}>
                  <AlumniDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/posts"
              element={
                <ProtectedRoute allowedRoles={['alumni']}>
                  <AlumniPosts />
                </ProtectedRoute>
              }
            />
            
            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
