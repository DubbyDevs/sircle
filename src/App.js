import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import AudioPlayer from "./components/AudioPlayer";
import ContactForm from "./components/ContactForm";
import Videos from "./components/Videos";
import Music from "./components/Music";

// Orbitron Google Font
const orbitronFontLink = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap";

const images = ["/bg1.jpg", "/bg2.jpg", "/bg3.jpg"];
const fadeTime = 28; // Set to 28 for production, or 5-10 for testing

// NO boxShadow here; handled by CSS animation only!
const buttonStyle = {
  border: "none",
  borderRadius: "50%",
  width: 56,
  height: 56,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  outline: "none",
  cursor: "pointer",
  transition: "box-shadow 0.5s",
  fontFamily: "'Orbitron', 'Poppins', 'Segoe UI', Arial, sans-serif"
};

const gradientTextStyle = {
  background: "linear-gradient(90deg, #e0e0e0 0%, #fff 55%, #ededed 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontFamily: "'Orbitron', 'Poppins', 'Segoe UI', Arial, sans-serif",
  fontWeight: 600,
  letterSpacing: "0.02em",
  fontSize: 30,
  userSelect: "none",
  textAlign: "center"
};

export default function App() {
  const [curr, setCurr] = useState(0);
  const [prev, setPrev] = useState(null);
  const [fading, setFading] = useState(true);
  const intervalRef = useRef(null);

  // Nav/audio logic
  const [showHeader, setShowHeader] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Contact modal state
  const [showContact, setShowContact] = useState(false);

  // Fade logic (original working version)
  useEffect(() => {
    setPrev(null);
    setFading(true);
    const initialFade = setTimeout(() => setFading(false), fadeTime * 1000);

    intervalRef.current = setInterval(() => {
      setPrev(curr);
      setCurr(c => (c + 1) % images.length);
      setFading(true);
      setTimeout(() => setFading(false), fadeTime * 1000);
    }, fadeTime * 1000);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(initialFade);
    };
    // eslint-disable-next-line
  }, [curr]);

  // Nav functions
  const handleHideHeader = (e) => {
    e?.stopPropagation?.();
    setShowHeader(false);
    setShowContact(false);
  };
  const handleShowHeader = (e) => {
    e?.stopPropagation?.();
    setShowHeader(true);
  };
  const handlePlay = (e) => {
    e?.stopPropagation?.();
    setAudioPlaying(p => !p);
  };

  // Overlay to show nav bar
  const overlayClick = (e) => {
    if (!showHeader) handleShowHeader(e);
  };

  return (
    <Router>
      {/* Import Orbitron font */}
      <link rel="stylesheet" href={orbitronFontLink} />

      <div
        style={{
          width: "100vw", height: "100vh",
          position: "fixed", top: 0, left: 0, overflow: "hidden"
        }}
        onClick={overlayClick}
      >
        {/* Previous image fading out */}
        <AnimatePresence>
          {fading && prev !== null && (
            <motion.div
              key={images[prev] + "-fade"}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: fadeTime, ease: "linear" }}
              style={{
                background: `url(${images[prev]}) center center / cover no-repeat`,
                width: "100vw", height: "100vh",
                position: "absolute", top: 0, left: 0, zIndex: 2
              }}
            />
          )}
        </AnimatePresence>
        {/* Current image always visible */}
        <div
          style={{
            background: `url(${images[curr]}) center center / cover no-repeat`,
            width: "100vw", height: "100vh",
            position: "absolute", top: 0, left: 0, zIndex: 1
          }}
        />

        {/* Nav/header bar */}
        {showHeader && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: 72,
              background: "rgba(0,0,0,0.35)",
              boxShadow: "0 4px 20px #00ffe033",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 100,
              overflow: "hidden"
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* O button - left */}
            <button
              onClick={handleHideHeader}
              style={{
                ...buttonStyle,
                marginLeft: 28, marginTop: 4,
                animation: showHeader ? "glow 16s ease-in-out infinite" : "none"
              }}
              aria-label="Hide menu"
            >
              <span style={gradientTextStyle}>O</span>
            </button>
            {/* (middle empty for future music info etc) */}
            <div style={{ flex: 1 }} />
            {/* Play button - right */}
            <button
              onClick={handlePlay}
              style={{
                ...buttonStyle,
                marginRight: 28, marginTop: 4,
                animation: audioPlaying && showHeader ? "glow 16s ease-in-out infinite" : "none"
              }}
              aria-label={audioPlaying ? "Pause" : "Play"}
            >
              <span style={gradientTextStyle}>{audioPlaying ? "⏸" : "▶"}</span>
            </button>
          </div>
        )}

        {/* Contact - bottom right, only if nav is shown */}
        {showHeader && (
          <button
            onClick={e => { e.stopPropagation(); setShowContact(true); }}
            style={{
              position: "fixed", right: 36, bottom: 30, zIndex: 110,
              background: "rgba(0,0,0,0.75)", color: "#00ffe0", border: "none",
              borderRadius: "24px", fontWeight: 700, fontSize: 19,
              letterSpacing: "0.03em", boxShadow: "0 0 11px #00ffe044",
              padding: "10px 28px", cursor: "pointer"
            }}
          >Contact</button>
        )}

        {/* Contact modal (real form) */}
        {showContact && (
          <div
            onClick={() => setShowContact(false)}
            style={{
              position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
              zIndex: 9999, background: "rgba(0,0,0,0.74)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                position: "relative",
                background: "#111",
                borderRadius: 28,
                padding: 40,
                boxShadow: "0 0 44px #00ffe033"
              }}
            >
              <button
                onClick={() => setShowContact(false)}
                style={{
                  position: "absolute", top: 18, right: 24,
                  background: "none", border: "none",
                  color: "#fff", fontSize: 29, cursor: "pointer"
                }}
              >✕</button>
              <ContactForm />
            </div>
          </div>
        )}

        {/* Audio player */}
        <AudioPlayer
          playing={audioPlaying}
          setPlaying={setAudioPlaying}
          trackIdx={0}
          tracks={["/music1.mp3", "/music2.mp3"]}
        />

        {/* Routing for pages */}
        <div style={{ position: "relative", zIndex: 3, height: "100vh" }}>
          <Routes>
            <Route path="/videos" element={<Videos />} />
            <Route path="/music" element={<Music />} />
            <Route path="/contact" element={<ContactForm />} />
          </Routes>
        </div>

        {/* Animated glow keyframes */}
        <style>
          {`
            @keyframes glow {
              0%   { box-shadow: 0 0 15px 7px #00ffe0cc; }
              50%  { box-shadow: 0 0 27px 11px #ff2ee8cc; }
              100% { box-shadow: 0 0 15px 7px #00ffe0cc; }
            }
          `}
        </style>
      </div>
    </Router>
  );
}
