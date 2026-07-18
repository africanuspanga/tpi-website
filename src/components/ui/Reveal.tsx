"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

interface RevealProps extends HTMLMotionProps<"div"> {
  /** Stagger delay in seconds. */
  delay?: number;
  /** Travel distance in px (default 28). */
  y?: number;
}

/**
 * Lightweight scroll-reveal wrapper. Fades and lifts its children into view
 * once, and honours the user's reduced-motion preference.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  ...props
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children as ReactNode}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
