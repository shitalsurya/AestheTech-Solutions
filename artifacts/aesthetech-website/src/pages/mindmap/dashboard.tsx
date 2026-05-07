import { useAuth } from "@/hooks/use-auth";
import { useGetUserStats, getGetUserStatsQueryKey, useListMyAssessments, getListMyAssessmentsQueryKey, useGetMyChallengeAttempts, getGetMyChallengeAttemptsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function MindMapDashboard() {
  const { user, logout } = useAuth();
  
  const { data: stats, isLoading: statsLoading } = useGetUserStats({
    query: { queryKey: getGetUserStatsQueryKey() }
  });

  const { data: assessments, isLoading: assessmentsLoading } = useListMyAssessments({
    query: { queryKey: getListMyAssessmentsQueryKey() }
  });

  const { data: attempts, isLoading: attemptsLoading } = useGetMyChallengeAttempts({
    query: { queryKey: getGetMyChallengeAttemptsQueryKey() }
  });

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
          <Link href="/mindmap/profile">
            <Button variant="outline">Profile</Button>
          </Link>
          <Button variant="ghost" onClick={logout}>Logout</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl border-t-accent">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Score</h3>
          <p className="text-4xl font-bold">{stats?.totalScore || 0}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-2xl border-t-primary">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Assessments</h3>
          <p className="text-4xl font-bold">{stats?.assessmentsCompleted || 0}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-2xl border-t-accent">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Challenges</h3>
          <p className="text-4xl font-bold">{stats?.challengesAttempted || 0}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 rounded-2xl border-t-primary">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Rank</h3>
          <p className="text-4xl font-bold">{stats?.rank ? `#${stats.rank}` : '-'}</p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Assessments</h2>
            <Link href="/mindmap/assessments">
              <Button variant="link">View All</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {assessments && assessments.length > 0 ? (
              assessments.slice(0, 5).map((a: any) => (
                <div key={a.id} className="glass-card p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-medium">{a.assessmentTitle}</p>
                    <p className="text-sm text-muted-foreground">{new Date(a.startedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${a.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {a.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card p-8 rounded-xl text-center text-muted-foreground">
                No assessments taken yet.
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Challenges</h2>
            <Link href="/mindmap/challenges">
              <Button variant="link">View All</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {attempts && attempts.length > 0 ? (
              attempts.slice(0, 5).map((a: any) => (
                <div key={a.id} className="glass-card p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-medium">{a.challengeTitle}</p>
                    <p className="text-sm text-muted-foreground">Score: {a.score}/{a.totalQuestions}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${a.isPassed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {a.isPassed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card p-8 rounded-xl text-center text-muted-foreground">
                No challenges attempted yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}