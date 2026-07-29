"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const slides = [
  {
    src: "/hero/inclusive-urban-transformation.jpg",
    title: "Inclusive Urban Transformation",
    description: "Cities that work for everyone.",
  },
  {
    src: "/hero/poverty-reduction.jpg",
    title: "Poverty Reduction",
    description: "Dignity and opportunity for all.",
  },
  {
    src: "/hero/climate-resilience.jpg",
    title: "Climate Resilience",
    description: "Communities ready for tomorrow.",
  },
];

const SLIDE_DURATION = 6000;

export function Hero() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[index];

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-navy">
      {/* Sliding photos */}
      <AnimatePresence>
        <motion.div
          key={slide.src}
          initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slide.src}
            alt={slide.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Legibility overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/25 to-navy/40" />

      {/* Caption */}
      <div className="container-tpi absolute inset-x-0 bottom-0 z-10 pb-24 lg:pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.title}
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -12 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-5 block h-px w-12 bg-gold" />
            <h1 className="heading-display max-w-4xl text-4xl leading-[1.05] text-white md:text-6xl lg:text-7xl">
              {slide.title}
            </h1>
            <p className="mt-4 text-lg text-white/85 md:text-xl">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        <div className="mt-10 flex gap-2">
          {slides.map((item, itemIndex) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setIndex(itemIndex)}
              aria-label={`Show slide: ${item.title}`}
              className={`h-1 rounded-full transition-all duration-500 ${
                itemIndex === index
                  ? "w-10 bg-gold"
                  : "w-5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
