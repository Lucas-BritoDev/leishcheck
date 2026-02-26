import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioToggle } from "@/components/AudioToggle";
import Home from "./pages/Home";
import Consent from "./pages/Consent";
import UserDataPage from "./pages/UserDataPage";
import Questionnaire from "./pages/Questionnaire";
import ImageUpload from "./pages/ImageUpload";
import Result from "./pages/Result";
import Education from "./pages/Education";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AudioToggle />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/consentimento" element={<Consent />} />
          <Route path="/dados" element={<UserDataPage />} />
          <Route path="/questionario" element={<Questionnaire />} />
          <Route path="/imagem" element={<ImageUpload />} />
          <Route path="/resultado" element={<Result />} />
          <Route path="/educacao" element={<Education />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
