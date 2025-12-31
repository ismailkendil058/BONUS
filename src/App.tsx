import { useEffect } from "react";
import { useStore } from "./store/useStore";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WorkerLogin from "./pages/WorkerLogin";
import WorkerHome from "./pages/WorkerHome";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRankings from "./pages/AdminRankings";
import AdminWorkers from "./pages/AdminWorkers";
import AdminProducts from "./pages/AdminProducts";
import AdminStats from "./pages/AdminStats";
import AdminWorkerDetails from "./pages/AdminWorkerDetails";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    useStore.getState().initialize();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/worker/login" element={<WorkerLogin />} />
            <Route path="/worker/home" element={<WorkerHome />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/rankings" element={<AdminRankings />} />
            <Route path="/admin/workers" element={<AdminWorkers />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/stats" element={<AdminStats />} />
            <Route path="/admin/worker/:workerId" element={<AdminWorkerDetails />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
