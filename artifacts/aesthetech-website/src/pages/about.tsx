import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="py-24 container mx-auto px-4 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">About AesthTech</h1>
        <div className="prose prose-invert lg:prose-xl">
          <p className="lead text-xl text-muted-foreground mb-8">
            We are a modern Indian technology startup that builds digital products designed to enrich lives.
          </p>
          <div className="glass-card p-8 rounded-2xl mb-12">
            <h3 className="text-xl font-bold text-primary mb-4">Our Vision</h3>
            <p className="text-muted-foreground">
              To create an ecosystem of digital tools that foster personal growth, career advancement, and mindfulness. We believe technology should serve humanity's highest aspirations.
            </p>
          </div>
          <h2 className="text-2xl font-bold mb-4">What We Do</h2>
          <ul className="space-y-4 mb-8 text-muted-foreground">
            <li><strong className="text-foreground">MindMap Career Compass:</strong> Our flagship EdTech platform guiding students and professionals through their career journeys.</li>
            <li><strong className="text-foreground">Consumer Apps:</strong> Mobile applications focused on mindfulness, history, and daily intention.</li>
            <li><strong className="text-foreground">Enterprise Solutions:</strong> Custom digital transformations for forward-thinking organizations.</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}