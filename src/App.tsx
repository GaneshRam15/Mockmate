
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { InterviewProvider } from "@/contexts/InterviewContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AuthGuard from "@/components/AuthGuard";

import Home from "./pages/Home";
import Login from "./pages/Login";
import UserHome from "./pages/UserHome";
import Interview from "./pages/Interview";
import PracticeHome from "./pages/PracticeHome";
import PracticeDashboard from "./pages/PracticeDashboard";
import PracticeInterview from "./pages/PracticeInterview";
import AptitudePractice from "./pages/AptitudePractice";
import CodingPractice from "./pages/CodingPractice";
import PracticeHistory from "./pages/PracticeHistory";
import BotInterview from "./pages/BotInterview";
import Summary from "./pages/Summary";
import InterviewThankYou from "./pages/InterviewThankYou";
import History from "./pages/History";
import AdminDashboard from "./pages/AdminDashboard";
import APITest from "./pages/APITest";
import OpenAITest from "./pages/OpenAITest";
import NotFound from "./pages/NotFound";
import Round1Aptitude from "./pages/Round1Aptitude";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <InterviewProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <AuthGuard>
                    <UserHome />
                  </AuthGuard>
                } 
              />
              
              {/* Test Interview (Monitored) */}
              <Route 
                path="/interview" 
                element={
                  <AuthGuard>
                    <Interview />
                  </AuthGuard>
                } 
              />
              
              {/* Round 1 - Aptitude Test (Formal Interview) */}
              <Route 
                path="/round1-aptitude" 
                element={
                  <AuthGuard>
                    <Round1Aptitude />
                  </AuthGuard>
                } 
              />
              
              {/* Practice Mode (No Monitoring) */}
              <Route 
                path="/practice" 
                element={
                  <AuthGuard>
                    <PracticeHome />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/practice-dashboard" 
                element={
                  <AuthGuard>
                    <PracticeDashboard />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/practice-interview" 
                element={
                  <AuthGuard>
                    <PracticeInterview />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/practice-aptitude" 
                element={
                  <AuthGuard>
                    <AptitudePractice />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/practice-coding" 
                element={
                  <AuthGuard>
                    <CodingPractice />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/practice-history" 
                element={
                  <AuthGuard>
                    <PracticeHistory />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/bot-interview" 
                element={
                  <AuthGuard>
                    <BotInterview />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/summary" 
                element={
                  <AuthGuard>
                    <Summary />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/interview-thank-you" 
                element={
                  <AuthGuard>
                    <InterviewThankYou />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/history" 
                element={
                  <AuthGuard>
                    <History />
                  </AuthGuard>
                } 
              />
              
              {/* Admin routes */}
              <Route 
                path="/admin" 
                element={
                  <AuthGuard requireAdmin={true}>
                    <AdminDashboard />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/api-test" 
                element={
                  <AuthGuard requireAdmin={true}>
                    <APITest />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/openai-test" 
                element={
                  <AuthGuard requireAdmin={true}>
                    <OpenAITest />
                  </AuthGuard>
                } 
              />
              
              {/* Fallbacks */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </InterviewProvider>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
