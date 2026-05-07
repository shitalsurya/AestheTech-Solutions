import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useGuest } from "@/hooks/use-guest";
import { useGetUserStats, getGetUserStatsQueryKey, useListMyAssessments, getListMyAssessmentsQueryKey, useGetMyChallengeAttempts, getGetMyChallengeAttemptsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { GuestUpgradeModal } from "@/components/guest-upgrade-modal";
import { Lock, Sparkles } from "lucide-react";

function GuestDashboard() {
  const { session, hasActivity, totalScore, passed } = useGuest();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTrigger, setModalTrigger] = useState<"save-progress" | "premium" | "history" | "certificate">("save-progress");

  const openModal = (trigger: typeof modalTrigger) => {
    setModalTrigger(trigger);
    setModalOpen(true);
  };

  const sampleStats = [
    { label: "Total Score", value: hasActivity ? totalScore : "142", accent: "accent" },
    { label: "Assessments", value: hasActivity ? session.assessments.length : "2", accent: "primary" },
    { label: "Challenges", value: hasActivity ? session.challenges.length : "3", accent: "accent" },
    { label: "Current Rank", value: "#—", accent: "primary" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <GuestUpgradeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        trigger={modalTrigger}
        guestScore={hasActivity ? totalScore : undefined}
        guestPassed={hasActivity ? passed : undefined}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-medium">Guest Preview</span>
          </div>
          <h1 className="text-3xl font-display font-bold">Your Career Dashboard</h1>
          <p className="text-muted-foreground">Create a free account to save your progress and unlock everything.</p>
        </div>
        <Button
          className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => openModal("save-progress")}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Save Progress
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {sampleStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card p-6 rounded-2xl border-t-${s.accent} relative`}
          >
            {s.label === "Current Rank" && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center cursor-pointer z-10"
                onClick={() => openModal("history")}>
                <Lock className="w-5 h-5 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground font-medium">Create account</span>
              </div>
            )}
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{s.label}</h3>
            <p className="text-4xl font-bold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Assessments</h2>
            <Link href="/mindmap/assessments"><Button variant="link">View All</Button></Link>
          </div>
          {session.assessments.length > 0 ? (
            <div className="space-y-4">
              {session.assessments.slice(0, 5).map((a, i) => (
                <div key={i} className="glass-card p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-medium">{a.title}</p>
                    <p className="text-sm text-muted-foreground">{new Date(a.completedAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                    {a.score}/{a.totalQuestions}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 rounded-xl text-center text-muted-foreground">
              <p className="mb-3">No assessments yet.</p>
              <Link href="/mindmap/assessments">
                <Button size="sm" className="rounded-full">Take Your First Assessment</Button>
              </Link>
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Challenges</h2>
            <Link href="/mindmap/challenges"><Button variant="link">View All</Button></Link>
          </div>
          {session.challenges.length > 0 ? (
            <div className="space-y-4">
              {session.challenges.slice(0, 5).map((c, i) => (
                <div key={i} className="glass-card p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-medium">{c.title}</p>
                    <p className="text-sm text-muted-foreground">Score: {c.score}/{c.totalQuestions}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${c.isPassed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {c.isPassed ? "Passed" : "Failed"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 rounded-xl text-center text-muted-foreground">
              <p className="mb-3">No challenges attempted yet.</p>
              <Link href="/mindmap/challenges">
                <Button size="sm" variant="outline" className="rounded-full">Try a Challenge</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl border border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Unlock Full Career Roadmap</h3>
            <p className="text-muted-foreground max-w-md">Get a personalised career plan, skill gap analysis, and track your growth over time.</p>
          </div>
          <Button
            size="lg"
            className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 whitespace-nowrap flex-shrink-0"
            onClick={() => openModal("premium")}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Create Free Account
          </Button>
        </div>
      </div>
    </div>
  );
}

function AuthDashboard() {
  const { user, logout } = useAuth();
  const { data: stats, isLoading: statsLoading } = useGetUserStats({ query: { queryKey: getGetUserStatsQueryKey() } });
  const { data: assessments, isLoading: assessmentsLoading } = useListMyAssessments({ query: { queryKey: getListMyAssessmentsQueryKey() } });
  const { data: attempts, isLoading: attemptsLoading } = useGetMyChallengeAttempts({ query: { queryKey: getGetMyChallengeAttemptsQueryKey() } });

  if (statsLoading || assessmentsLoading || attemptsLoading) {
    return <div className="p-8 container mx-auto text-center">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">Here is an overview of your career progress.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/mindmap/profile"><Button variant="outline">Profile</Button></Link>
          <Button variant="ghost" onClick={logout}>Logout</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Total Score", value: stats?.totalScore || 0, accent: "accent" },
          { label: "Assessments", value: stats?.assessmentsCompleted || 0, accent: "primary" },
          { label: "Challenges", value: stats?.challengesAttempted || 0, accent: "accent" },
          { label: "Current Rank", value: stats?.rank ? `#${stats.rank}` : "—", accent: "primary" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`glass-card p-6 rounded-2xl border-t-${s.accent}`}>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{s.label}</h3>
            <p className="text-4xl font-bold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Assessments</h2>
            <Link href="/mindmap/assessments"><Button variant="link">View All</Button></Link>
          </div>
          <div className="space-y-4">
            {assessments && assessments.length > 0 ? assessments.slice(0, 5).map((a: any) => (
              <div key={a.id} className="glass-card p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-medium">{a.assessmentTitle}</p>
                  <p className="text-sm text-muted-foreground">{new Date(a.startedAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${a.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                  {a.status}
                </span>
              </div>
            )) : (
              <div className="glass-card p-8 rounded-xl text-center text-muted-foreground">No assessments taken yet.</div>
            )}
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Challenges</h2>
            <Link href="/mindmap/challenges"><Button variant="link">View All</Button></Link>
          </div>
          <div className="space-y-4">
            {attempts && attempts.length > 0 ? attempts.slice(0, 5).map((a: any) => (
              <div key={a.id} className="glass-card p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-medium">{a.challengeTitle}</p>
                  <p className="text-sm text-muted-foreground">Score: {a.score}/{a.totalQuestions}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${a.isPassed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  {a.isPassed ? "Passed" : "Failed"}
                </span>
              </div>
            )) : (
              <div className="glass-card p-8 rounded-xl text-center text-muted-foreground">No challenges attempted yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MindMapDashboard() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="p-8 container mx-auto text-center">Loading...</div>;
  return user ? <AuthDashboard /> : <GuestDashboard />;
}
