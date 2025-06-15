import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import AudioPlayer from "./components/AudioPlayer";
import ContactForm from "./components/ContactForm";
import Videos from "./components/Videos";
import Music from "./components/Music";

// Orbitron Google Font
const orbitronFontLink = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap";

const images = ["/bg1.jpg", "/bg2.jpg", "/bg3.jpg", "/bg4.jpg", "/bg5.jpg"];
const fadeTime = 28;
const tracks = ["/music1.mp3", "/music2.mp3"]; // Add more as needed

const buttonStyle = {
  border: "none",
  borderRadius: "50%",
  width: 53, // 5% smaller
  height: 53,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  outline: "none",
  cursor: "pointer",
  transition: "box-shadow 0.5s",
  fontFamily: "'Orbitron', 'Poppins', 'Segoe UI', Arial, sans-serif"
};

const arrowButtonStyle = {
  ...buttonStyle,
  width: 22,
  height: 22,
  fontSize: 14,
  margin: 0,
  minWidth: 0,
  minHeight: 0
};

const gradientTextStyle = {
  background: "linear-gradient(90deg, #e0e0e0 0%, #fff 55%, #ededed 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontFamily: "'Orbitron', 'Poppins', 'Segoe UI', Arial, sans-serif",
  fontWeight: 600,
  letterSpacing: "0.02em",
  fontSize: 27,
  userSelect: "none",
  textAlign: "center"
};
const gradientTextArrow = {
  ...gradientTextStyle,
  fontSize: 13
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

  // Audio track index
  const [trackIdx, setTrackIdx] = useState(0);

  // For double-click prev logic
  const [lastPrevClick, setLastPrevClick] = useState(0);

  // Fade logic
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
    setAudioPlaying((p) => !p);
  };

  // Next/Prev logic
  const handleNext = (e) => {
    e?.stopPropagation?.();
    if (tracks.length > 1 && trackIdx < tracks.length - 1) {
      setTrackIdx(i => i + 1);
      setAudioPlaying(false);
      setTimeout(() => setAudioPlaying(true), 10);
    }
  };
  const handlePrev = (e) => {
    e?.stopPropagation?.();
    const now = Date.now();
    if (now - lastPrevClick < 1000 && tracks.length > 1 && trackIdx > 0) {
      setTrackIdx(i => i - 1);
      setAudioPlaying(false);
      setTimeout(() => setAudioPlaying(true), 10);
    } else {
      setTrackIdx(i => i);
      setAudioPlaying(false);
      setTimeout(() => setAudioPlaying(true), 10);
    }
    setLastPrevClick(now);
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
          <>
            {/* O button - left */}
            <button
              onClick={handleHideHeader}
              style={{
                ...buttonStyle,
                position: "fixed",
                top: 18,
                left: 18,
                zIndex: 110,
                animation: showHeader ? "glow 16s ease-in-out infinite" : "none"
              }}
              aria-label="Hide menu"
            >
              <span style={gradientTextStyle}>0</span>
            </button>
            {/* Play button - right */}
            <button
              onClick={handlePlay}
              style={{
                ...buttonStyle,
                position: "fixed",
                top: 18,
                right: 18,
                zIndex: 110,
                animation: audioPlaying && showHeader ? "glow 16s ease-in-out infinite" : "none"
              }}
              aria-label={audioPlaying ? "Pause" : "Play"}
            >
              <span style={gradientTextStyle}>{audioPlaying ? "⏸" : "▶"}</span>
            </button>
          </>
        )}

        {/* ARROW BUTTONS for prev/next song (lower left) */}
        {showHeader && (
          <div style={{
            position: "fixed",
            left: 20,
            bottom: 20,
            zIndex: 120,
            display: "flex",
            gap: 8
          }}>
            <button
              onClick={handlePrev}
              style={{
                ...arrowButtonStyle,
                animation: audioPlaying ? "glow 16s ease-in-out infinite" : "none",
                opacity: audioPlaying ? 1 : 0.5
              }}
              aria-label="Previous song"
              tabIndex={audioPlaying ? 0 : -1}
              disabled={!audioPlaying}
            >
              <span style={gradientTextArrow}>◀</span>
            </button>
            <button
              onClick={handleNext}
              style={{
                ...arrowButtonStyle,
                animation: audioPlaying ? "glow 16s ease-in-out infinite" : "none",
                opacity: audioPlaying ? 1 : 0.5
              }}
              aria-label="Next song"
              tabIndex={audioPlaying ? 0 : -1}
              disabled={!audioPlaying}
            >
              <span style={gradientTextArrow}>▶</span>
            </button>
          </div>
        )}

        {/* Contact - bottom right, only if nav is shown */}
        {showHeader && (
          <button
            onClick={e => { e.stopPropagation(); setShowContact(true); }}
            style={{
              position: "fixed", right: 34, bottom: 24, zIndex: 110,
              background: "rgba(0,0,0,0.75)", color: "#00ffe0", border: "none",
              borderRadius: "24px", fontWeight: 700, fontSize: 17,
              letterSpacing: "0.03em", boxShadow: "0 0 11px #00ffe044",
              padding: "7px 22px", cursor: "pointer"
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
                padding: 38,
                boxShadow: "0 0 44px #00ffe033"
              }}
            >
              <button
                onClick={() => setShowContact(false)}
                style={{
                  position: "absolute", top: 12, right: 22,
                  background: "none", border: "none",
                  color: "#fff", fontSize: 25, cursor: "pointer"
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
          trackIdx={trackIdx}
          setTrackIdx={setTrackIdx}
          tracks={tracks}
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
              0%   { box-shadow: 0 0 10px 4px #00ffe0cc; }
              50%  { box-shadow: 0 0 17px 8px #ff2ee8cc; }
              100% { box-shadow: 0 0 10px 4px #00ffe0cc; }
            }
          `}
        </style>
      </div>
    </Router>
  );
}
