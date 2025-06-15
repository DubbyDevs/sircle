import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1500&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1500&q=80"
];
const fadeTime = 5; // Duration of the crossfade in seconds

export default function TestCrossfade() {
  const [idx, setIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(null);
  const [showFade, setShowFade] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevIdx(idx);
      setIdx((i) => (i + 1) % images.length);
      setShowFade(true);
      setTimeout(() => setShowFade(false), fadeTime * 1000);
    }, fadeTime * 1000);
    return () => clearInterval(timer);
  }, [idx]);

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 999,
      pointerEvents: "none"
    }}>
      {/* The "fading out" image */}
      <AnimatePresence>
        {showFade && prevIdx !== null && (
          <motion.div
            key={images[prevIdx] + "-fade"}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: fadeTime, ease: "linear" }}
            style={{
              background: `url(${images[prevIdx]}) center center / cover no-repeat`,
              width: "100vw",
              height: "100vh",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 2,
            }}
          />
        )}
      </AnimatePresence>
      {/* The "fading in" image */}
      <div
        style={{
          background: `url(${images[idx]}) center center / cover no-repeat`,
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
    </div>
  );
}
