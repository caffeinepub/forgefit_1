import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Calendar,
  ChevronRight,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Track Your Progress",
    description:
      "Monitor your XP gains, workout streaks, and body metrics with beautiful charts and visualizations.",
    color: "#00d4ff",
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "Earn XP & Level Up",
    description:
      "Complete exercises to earn XP. Unlock titles from Beginner to Legend as you climb the ranks.",
    color: "#8b5cf6",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Compete with Others",
    description:
      "Climb global leaderboards, compete in weekly challenges, and follow top athletes.",
    color: "#06ffd4",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Build Consistency",
    description:
      "Daily streaks, achievement badges, and habit tracking keep you motivated every single day.",
    color: "#ff006e",
  },
];

const steps = [
  {
    num: "01",
    title: "Choose Goal",
    desc: "Select from 8 fitness goals tailored to your ambitions",
  },
  {
    num: "02",
    title: "Follow Exercises",
    desc: "Access 140+ exercises organized by category and difficulty",
  },
  {
    num: "03",
    title: "Track Progress",
    desc: "Log workouts, earn XP, and watch your stats soar",
  },
  {
    num: "04",
    title: "Compete & Earn Badges",
    desc: "Rise up leaderboards and unlock achievement badges",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        data-ocid="hero.section"
        className="relative min-h-screen flex items-center justify-center overflow-hidden hero-grid-bg"
      >
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full orb-blue opacity-40 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full orb-purple opacity-30 pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full orb-cyan opacity-20 pointer-events-none" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[#00d4ff] font-exo font-semibold tracking-[0.3em] text-sm uppercase mb-4 neon-pulse">
              ⚡ The Ultimate Fitness Platform
            </p>
            <h1 className="font-orbitron font-black text-5xl sm:text-7xl lg:text-8xl mb-4 leading-none">
              <span className="neon-text-blue" style={{ color: "#00d4ff" }}>
                FORGE
              </span>
              <span className="text-white">FIT</span>
            </h1>
            <h2 className="font-exo font-bold text-2xl sm:text-3xl text-white mb-4">
              Forge Your Strength
            </h2>
            <p className="text-white text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              The hardest decisions need the strongest will. Build your ultimate
              physique, earn XP, and rise to the top.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/dashboard" data-ocid="hero.primary_button">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-neon-blue px-8 py-4 rounded-xl font-exo font-bold text-lg flex items-center gap-2"
                >
                  Start Training <ChevronRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/exercises" data-ocid="hero.primary_button">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-neon-purple px-8 py-4 rounded-xl font-exo font-bold text-lg flex items-center gap-2"
                >
                  Explore Exercises <ChevronRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/leaderboard" data-ocid="hero.primary_button">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-neon-cyan px-8 py-4 rounded-xl font-exo font-bold text-lg flex items-center gap-2"
                >
                  View Leaderboard <ChevronRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/challenges" data-ocid="hero.primary_button">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-neon-pink px-8 py-4 rounded-xl font-exo font-bold text-lg flex items-center gap-2"
                >
                  Join Challenges <ChevronRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-16 flex flex-wrap justify-center gap-8"
          >
            {[
              { label: "Exercises", value: "140+" },
              { label: "XP Tiers", value: "4" },
              { label: "Challenges", value: "10+" },
              { label: "Tools", value: "8" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="font-orbitron font-black text-3xl"
                  style={{ color: "#00d4ff" }}
                >
                  {stat.value}
                </p>
                <p className="text-white text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        data-ocid="features.section"
        className="py-24 px-4 max-w-7xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-orbitron font-bold text-3xl sm:text-4xl text-white mb-4">
            Why Choose <span style={{ color: "#00d4ff" }}>FORGEFIT</span>?
          </h2>
          <p className="text-white max-w-xl mx-auto">
            Everything you need to transform your fitness journey into an epic
            adventure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ translateY: -6, scale: 1.02 }}
              className="glass-card rounded-2xl p-6 transition-all duration-300"
              style={{ borderColor: `${feat.color}20` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: `${feat.color}20`,
                  border: `1px solid ${feat.color}40`,
                  color: feat.color,
                }}
              >
                {feat.icon}
              </div>
              <h3 className="font-exo font-bold text-white text-lg mb-2">
                {feat.title}
              </h3>
              <p className="text-white text-sm leading-relaxed">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section
        data-ocid="howitworks.section"
        className="py-24 px-4 max-w-7xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-orbitron font-bold text-3xl sm:text-4xl text-white mb-4">
            How It <span style={{ color: "#8b5cf6" }}>Works</span>
          </h2>
          <p className="text-white max-w-xl mx-auto">
            Four simple steps to unlock your full potential.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div
            className="hidden lg:block absolute top-1/2 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,212,255,0.4), rgba(139,92,246,0.4), transparent)",
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10"
                  style={{
                    background: "rgba(0,212,255,0.1)",
                    border: "1px solid rgba(0,212,255,0.4)",
                    boxShadow: "0 0 20px rgba(0,212,255,0.2)",
                  }}
                >
                  <span
                    className="font-orbitron font-black text-lg"
                    style={{ color: "#00d4ff" }}
                  >
                    {step.num}
                  </span>
                </div>
                <h3 className="font-exo font-bold text-white text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-white text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Disclaimer Banner */}
      <div className="px-4 pb-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl p-6 flex items-start gap-4"
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.3)",
          }}
        >
          <AlertTriangle
            className="w-6 h-6 flex-shrink-0 mt-0.5"
            style={{ color: "#f59e0b" }}
          />
          <div>
            <h4 className="font-exo font-bold text-amber-400 mb-1">
              Fitness Safety Disclaimer
            </h4>
            <p className="text-amber-200/70 text-sm leading-relaxed">
              FORGEFIT is an educational fitness platform. Always consult a
              qualified healthcare professional or certified personal trainer
              before starting any new exercise program, especially if you have
              pre-existing health conditions, injuries, or medical concerns.
              Listen to your body, warm up properly, use correct form, and never
              train through pain. FORGEFIT is not responsible for any injuries
              that may occur during exercise.{" "}
              <Link to="/safety" className="underline hover:text-amber-300">
                Read full safety disclaimer
              </Link>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
