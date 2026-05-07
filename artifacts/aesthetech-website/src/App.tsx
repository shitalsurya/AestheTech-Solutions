import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";

// Pages
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Apps from "@/pages/apps";
import Contact from "@/pages/contact";

import MindMapHome from "@/pages/mindmap/home";
import MindMapLogin from "@/pages/mindmap/login";
import MindMapRegister from "@/pages/mindmap/register";
import MindMapDashboard from "@/pages/mindmap/dashboard";
import MindMapAssessments from "@/pages/mindmap/assessments";
import MindMapAssessmentDetail from "@/pages/mindmap/assessment-detail";
import MindMapChallenges from "@/pages/mindmap/challenges";
import MindMapChallengeDetail from "@/pages/mindmap/challenge-detail";
import MindMapPricing from "@/pages/mindmap/pricing";
import MindMapAdmin from "@/pages/mindmap/admin";
import MindMapProfile from "@/pages/mindmap/profile";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        {/* Main Website */}
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/apps" component={Apps} />
        <Route path="/contact" component={Contact} />

        {/* MindMap Public */}
        <Route path="/mindmap" component={MindMapHome} />
        <Route path="/mindmap/login" component={MindMapLogin} />
        <Route path="/mindmap/register" component={MindMapRegister} />
        <Route path="/mindmap/pricing" component={MindMapPricing} />

        {/* MindMap Protected */}
        <Route path="/mindmap/dashboard">
          {() => <ProtectedRoute><MindMapDashboard /></ProtectedRoute>}
        </Route>
        <Route path="/mindmap/assessments">
          {() => <ProtectedRoute><MindMapAssessments /></ProtectedRoute>}
        </Route>
        <Route path="/mindmap/assessments/:id">
          {() => <ProtectedRoute><MindMapAssessmentDetail /></ProtectedRoute>}
        </Route>
        <Route path="/mindmap/challenges">
          {() => <ProtectedRoute><MindMapChallenges /></ProtectedRoute>}
        </Route>
        <Route path="/mindmap/challenges/:id">
          {() => <ProtectedRoute><MindMapChallengeDetail /></ProtectedRoute>}
        </Route>
        <Route path="/mindmap/profile">
          {() => <ProtectedRoute><MindMapProfile /></ProtectedRoute>}
        </Route>
        <Route path="/mindmap/admin">
          {() => <ProtectedRoute adminOnly><MindMapAdmin /></ProtectedRoute>}
        </Route>

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;