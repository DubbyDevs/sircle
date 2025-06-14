import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header";
import AudioPlayer from "./components/AudioPlayer";
import ContactForm from "./components/ContactForm";
import Videos from "./components/Videos";
import Music from "./components/Music";

const images = ["/bg1.jpg", "/bg2.jpg", "/bg3.jpg"];
const fadeTime = 28; // Set to 28 for real, or 5-10 for testing

export default function App() {
  const [curr, setCurr] = useState(0);
  const [prev, setPrev] = useState(null);
  const [fading, setFading] = useState(true);
  const intervalRef = useRef(null);

  // Nav/audio logic
  const [showHeader, setShowHeader] = useState(false);
  const [headerPinned, setHeaderPinned] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

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
  const handleToggleHeader = () => {
    if (showHeader) {
      setShowHeader(false);
      setHeaderPinned(true);
    } else {
      setShowHeader(true);
      setHeaderPinned(false);
    }
  };

  // Overlay for nav
  const overlayClick = () => {
    if (!showHeader) setShowHeader(true);
  };

  // Secret scroll up area logic (unchanged)
  const secretRef = useRef(null);
  const [revealSecret, setRevealSecret] = useState(false);
  const handleScroll = () => {
    if (window.scrollY < -30 && !revealSecret) setRevealSecret(true);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line
  }, [revealSecret]);

  return (
    <Router>
      <div style={{
        width: "100vw", height: "100vh",
        position: "fixed", top: 0, left: 0,
        overflow: "hidden"
      }}>
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

        {/* Header/Nav logic */}
        <AnimatePresence>
          {showHeader && (
            <Header
              onHide={handleToggleHeader}
              audioPlaying={audioPlaying}
              setAudioPlaying={setAudioPlaying}
              setBgIdx={setCurr}
            />
          )}
        </AnimatePresence>
        {!showHeader && headerPinned && (
          <motion.div
            initial={{ opacity: 0, y: -32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 32,
              right: 38,
              zIndex: 50,
              fontSize: "2rem",
              cursor: "pointer",
              color: "#fff",
              textShadow: "0 0 12px #0ff, 0 0 22px #000",
            }}
            onClick={handleToggleHeader}
            title="Show menu"
          >
            O
          </motion.div>
        )}

        {/* Audio player floats at bottom right, global control */}
        <AudioPlayer
          playing={audioPlaying}
          setPlaying={setAudioPlaying}
          tracks={["/music1.mp3", "/music2.mp3"]}
        />

        {/* Secret scroll up area */}
        <div
          ref={secretRef}
          style={{
            position: "absolute",
            top: revealSecret ? 0 : "-30vh",
            left: 0,
            right: 0,
            height: "30vh",
            background: "rgba(0,0,0,0.9)",
            zIndex: 20,
            transition: "top 1s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/bg3.jpg"
            alt="Secret"
            style={{
              maxHeight: "80%",
              maxWidth: "80%",
              borderRadius: "24px",
              boxShadow: "0 0 42px 10px #00ffed22",
            }}
          />
        </div>
        {/* Overlay to show nav bar, only visible before nav is shown */}
        {!showHeader && (
          <div
            style={{
              width: "100vw",
              height: "100vh",
              position: "absolute",
              zIndex: 99,
              cursor: "pointer",
              top: 0,
              left: 0
            }}
            title="Click to show menu"
            onClick={overlayClick}
          />
        )}
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
