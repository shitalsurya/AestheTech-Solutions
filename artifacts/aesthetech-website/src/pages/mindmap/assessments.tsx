import { useListAssessments, getListAssessmentsQueryKey, useStartAssessment } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function MindMapAssessments() {
  const { data: assessments, isLoading } = useListAssessments({
    query: { queryKey: getListAssessmentsQueryKey() }
  });
  
  const startAssessment = useStartAssessment();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleStart = (id: number) => {
    startAssessment.mutate({ data: { assessmentId: id } }, {
      onSuccess: (session) => {
        setLocation(`/mindmap/assessments/${session.id}`);
      },
      onError: () => {
        toast({ title: "Failed to start", variant: "destructive" });
      }
    });
  };

  if (isLoading) return <div className="p-8 text-center">Loading assessments...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold mb-4">Career Assessments</h1>
        <p className="text-muted-foreground text-lg">Evaluate your skills and discover your ideal career path.</p>
      </div>

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
                <span className="text-xs font-medium px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full">
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
              onClick={() => handleStart(assessment.id)}
              disabled={startAssessment.isPending}
            >
              Start Assessment
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}