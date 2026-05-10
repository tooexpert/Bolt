import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth-context";
import { Navbar } from "./components/navbar";
import { HeroSection } from "./components/hero-section";
import { AboutSection } from "./components/about-section";
import { DiscordSection } from "./components/discord-section";
import { JoinSection } from "./components/join-section";
import { Footer } from "./components/footer";
import { LoginPage } from "./pages/login";
import { AccessDeniedPage } from "./pages/access-denied";
import { AuthErrorPage } from "./pages/auth-error";
import { AuthCallbackPage } from "./pages/auth-callback";
import { ClanLayout } from "./components/clan/clan-layout";
import { ClanDashboard } from "./pages/clan/dashboard";
import { MembersPage } from "./pages/clan/members";
import { QuotesPage } from "./pages/clan/quotes";
import { MapsPage } from "./pages/clan/maps";
import { CSSPage } from "./pages/clan/css";
import { ApplicationsPage } from "./pages/clan/applications";

function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <DiscordSection />
      <JoinSection />
      <Footer />
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="/auth-error" element={<AuthErrorPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/clan" element={<ClanLayout />}>
            <Route index element={<ClanDashboard />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="quotes" element={<QuotesPage />} />
            <Route path="maps" element={<MapsPage />} />
            <Route path="css" element={<CSSPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
