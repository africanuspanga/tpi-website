"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";

const floatingLabels = [
  "Inclusive Cities",
  "Poverty Reduction",
  "Climate Resilience",
];

export function Hero() {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: 0.1 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        poster="/tpi-image-1.jpeg"
      >
        <source src="/hero-background.mp4" type="video/mp4" />
      </video>

      {/* Layered gradient overlays for depth + legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/55 to-navy/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/40 to-transparent" />
      {/* Soft colour glow */}
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-urban-blue/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container-tpi relative z-10 py-32 pt-40"
      >
        <div className="max-w-4xl">
          <motion.div variants={item} className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-gold" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Advancing Inclusive Urban Development in Tanzania
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="heading-display text-5xl leading-[1.02] text-white md:text-7xl lg:text-8xl"
          >
            Better Cities.
            <br />
            <span className="text-gold">Better Lives.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="body-large mt-8 max-w-2xl text-lg text-white/85 md:text-xl"
          >
            TPi Tanzania partners with communities, local governments and allies
            to make cities more inclusive, resilient and just — so every resident
            can thrive.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 bg-gold px-7 text-base text-navy shadow-lg shadow-gold/20 hover:bg-gold/90"
            >
              <Link href="/what-we-do">
                Explore Our Work
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/40 bg-white/5 px-7 text-base text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
            >
              <Link href="/get-involved">Partner With TPi</Link>
            </Button>
          </motion.div>

          {/* Floating pillars */}
          <motion.div variants={item} className="mt-14 flex flex-wrap gap-3">
            {floatingLabels.map((label) => (
              <span
                key={label}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                {label}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/60 lg:flex"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
          Scroll
        </span>
        <ChevronDown className="h-4 w-4 animate-bounce motion-reduce:animate-none" />
      </motion.div>
    </section>
  );
}
