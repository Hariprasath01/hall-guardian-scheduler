import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { Layout } from "@/components/Layout";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import Invigilators from "./pages/admin/Invigilators";
import Venues from "./pages/admin/Venues";
import AllocationPage from "./pages/admin/Allocation";
import InvigilatorDashboard from "./pages/invigilator/Dashboard";
import Availability from "./pages/invigilator/Availability";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin/*" element={<Layout userRole="admin" />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="invigilators" element={<Invigilators />} />
              <Route path="venues" element={<Venues />} />
              <Route path="allocation" element={<AllocationPage />} />
            </Route>
            
            {/* Invigilator Routes */}
            <Route path="/invigilator/*" element={<Layout userRole="invigilator" />}>
              <Route path="dashboard" element={<InvigilatorDashboard />} />
              <Route path="availability" element={<Availability />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
