import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import AudioPlayer from "./components/AudioPlayer";
import ContactForm from "./components/ContactForm";
import Videos from "./components/Videos";
import Music from "./components/Music";

const images = ["/bg1.jpg", "/bg2.jpg", "/bg3.jpg"];
const fadeTime = 28; // Set to 28 for production, or 5-10 for testing
const tickerText = "";
const tickerTypeSpeed = 50; // ms per character
const tickerPause = 20000; // ms (20s hidden between repeats)

const buttonStyle = (active) => ({
  border: "none",
  borderRadius: "50%",
  width: 56,
  height: 56,
  background: "rgba(0,0,0,0.55)",
  color: "#fff",
  fontSize: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  boxShadow: active ? "0 0 18px 7px #00ffe0cc" : "none",
  outline: "none",
  cursor: "pointer",
  transition: "box-shadow 0.18s",
  fontFamily: "inherit",
  WebkitTapHighlightColor: "transparent"
});

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

  // Ticker effect state
  const [tickerVisible, setTickerVisible] = useState(false);
  const [tickerIdx, setTickerIdx] = useState(0);
  const tickerTimerRef = useRef();

  // Fade logic (your original, working version)
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

  // Ticker effect: typewriter & repeat logic
  useEffect(() => {
    if (!audioPlaying || !showHeader) {
      setTickerVisible(false);
      setTickerIdx(0);
      clearTimeout(tickerTimerRef.current);
      return;
    }
    setTickerVisible(true);
    setTickerIdx(0);

    function showTicker(i) {
      if (!audioPlaying || !showHeader) return;
      if (i <= tickerText.length) {
        setTickerIdx(i);
        tickerTimerRef.current = setTimeout(() => showTicker(i + 1), tickerTypeSpeed);
      } else {
        // Done typing, hide for tickerPause ms, then repeat
        setTimeout(() => {
          setTickerVisible(false);
          setTimeout(() => {
            if (audioPlaying && showHeader) {
              setTickerIdx(0);
              setTickerVisible(true);
              showTicker(1);
            }
          }, 400); // small gap so it's not instant
        }, tickerPause);
      }
    }
    showTicker(1);

    return () => clearTimeout(tickerTimerRef.current);
    // eslint-disable-next-line
  }, [audioPlaying, showHeader]);

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
              style={{ ...buttonStyle(true), marginLeft: 28, marginTop: 4 }}
              aria-label="Hide menu"
            >O</button>
            {/* News ticker (center, typewriter style) when music is playing */}
            <div style={{
              flex: 1,
              textAlign: "center",
              position: "relative",
              pointerEvents: "none",
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "inherit"
            }}>
              {audioPlaying && tickerVisible && (
                <span
                  style={{
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 22,
                    letterSpacing: "0.01em",
                    textShadow: "0 0 7px #000, 0 0 10px #00ffe044",
                    fontFamily: "inherit"
                  }}
                >
                  {tickerText.slice(0, tickerIdx)}
                  <span style={{
                    display: "inline-block",
                    width: "1ch",
                    opacity: tickerIdx < tickerText.length ? 1 : 0
                  }}>|</span>
                </span>
              )}
            </div>
            {/* Play button - right */}
            <button
              onClick={handlePlay}
              style={{ ...buttonStyle(audioPlaying), marginRight: 28, marginTop: 4 }}
              aria-label={audioPlaying ? "Pause" : "Play"}
            >
              {audioPlaying ? "⏸" : "▶"}
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

        {/* Audio player (MUST always be rendered, or play won’t work) */}
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
      </div>
    </Router>
  );
}
