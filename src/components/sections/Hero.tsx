"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export type HeroSlide = {
  image: string;
  title: string;
  description: string;
};

const SLIDE_DURATION = 6000;

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const count = slides.length;

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [count]);

  // An editor can remove slides while this component is mounted, so never index
  // past the end of the current list.
  const slide = slides[Math.min(index, count - 1)];
  if (!slide) return null;

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-navy">
      {/* Sliding photos */}
      <AnimatePresence>
        <motion.div
          key={slide.image}
          initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Legibility overlay */}
      <div className="absolute inset-0 bg-navy/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/30 to-navy/70" />

      {/* Caption */}
      <div className="container-tpi absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.title}
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -12 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <span className="mb-5 block h-px w-12 bg-gold" />
            <h1 className="heading-display max-w-5xl text-4xl leading-[1.08] text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
              {slide.title}
            </h1>
            {slide.description ? (
              <p className="mx-auto mt-4 max-w-xl text-base text-white/90 drop-shadow sm:text-lg md:text-xl">
                {slide.description}
              </p>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        {count > 1 ? (
          <div className="mt-10 flex justify-center gap-2">
            {slides.map((item, itemIndex) => (
              <button
                key={`${item.image}-${itemIndex}`}
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
        ) : null}
      </div>
    </section>
  );
}
