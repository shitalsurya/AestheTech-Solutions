import { motion } from "framer-motion";

export default function Apps() {
  const apps = [
    {
      title: "Mantra Guide",
      description: "A spiritual guidance app providing daily mantras, meditation timers, mindfulness exercises, and progress tracking to bring peace to your daily routine.",
      image: "/src/assets/images/app-mantra-guide.png",
      color: "border-orange-500/50"
    },
    {
      title: "WhatsToday",
      description: "A smart calendar app highlighting historical events, daily significance, and an awareness calendar. Never miss a meaningful moment in history.",
      image: "/src/assets/images/app-whatstoday.png",
      color: "border-cyan-500/50"
    },
    {
      title: "LifeLens",
      description: "Your daily reflection companion. Fostering intentional living and mindful habits with mood journals and daily prompts.",
      image: "/src/assets/images/app-lifelens.png",
      color: "border-purple-500/50"
    }
  ];

  return (
    <div className="py-24 container mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Our Applications</h1>
        <p className="text-xl text-muted-foreground">
          Thoughtfully crafted digital tools designed to bring mindfulness, knowledge, and intention into your daily life.
        </p>
      </div>

      <div className="space-y-32">
        {apps.map((app, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-24`}
          >
            <div className="flex-1 w-full max-w-md mx-auto">
              <div className={`relative aspect-[9/16] rounded-3xl overflow-hidden glass-card border-t-4 ${app.color} shadow-2xl`}>
                <img src={app.image} alt={app.title} className="object-cover w-full h-full" />
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold">{app.title}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{app.description}</p>
              <div className="pt-4">
                <span className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium">
                  Available soon on iOS & Android
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}