import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useGuest } from "@/hooks/use-guest";
import { GuestUpgradeModal } from "@/components/guest-upgrade-modal";
import { motion } from "framer-motion";

interface Question {
  id: number;
  text: string;
  options: string[];
}

interface GuestAssessmentData {
  id: number;
  title: string;
  description: string;
  category: string;
  questions: Question[];
}

export default function GuestAssessmentPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { saveAssessment } = useGuest();

  const [data, setData] = useState<GuestAssessmentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    fetch(`/api/assessments/${id}/public`)
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          if (r.status === 403) {
            setError("premium");
          } else {
            setError(body.error || "Failed to load assessment");
          }
          return;
        }
        const json = await r.json();
        setData(json);
      })
      .catch(() => setError("Could not load assessment. Please try again."))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleNext = () => {
    if (!data) return;
    const currentQ = data.questions[currentIdx];
    if (answers[currentQ.id] === undefined) {
      toast({ title: "Please select an answer", variant: "destructive" });
      return;
    }
    if (currentIdx === data.questions.length - 1) {
      const score = Object.keys(answers).length;
      const total = data.questions.length;
      saveAssessment({
        assessmentId: data.id,
        title: data.title,
        score,
        totalQuestions: total,
        completedAt: new Date().toISOString(),
      });
      setResult({ score, total });
      setShowUpgrade(true);
    } else {
      setCurrentIdx((p) => p + 1);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading assessment...</div>;

  if (error === "premium") {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-md">
        <div className="glass-card p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-4">Premium Assessment</h2>
          <p className="text-muted-foreground mb-6">This assessment requires a MindMap account. Create a free account to access it.</p>
          <a href="/mindmap/register">
            <Button className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 w-full">Create Free Account</Button>
          </a>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-8 text-center text-muted-foreground">{error}</div>;
  if (!data) return null;

  if (!isStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-24 text-center max-w-xl"
      >
        <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent mb-4 inline-block">{data.category}</span>
        <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
        <p className="text-muted-foreground mb-8">{data.description}</p>
        <div className="glass-card p-6 rounded-2xl mb-8 flex justify-around">
          <div>
            <p className="text-sm text-muted-foreground">Questions</p>
            <p className="text-2xl font-bold">{data.questions.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mode</p>
            <p className="text-2xl font-bold">Guest</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Results are saved locally.{" "}
          <a href="/mindmap/register" className="text-accent underline">Create an account</a> to save permanently.
        </p>
        <Button size="lg" className="w-full rounded-full" onClick={() => setIsStarted(true)}>
          Start Assessment
        </Button>
      </motion.div>
    );
  }

  const currentQ = data.questions[currentIdx];
  const isLast = currentIdx === data.questions.length - 1;
  const progress = ((currentIdx + 1) / data.questions.length) * 100;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <GuestUpgradeModal
        isOpen={showUpgrade}
        onClose={() => { setShowUpgrade(false); setLocation("/mindmap/dashboard"); }}
        trigger="save-progress"
        guestScore={result?.score}
      />

      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>{data.title}</span>
          <span>Question {currentIdx + 1} of {data.questions.length}</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="glass-card p-8 rounded-2xl">
        <h2 className="text-xl font-medium mb-6">{currentQ.text}</h2>
        <RadioGroup
          value={answers[currentQ.id]?.toString()}
          onValueChange={(val) => setAnswers((prev) => ({ ...prev, [currentQ.id]: Number(val) }))}
          className="space-y-4"
        >
          {currentQ.options.map((opt, idx) => (
            <div key={idx} className="flex items-center space-x-3 p-4 rounded-xl border border-white/10 bg-black/20 hover:bg-black/40 transition-colors cursor-pointer">
              <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} />
              <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer">{opt}</Label>
            </div>
          ))}
        </RadioGroup>
        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))} disabled={currentIdx === 0}>
            Previous
          </Button>
          <Button onClick={handleNext}>
            {isLast ? "Finish Assessment" : "Next Question"}
          </Button>
        </div>
      </div>
    </div>
  );
}
