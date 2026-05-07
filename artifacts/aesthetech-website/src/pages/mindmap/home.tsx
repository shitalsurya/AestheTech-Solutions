import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

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
            Navigate Your Future <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">With Clarity</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-driven career assessments, personalized roadmaps, and interview challenges designed to help you land your dream role.
          </p>
          <div className="flex items-center justify-center gap-4 flex-col sm:flex-row">
            <Link href="/mindmap/register">
              <Button size="lg" className="rounded-full w-full sm:w-auto text-lg h-14 px-8 bg-accent text-accent-foreground hover:bg-accent/90">
                Start Your Journey
              </Button>
            </Link>
            <Link href="/mindmap/login">
              <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto text-lg h-14 px-8 border-white/20 hover:bg-white/5">
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Overview */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Everything you need to succeed</h2>
            <p className="text-lg text-muted-foreground">A comprehensive suite of tools to evaluate your skills and prepare you for the industry.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Career Assessments", desc: "Take comprehensive quizzes to identify your strengths and ideal career paths." },
              { title: "Interview Challenges", desc: "Practice under pressure with timed MCQ challenges tailored by difficulty." },
              { title: "Global Leaderboard", desc: "Compete with peers and see where you stand in the MindMap community." }
            ].map((f, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl border-t border-t-white/10 hover:border-t-accent/50 transition-colors">
                <h4 className="font-bold text-xl mb-3">{f.title}</h4>
                <p className="text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-24 container mx-auto px-4 text-center">
        <h2 className="text-4xl font-display font-bold mb-8">Ready to map your mind?</h2>
        <Link href="/mindmap/pricing">
          <Button size="lg" className="rounded-full text-lg h-14 px-10">
            View Pricing Plans
          </Button>
        </Link>
      </section>
    </div>
  );
}