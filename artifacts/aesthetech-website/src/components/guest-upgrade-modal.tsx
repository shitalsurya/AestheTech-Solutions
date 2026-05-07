import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { X, Trophy, TrendingUp, Download, BarChart3 } from "lucide-react";

interface GuestUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: "save-progress" | "premium" | "history" | "certificate";
  guestScore?: number;
  guestPassed?: number;
}

const CONTENT: Record<string, { icon: React.ReactNode; title: string; subtitle: string; benefits: string[] }> = {
  "save-progress": {
    icon: <TrendingUp className="w-8 h-8 text-accent" />,
    title: "Save Your Progress",
    subtitle: "You're doing great! Create a free account to keep your results.",
    benefits: [
      "Save all assessments & challenge scores",
      "Track your career growth over time",
      "Get personalised career recommendations",
      "Access your dashboard anywhere",
    ],
  },
  premium: {
    icon: <Trophy className="w-8 h-8 text-yellow-400" />,
    title: "Unlock Premium Features",
    subtitle: "Take your career prep to the next level.",
    benefits: [
      "Access all premium assessments",
      "Unlimited interview challenges",
      "Detailed skill gap analysis",
      "Priority career roadmap support",
    ],
  },
  history: {
    icon: <BarChart3 className="w-8 h-8 text-primary" />,
    title: "Track Your Interview Growth",
    subtitle: "See how far you've come with detailed analytics.",
    benefits: [
      "Full attempt history & score trends",
      "Weak area identification",
      "Compare with top performers",
      "Weekly progress reports",
    ],
  },
  certificate: {
    icon: <Download className="w-8 h-8 text-green-400" />,
    title: "Download Your Certificate",
    subtitle: "Share your achievement with employers.",
    benefits: [
      "Verifiable completion certificates",
      "Share on LinkedIn instantly",
      "Employer-recognised credentials",
      "Digital badge collection",
    ],
  },
};

export function GuestUpgradeModal({ isOpen, onClose, trigger = "save-progress", guestScore, guestPassed }: GuestUpgradeModalProps) {
  const content = CONTENT[trigger];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md bg-card border border-white/10 rounded-3xl p-8 shadow-2xl z-10 overflow-hidden"
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/10 via-transparent to-primary/10 pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                {content.icon}
              </div>
              <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
              <p className="text-muted-foreground text-sm">{content.subtitle}</p>
            </div>

            {(guestScore !== undefined || guestPassed !== undefined) && (
              <div className="flex gap-3 mb-6">
                {guestScore !== undefined && (
                  <div className="flex-1 bg-accent/10 rounded-2xl p-3 text-center border border-accent/20">
                    <p className="text-xs text-muted-foreground mb-1">Score Earned</p>
                    <p className="text-2xl font-bold text-accent">{guestScore}</p>
                  </div>
                )}
                {guestPassed !== undefined && (
                  <div className="flex-1 bg-primary/10 rounded-2xl p-3 text-center border border-primary/20">
                    <p className="text-xs text-muted-foreground mb-1">Challenges Passed</p>
                    <p className="text-2xl font-bold text-primary">{guestPassed}</p>
                  </div>
                )}
              </div>
            )}

            <ul className="space-y-2 mb-8">
              {content.benefits.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  </div>
                  {b}
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col gap-3">
              <Link href="/mindmap/register" onClick={onClose}>
                <Button className="w-full h-12 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 text-base font-semibold">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/mindmap/login" onClick={onClose}>
                <Button variant="ghost" className="w-full h-10 rounded-full text-sm text-muted-foreground hover:text-foreground">
                  Already have an account? Sign In
                </Button>
              </Link>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4">
              No credit card required · Free forever plan available
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
