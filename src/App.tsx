import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { stopSpeaking } from "@/components/AudioToggle";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AudioToggle } from "@/components/AudioToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { VLibrasWidget } from "@/components/VLibrasWidget";
import { OfflineBanner } from "@/components/OfflineBanner";
import { InstallPrompt } from "@/components/InstallPrompt";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Consent from "./pages/Consent";
import UserDataPage from "./pages/UserDataPage";
import Questionnaire from "./pages/Questionnaire";
import ImageUpload from "./pages/ImageUpload";
import Result from "./pages/Result";
import Education from "./pages/Education";
import History from "./pages/History";
import HistoryDetail from "./pages/HistoryDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';
  
  // Track initial load (React strict mode may trigger twice, use a simple variable)
  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // If the app is reloaded (F5) and it's not the landing page, redirect to landing
      // This is a requirement to reset the flow on refresh. Let's redirect if it's not /app either.
      if (location.pathname !== '/' && location.pathname !== '/app') {
        navigate('/', { replace: true });
      }
    }
  }, [location.pathname, navigate]);

  React.useEffect(() => {
    // Stop audio whenever the route changes
    stopSpeaking();
  }, [location.pathname]);

  return (
    <>
      <OfflineBanner />
      <DarkModeToggle />
      <AudioToggle />
      <LanguageSelector />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<Home />} />
          <Route path="/consentimento" element={<Consent />} />
          <Route path="/dados" element={<UserDataPage />} />
          <Route path="/questionario" element={<Questionnaire />} />
          <Route path="/imagem" element={<ImageUpload />} />
          <Route path="/resultado" element={<Result />} />
          <Route path="/educacao" element={<Education />} />
          <Route path="/historico" element={<History />} />
          <Route path="/historico/:id" element={<HistoryDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <VLibrasWidget />
      <InstallPrompt />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
