import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden flex flex-col items-center text-center px-4">
        <div className="absolute inset-0 -z-10 bg-[url('/src/assets/images/hero-aesthtech.png')] bg-cover bg-center opacity-30 mix-blend-screen" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-background" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-block rounded-full px-3 py-1 mb-6 border border-primary/30 bg-primary/10 text-primary text-sm font-medium backdrop-blur-sm">
            AesthTech Solutions
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 leading-tight">
            Building Digital Solutions for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Growth & Innovation</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            We operate at the intersection of innovation and meaningful impact. 
            From spiritual tech to career advancement, we build software with soul.
          </p>
          <div className="flex items-center justify-center gap-4 flex-col sm:flex-row">
            <Link href="/apps">
              <Button size="lg" className="rounded-full w-full sm:w-auto text-lg h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                Explore Our Apps
              </Button>
            </Link>
            <Link href="/mindmap">
              <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto text-lg h-14 px-8 border-white/20 hover:bg-white/5">
                MindMap Compass
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* About Overview */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-sm font-bold text-accent uppercase tracking-wider mb-2">Our Mission</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold mb-6">Empowering minds through technology</h3>
            <p className="text-lg text-muted-foreground">
              AesthTech Solutions is not just a software company. We are architects of digital experiences that elevate human potential. Our products span across mental wellness, historical awareness, and career trajectory mapping.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="py-24 container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-16">Our Ecosystem</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            whileHover={{ y: -10 }}
            className="glass-card p-10 rounded-3xl text-left border-t-2 border-t-primary/50 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors" />
            <h3 className="text-3xl font-bold mb-4">Mobile Applications</h3>
            <p className="text-muted-foreground mb-8 text-lg">Tools for mindful living, historical awareness, and spiritual growth. Thoughtfully designed for iOS and Android.</p>
            <Link href="/apps">
              <Button variant="link" className="px-0 text-primary text-lg">Discover Apps →</Button>
            </Link>
          </motion.div>
          <motion.div 
            whileHover={{ y: -10 }}
            className="glass-card p-10 rounded-3xl text-left border-t-2 border-t-accent/50 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/20 transition-colors" />
            <h3 className="text-3xl font-bold mb-4">MindMap Compass</h3>
            <p className="text-muted-foreground mb-8 text-lg">An AI-powered EdTech platform for career guidance, assessments, and interview prep. Navigate your future.</p>
            <Link href="/mindmap">
              <Button variant="link" className="px-0 text-accent text-lg">Explore MindMap →</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Snippet */}
      <section className="py-24 bg-black/20 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Digital Solutions</h2>
            <p className="text-muted-foreground text-lg">Beyond our in-house products, we partner with visionaries to build custom digital solutions.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Mobile Development", desc: "Native and cross-platform apps built with React Native and Swift." },
              { title: "Web Platforms", desc: "Scalable full-stack web applications and SaaS platforms." },
              { title: "EdTech Innovation", desc: "Custom learning management systems and interactive educational tools." }
            ].map((service, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl">
                <h4 className="font-bold text-xl mb-3 text-foreground">{service.title}</h4>
                <p className="text-muted-foreground">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-50 blur-3xl" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">Ready to build the future?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Whether you want to try our products or partner with us for a custom solution, we are here to help.
          </p>
          <Link href="/contact">
            <Button size="lg" className="rounded-full text-lg h-14 px-10 bg-white text-black hover:bg-white/90">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}