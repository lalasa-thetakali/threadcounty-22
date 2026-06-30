"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Cpu, Users, Eye, Target, Calendar, Award } from "lucide-react";

const team = [
  {
    name: "Dr. Vikram Sen",
    role: "Founder & CEO",
    bio: "PhD in Textile Technology with 15+ years researching computer vision applications in quality control.",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
  },
  {
    name: "Elena Rostova",
    role: "Chief AI Architect",
    bio: "Former Senior ML Engineer specializing in convolutional neural networks and generative AI.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300",
  },
  {
    name: "Aman Verma",
    role: "Head of Product",
    bio: "Deep expertise in industrial QC automation and software product design for global supply chains.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
  },
];

const timeline = [
  { year: "2024", title: "The Genesis", desc: "ThreadCounty was founded as a research project to automate thread counting using mobile macro lenses." },
  { year: "2025", title: "AI Model Release", desc: "Launched our custom Computer Vision model, achieving 96% accuracy on cotton, linen, and twill weaves." },
  { year: "2026", title: "SaaS Launch", desc: "Integrated Google Gemini Vision API and released the full-stack web inspection dashboard to public beta." },
];

export default function About() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/dashboard").then((res) => {
      if (res.ok) {
        router.replace("/dashboard");
      }
    });
  }, [router]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          About ThreadCounty
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed">
          ThreadCounty is an AI-powered textile technology platform helping manufacturers, QC professionals, researchers, and students audit fabric structures instantly using state-of-the-art computer vision.
        </p>
      </motion.div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div 
          whileHover={{ y: -5 }}
          className="card flex gap-4 items-start border-l-4 border-l-primary"
        >
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Target size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Our Mission</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              To simplify and digitize textile quality control, making professional-grade fabric inspections accessible to everyone in the supply chain.
            </p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="card flex gap-4 items-start border-l-4 border-l-accent"
        >
          <div className="p-3 bg-accent/10 rounded-lg text-accent">
            <Eye size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Our Vision</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              To become the global standard tool for fabric analysis, setting a new benchmark for speed, precision, and ease-of-use in textile manufacturing.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Tech Stack Badge Row */}
      <div className="card text-center space-y-4 bg-gray-50 dark:bg-gray-900/50">
        <h3 className="font-bold text-lg flex items-center justify-center gap-2">
          <Cpu className="text-primary" size={20} /> Technology Stack Used
        </h3>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-4">
          ThreadCounty is engineered with robust, highly scalable, and developer-friendly technologies to guarantee optimal speed and accuracy.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {["Next.js 14", "React 18", "TypeScript", "Tailwind CSS", "Supabase DB", "Supabase Auth", "Google Gemini Vision API", "Framer Motion", "Recharts", "jsPDF"].map((t) => (
            <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm text-gray-600 dark:text-gray-300">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Meet the Core Team</h2>
        <p className="text-gray-500 text-center text-sm max-w-md mx-auto">
          Innovators bridging the gap between textile engineering and artificial intelligence.
        </p>
        <div className="grid md:grid-cols-3 gap-8 pt-4">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="card text-center flex flex-col items-center space-y-3 relative overflow-hidden"
            >
              <img 
                src={member.img} 
                alt={member.name} 
                className="w-24 h-24 rounded-full object-cover border-2 border-primary/20 mb-2"
              />
              <h3 className="font-bold text-lg">{member.name}</h3>
              <div className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{member.role}</div>
              <p className="text-xs text-gray-500 leading-relaxed flex-1">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Our Journey</h2>
        <div className="relative border-l-2 border-gray-100 dark:border-gray-800 max-w-2xl mx-auto pl-6 space-y-8">
          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className="absolute -left-[31px] top-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-4 border-white dark:border-gray-950 shadow-sm" />
              <div className="text-sm font-bold text-primary mb-1">{item.year}</div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
