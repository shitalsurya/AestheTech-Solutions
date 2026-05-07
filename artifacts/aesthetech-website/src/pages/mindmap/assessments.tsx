import { useState } from "react";
import { useListAssessments, getListAssessmentsQueryKey, useStartAssessment } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { GuestUpgradeModal } from "@/components/guest-upgrade-modal";
import { Lock } from "lucide-react";

export default function MindMapAssessments() {
  const { data: rawAssessments, isLoading, isError } = useListAssessments({
    query: { queryKey: getListAssessmentsQueryKey() },
  });

  // Guard: only use the data if it's actually an array (prevents crashes if
  // the API is unreachable and a non-array value ends up in the cache)
  const assessments = Array.isArray(rawAssessments) ? rawAssessments : undefined;

  const { user } = useAuth();
  const startAssessment = useStartAssessment();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  const handleStart = (id: number, isPremium: boolean) => {
    if (!user) {
      if (isPremium) {
        setModalOpen(true);
        return;
      }
      setLocation(`/mindmap/assessments/try/${id}`);
      return;
    }
    startAssessment.mutate(
      { data: { assessmentId: id } },
      {
        onSuccess: (session) => setLocation(`/mindmap/assessments/${session.id}`),
        onError: () => toast({ title: "Failed to start", variant: "destructive" }),
      }
    );
  };

  if (isLoading) return <div className="p-8 text-center">Loading assessments...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <GuestUpgradeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} trigger="premium" />

      {!user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 glass-card p-4 rounded-2xl border border-accent/30 bg-accent/5 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <p className="font-medium">You are exploring as a guest</p>
            <p className="text-sm text-muted-foreground">Create a free account to save your results and track progress.</p>
          </div>
          <Link href="/mindmap/register">
            <Button size="sm" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 whitespace-nowrap flex-shrink-0">
              Create Free Account
            </Button>
          </Link>
        </motion.div>
      )}

      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold mb-4">Career Assessments</h1>
        <p className="text-muted-foreground text-lg">Evaluate your skills and discover your ideal career path.</p>
      </div>

      {isError || (!isLoading && !assessments) ? (
        <div className="glass-card p-12 rounded-2xl text-center text-muted-foreground">
          <p className="text-lg font-medium mb-2">Could not load assessments</p>
          <p className="text-sm">Please try refreshing the page. If the problem persists, the server may be temporarily unavailable.</p>
        </div>
      ) : assessments && assessments.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center text-muted-foreground">
          <p className="text-lg font-medium mb-2">No assessments available yet</p>
          <p className="text-sm">Check back soon — assessments are being added regularly.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments?.map((assessment, i) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-2xl flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-medium px-2 py-1 bg-primary/20 text-primary rounded-full">
                  {assessment.category}
                </span>
                {assessment.isPremium && (
                  <span className="text-xs font-medium px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center gap-1">
                    {!user && <Lock className="w-3 h-3" />}
                    Premium
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{assessment.title}</h3>
              <p className="text-muted-foreground text-sm mb-6 flex-1">{assessment.description}</p>

              <div className="flex justify-between text-sm text-muted-foreground mb-6">
                <span>{assessment.questionCount} Questions</span>
                <span>~{assessment.estimatedMinutes} mins</span>
              </div>

              <Button
                className="w-full rounded-full"
                onClick={() => handleStart(assessment.id, assessment.isPremium)}
                disabled={startAssessment.isPending}
              >
                {assessment.isPremium && !user ? (
                  <><Lock className="w-4 h-4 mr-2" />Unlock Premium</>
                ) : (
                  "Start Assessment"
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
