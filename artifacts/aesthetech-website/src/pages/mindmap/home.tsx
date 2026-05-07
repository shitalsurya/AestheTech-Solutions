import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Brain, Target, Trophy } from "lucide-react";

export default function MindMapHome() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden flex flex-col items-center text-center px-4 border-b border-white/5">
        <div className="absolute inset-0 -z-10 bg-[url('/src/assets/images/hero-mindmap.png')] bg-cover bg-center opacity-40 mix-blend-screen" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/50 to-background" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-block rounded-full px-3 py-1 mb-6 border border-accent/30 bg-accent/10 text-accent text-sm font-medium backdrop-blur-sm">
            MindMap Career Compass
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 leading-tight">
            Navigate Your Future <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">With Clarity</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed">
            AI-driven career assessments, personalized roadmaps, and interview challenges designed to help you land your dream role.
          </p>
          <p className="text-sm text-muted-foreground/70 mb-10">
            No sign-up needed to start — explore free, save when you're ready.
          </p>
          <div className="flex items-center justify-center gap-4 flex-col sm:flex-row">
            <Link href="/mindmap/assessments">
              <Button size="lg" className="rounded-full w-full sm:w-auto text-lg h-14 px-8 bg-accent text-accent-foreground hover:bg-accent/90 group">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/mindmap/challenges">
              <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto text-lg h-14 px-8 border-white/20 hover:bg-white/5">
                Try a Challenge
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Your journey in 3 steps</h2>
            <p className="text-lg text-muted-foreground">Start in seconds. No registration required.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: <Brain className="w-8 h-8 text-accent" />, step: "01", title: "Take an Assessment", desc: "Answer career aptitude questions at your own pace. No time pressure to start." },
              { icon: <Target className="w-8 h-8 text-primary" />, step: "02", title: "Try Interview Challenges", desc: "Test your knowledge with real-world MCQ challenges. See your instant score." },
              { icon: <Trophy className="w-8 h-8 text-yellow-400" />, step: "03", title: "Save & Track Growth", desc: "Create a free account to save progress, get recommendations, and join the leaderboard." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-8 rounded-2xl border-t border-t-white/10 hover:border-t-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-3xl font-bold text-muted-foreground/30">{item.step}</span>
                </div>
                <h4 className="font-bold text-xl mb-3">{item.title}</h4>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Everything you need to succeed</h2>
          <p className="text-lg text-muted-foreground">A comprehensive suite of tools to prepare you for any career.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Career Assessments", desc: "Take comprehensive quizzes to identify your strengths and ideal career paths. Results available instantly.", badge: "Free" },
            { title: "Interview Challenges", desc: "Practice under pressure with timed MCQ challenges tailored by difficulty level.", badge: "Free" },
            { title: "Global Leaderboard", desc: "Compete with peers and see where you stand in the MindMap community.", badge: "Sign-up" },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-2xl border-t border-t-white/10 hover:border-t-accent/50 transition-colors"
            >
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent/20 text-accent mb-4 inline-block">{f.badge}</span>
              <h4 className="font-bold text-xl mb-3">{f.title}</h4>
              <p className="text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black/20 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-display font-bold mb-6">Ready to map your mind?</h2>
            <p className="text-muted-foreground text-lg mb-10">Start your first assessment right now. No sign-up, no credit card.</p>
            <div className="flex gap-4 justify-center flex-col sm:flex-row">
              <Link href="/mindmap/assessments">
                <Button size="lg" className="rounded-full text-lg h-14 px-10 bg-accent text-accent-foreground hover:bg-accent/90">
                  Take Free Assessment
                </Button>
              </Link>
              <Link href="/mindmap/pricing">
                <Button size="lg" variant="outline" className="rounded-full text-lg h-14 px-10 border-white/20">
                  View Pricing Plans
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
