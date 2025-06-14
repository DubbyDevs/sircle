import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackgroundTransition({ currentImg, prevImg, showFade, fadeDuration }) {
  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 0,
      pointerEvents: "none"
    }}>
      {/* The image fading out (previous) */}
      <AnimatePresence>
        {showFade && prevImg && (
          <motion.div
            key={prevImg + "-fade"}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: fadeDuration, ease: "linear" }}
            style={{
              background: `url(${prevImg}) center center / cover no-repeat`,
              width: "100vw",
              height: "100vh",
              position: "absolute",
              top: 0,
              left: 0
            }}
          />
        )}
      </AnimatePresence>
      {/* The image fading in (current) */}
      <div
        style={{
          background: `url(${currentImg}) center center / cover no-repeat`,
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0
        }}
      />
    </div>
  );
}
