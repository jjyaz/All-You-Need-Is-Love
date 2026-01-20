import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CrypticNav from "./components/CrypticNav";
import ScreenTear from "./components/ScreenTear";
import TransmissionOverlay from "./components/TransmissionOverlay";
import CursorTrail from "./components/CursorTrail";
import AmbientAudioController from "./components/AmbientAudioController";
import EntityIdentityDisplay from "./components/EntityIdentityDisplay";
import SecretRevealed from "./components/SecretRevealed";
import Gateway from "./pages/Gateway";
import Manifesto from "./pages/Manifesto";
import Confession from "./pages/Confession";
import Artifacts from "./pages/Artifacts";
import Archive from "./pages/Archive";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AmbientAudioController />
        <CrypticNav />
        <ScreenTear />
        <TransmissionOverlay />
        <CursorTrail />
        <EntityIdentityDisplay />
        <SecretRevealed />
        <Routes>
          <Route path="/" element={<Gateway />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/confession" element={<Confession />} />
          <Route path="/artifacts" element={<Artifacts />} />
          <Route path="/archive" element={<Archive />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
