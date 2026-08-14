import { motion } from "motion/react";

export default function GlowOrb({ className = "" }) {
  return (
    <motion.div
      className={`glow-orb ${className}`}
      animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}