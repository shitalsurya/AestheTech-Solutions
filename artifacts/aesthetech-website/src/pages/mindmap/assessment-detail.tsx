import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useGetAssessment, getGetAssessmentQueryKey, useSubmitAssessment } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function MindMapAssessmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: session, isLoading } = useGetAssessment(Number(id), {
    query: { enabled: !!id, queryKey: getGetAssessmentQueryKey(Number(id)) }
  });

  const submitAssessment = useSubmitAssessment();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  if (isLoading) return <div className="p-8 text-center">Loading assessment...</div>;
  if (!session) return <div className="p-8 text-center">Assessment not found</div>;

  if (session.status === "completed") {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Assessment Completed</h2>
        <p className="text-muted-foreground mb-8">You have already completed this assessment.</p>
        <Button onClick={() => setLocation("/mindmap/dashboard")}>Back to Dashboard</Button>
      </div>
    );
  }

  const currentQ = session.questions[currentQuestionIdx];
  const isLast = currentQuestionIdx === session.questions.length - 1;

  const handleNext = () => {
    if (answers[currentQ.id] === undefined) {
      toast({ title: "Please select an answer", variant: "destructive" });
      return;
    }
    
    if (isLast) {
      const formattedAnswers = Object.entries(answers).map(([qId, ans]) => ({
        questionId: Number(qId),
        answer: ans
      }));
      
      submitAssessment.mutate(
        { id: session.id, data: { answers: formattedAnswers } },
        {
          onSuccess: (result: any) => {
            // Usually we'd redirect to a result page, but for now we'll just go to dashboard and toast
            toast({ title: "Assessment completed!", description: `Score: ${result.score}` });
            setLocation("/mindmap/dashboard");
          },
          onError: () => toast({ title: "Failed to submit", variant: "destructive" })
        }
      );
    } else {
      setCurrentQuestionIdx(prev => prev + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{session.assessmentTitle}</h1>
        <span className="text-muted-foreground">
          Question {currentQuestionIdx + 1} of {session.questions.length}
        </span>
      </div>

      <div className="glass-card p-8 rounded-2xl">
        <h2 className="text-xl font-medium mb-6">{currentQ.text}</h2>
        
        <RadioGroup 
          value={answers[currentQ.id]?.toString()} 
          onValueChange={(val) => setAnswers(prev => ({ ...prev, [currentQ.id]: Number(val) }))}
          className="space-y-4"
        >
          {currentQ.options.map((opt, idx) => (
            <div key={idx} className="flex items-center space-x-3 p-4 rounded-xl border border-white/10 bg-black/20 hover:bg-black/40 transition-colors">
              <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} />
              <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer">{opt}</Label>
            </div>
          ))}
        </RadioGroup>

        <div className="mt-8 flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIdx === 0}
          >
            Previous
          </Button>
          <Button onClick={handleNext} disabled={submitAssessment.isPending}>
            {submitAssessment.isPending ? "Submitting..." : isLast ? "Finish Assessment" : "Next Question"}
          </Button>
        </div>
      </div>
    </div>
  );
}