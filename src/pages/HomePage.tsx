// src/pages/HomePage.tsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const FeaturePill = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <motion.div
    whileHover={{ y: -6, scale: 1.03 }}
    className="flex items-center gap-3 bg-zen-dark-secondary/60 border border-zen-cyan/20 p-4 rounded-xl shadow-md hover:shadow-zen-cyan/20 transition"
  >
    <div className="w-12 h-12 flex items-center justify-center rounded-md bg-zen-dark-primary/40 text-2xl">
      {icon}
    </div>
    <div className="text-sm text-gray-200 font-medium">{title}</div>
  </motion.div>
);

export default function HomePage() {
  const stats = [
    { label: "Active Users", value: "12.4K" },
    { label: "Quests Completed", value: "248K" },
    { label: "AI Driven", value: "Yes" },
    { label: "24/7 Community", value: "Global" },
    { label: "Characters", value: "20+" },
  ];

  const features = [
    "XP & Leveling System",
    "Reward Store",
    "AI Quest Generator",
    "Character Customization",
    "Daily Quest Calendar",
    "Notes & Memories",
    "Leaderboard & Streaks",
    "Communities & Groups",
    "AI Fitness Plans",
    "AI Work Routines",
    "Focus Mode",
    "Export Data",
    "Achievements & Badges",
    "Streak Protection",
    "Multiplayer Challenges",
    "Theme Customization",
    "Cloud Backup",
    "Photo Journal",
    "Notifications",
    "Solo-Leveling UI Theme",
  ];

  const testimonials = [
    {
      name: "Aiko",
      role: "Fitness Creator",
      text: "ZenAi changed how I train — AI plans are tailored to my personality and keep me consistent.",
    },
    {
      name: "Marcus",
      role: "Product Manager",
      text: "The quest board makes daily habits fun. I finally keep streaks longer than a week!",
    },
    {
      name: "Leah",
      role: "Student",
      text: "The community feature keeps me motivated. I love the XP system.",
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: "Sign up",
      desc: "Create your free account with email or Google.",
    },
    {
      step: 2,
      title: "Choose Character",
      desc: "Pick your avatar, class, abilities, theme & name.",
    },
    {
      step: 3,
      title: "Add Quests",
      desc: "Create tasks, routines & daily challenges.",
    },
    {
      step: 4,
      title: "Use AI",
      desc: "Let AI build workouts, schedules, work plans, etc.",
    },
    {
      step: 5,
      title: "Join Groups",
      desc: "Create or join communities. Build teams.",
    },
    {
      step: 6,
      title: "Level Up",
      desc: "Earn XP, rewards, badges & compete.",
    },
  ];

  return (
    <div className="min-h-screen bg-zen-dark-primary text-white overflow-x-hidden">
      {/* -------------------------------------------------- */}
      {/* HERO SECTION */}
      {/* -------------------------------------------------- */}
      <section className="relative w-full overflow-hidden">
        {/* HERO BACKGROUND with your Solo-Leveling eyes */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.18] md:opacity-[0.25]"
          style={{ backgroundImage: "url('/hero-bg.jpeg')" }}
        />

        {/* Blue fog glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zen-dark-primary/70 to-zen-dark-primary" />

        <div className="container mx-auto px-6 lg:px-20 py-24 lg:py-36 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          {/* LEFT CONTENT */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex-1 space-y-6"
          >
            <motion.h1
              variants={fadeUp}
              className="font-gaming text-5xl lg:text-7xl text-zen-cyan drop-shadow-[0_0_20px_rgba(14,255,255,0.4)]"
            >
              ZEN Habit Tracker
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-gray-300 max-w-xl text-lg"
            >
              Turn your life into an RPG. Complete quests, earn XP, unlock
              abilities & rise through ranks — powered by AI, inspired by
              Solo-Leveling.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex gap-4 mt-6 flex-wrap"
            >
              <Link
                to="/signup"
                className="px-6 py-3 bg-zen-cyan text-black font-bold rounded-lg hover:bg-white transition"
              >
                Begin Your Journey
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 border border-zen-cyan/40 text-gray-300 font-semibold rounded-lg hover:bg-zen-dark-secondary transition"
              >
                Sign In
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-20"
            >
              {stats.map((s) => (
                <motion.div
                  key={s.label}
                  whileHover={{ scale: 1.05 }}
                  className="p-3 rounded-lg bg-zen-dark-secondary/50 border border-zen-cyan/20 text-center backdrop-blur"
                >
                  <div className="text-2xl font-bold text-zen-cyan">
                    {s.value}
                  </div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* FEATURE PILL SECTION */}
      {/* -------------------------------------------------- */}
      <section className="container mx-auto px-6 lg:px-20 py-16">
        <motion.h2
          initial="hidden"
          whileInView="show"
          variants={fadeUp}
          viewport={{ once: true }}
          className="font-gaming text-3xl text-zen-cyan mb-8"
        >
          Why ZEN?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <FeaturePill icon="⚡" title="AI-Driven Plans" />
          <FeaturePill icon="🛡️" title="20+ Characters" />
          <FeaturePill icon="🌐" title="24/7 Community" />
          <FeaturePill icon="🏆" title="Quests & Rewards" />
        </motion.div>
      </section>

      {/* -------------------------------------------------- */}
      {/* TESTIMONIALS */}
      {/* -------------------------------------------------- */}
      <section className="bg-zen-dark-secondary/30 py-16">
        <div className="container mx-auto px-6 lg:px-20">
          <motion.h3
            initial="hidden"
            whileInView="show"
            variants={fadeUp}
            className="font-gaming text-3xl text-zen-cyan mb-8"
          >
            What creators say
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="p-6 rounded-xl bg-zen-dark-primary/60 border border-zen-cyan/10 backdrop-blur"
              >
                <p className="text-gray-200 mb-4">“{t.text}”</p>
                <div className="text-sm text-gray-400 font-medium">
                  {t.name} • {t.role}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* LARGE FEATURE GRID */}
      {/* -------------------------------------------------- */}
      <section className="container mx-auto px-6 lg:px-20 py-16">
        <h3 className="font-gaming text-3xl text-zen-cyan mb-8">
          Features
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.02 * i }}
              className="p-4 rounded-xl bg-zen-dark-secondary/40 border border-zen-cyan/20 backdrop-blur hover:scale-[1.02] transition text-gray-200"
            >
              {f}
            </motion.div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* PROCESS STEPS */}
      {/* -------------------------------------------------- */}
      <section className="bg-zen-dark-secondary/30 py-16">
        <div className="container mx-auto px-6 lg:px-20">
          <h3 className="font-gaming text-3xl text-zen-cyan mb-8">
            How it works
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {processSteps.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="p-6 rounded-xl bg-zen-dark-primary/60 border border-zen-cyan/10 backdrop-blur"
              >
                <div className="text-3xl text-zen-cyan font-bold">
                  Step {p.step}
                </div>
                <div className="mt-2 font-semibold text-white">
                  {p.title}
                </div>
                <div className="mt-2 text-gray-300 text-sm">{p.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* FAQ */}
      {/* -------------------------------------------------- */}
      <section className="container mx-auto px-6 lg:px-20 py-16">
        <h3 className="font-gaming text-3xl text-zen-cyan mb-8">FAQ</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <details className="p-4 rounded-xl bg-zen-dark-secondary/40 border border-zen-cyan/20 cursor-pointer">
            <summary className="font-semibold text-white">Is ZEN free?</summary>
            <div className="mt-2 text-gray-300">
              Yes, core features are free. Premium features are optional.
            </div>
          </details>

          <details className="p-4 rounded-xl bg-zen-dark-secondary/40 border border-zen-cyan/20 cursor-pointer">
            <summary className="font-semibold text-white">
              Can I sync across devices?
            </summary>
            <div className="mt-2 text-gray-300">
              Yes, all data is synced through the cloud.
            </div>
          </details>

          <details className="p-4 rounded-xl bg-zen-dark-secondary/40 border border-zen-cyan/20 cursor-pointer">
            <summary className="font-semibold text-white">
              How does AI create plans?
            </summary>
            <div className="mt-2 text-gray-300">
              AI analyzes your habits & preferences to build routines.
            </div>
          </details>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* FOOTER */}
      {/* -------------------------------------------------- */}
      <footer className="py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ZEN Habit Tracker — built with ❤️
      </footer>
    </div>
  );
}
