import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useGetChallenge, getGetChallengeQueryKey, useSubmitChallengeAttempt } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function MindMapChallengeDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: challenge, isLoading } = useGetChallenge(Number(id), {
    query: { enabled: !!id, queryKey: getGetChallengeQueryKey(Number(id)) }
  });

  const submitAttempt = useSubmitChallengeAttempt();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    if (!challenge || !isStarted) return;

    setTimeLeft(challenge.timeLimit * 60);
    setStartTime(Date.now());

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [challenge, isStarted]);

  const handleAutoSubmit = () => {
    toast({ title: "Time's up!", description: "Submitting your answers..." });
    submitFinal();
  };

  const submitFinal = () => {
    if (!challenge) return;
    
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const formattedAnswers = Object.entries(answers).map(([qId, ans]) => ({
      questionId: Number(qId),
      answer: ans
    }));
    
    submitAttempt.mutate(
      { id: Number(id), data: { answers: formattedAnswers, timeTaken } },
      {
        onSuccess: (result: any) => {
          toast({ 
            title: result.isPassed ? "Challenge Passed!" : "Challenge Failed", 
            description: `Score: ${result.score}/${result.totalQuestions}`,
            variant: result.isPassed ? "default" : "destructive"
          });
          setLocation("/mindmap/challenges");
        },
        onError: () => toast({ title: "Failed to submit", variant: "destructive" })
      }
    );
  };

  const handleNext = () => {
    if (!challenge) return;
    
    const currentQ = challenge.questions[currentQuestionIdx];
    if (answers[currentQ.id] === undefined) {
      toast({ title: "Please select an answer", variant: "destructive" });
      return;
    }
    
    if (currentQuestionIdx === challenge.questions.length - 1) {
      submitFinal();
    } else {
      setCurrentQuestionIdx(prev => prev + 1);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading challenge...</div>;
  if (!challenge) return <div className="p-8 text-center">Challenge not found</div>;

  if (!isStarted) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-xl">
        <h1 className="text-4xl font-bold mb-4">{challenge.title}</h1>
        <p className="text-muted-foreground mb-8">{challenge.description}</p>
        <div className="glass-card p-6 rounded-2xl mb-8 flex justify-around">
          <div>
            <p className="text-sm text-muted-foreground">Questions</p>
            <p className="text-2xl font-bold">{challenge.questions.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Time Limit</p>
            <p className="text-2xl font-bold">{challenge.timeLimit} mins</p>
          </div>
        </div>
        <Button size="lg" className="w-full" onClick={() => setIsStarted(true)}>Start Challenge</Button>
      </div>
    );
  }

  const currentQ = challenge.questions[currentQuestionIdx];
  const isLast = currentQuestionIdx === challenge.questions.length - 1;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex justify-between items-center mb-8 bg-background/80 backdrop-blur-md p-4 rounded-xl sticky top-20 z-10 border border-white/10">
        <div>
          <h1 className="font-bold">{challenge.title}</h1>
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIdx + 1} of {challenge.questions.length}
          </span>
        </div>
        <div className="text-xl font-mono font-bold text-accent">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
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
          <Button onClick={handleNext} disabled={submitAttempt.isPending}>
            {submitAttempt.isPending ? "Submitting..." : isLast ? "Finish Challenge" : "Next Question"}
          </Button>
        </div>
      </div>
    </div>
  );
}