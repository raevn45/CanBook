import { motion } from "motion/react";

const pixels = [
  { left: "10%", top: "20%" },
  { left: "80%", top: "15%" },
  { left: "72%", top: "70%" },
  { left: "18%", top: "75%" }
];

export default function FloatingPixels() {
  return (
    <>
      {pixels.map((pixel, index) => (
        <motion.div
          key={index}
          className="floating-pixel"
          style={{ left: pixel.left, top: pixel.top }}
          animate={{ y: [0, -15, 0], rotate: [0, 90, 180] }}
          transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}