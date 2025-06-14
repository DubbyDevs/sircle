import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header";
import BackgroundTransition from "./components/BackgroundTransition";
import AudioPlayer from "./components/AudioPlayer";
import ContactForm from "./components/ContactForm";
import Videos from "./components/Videos";
import Music from "./components/Music";


const bgImages = ["/bg1.jpg", "/bg2.jpg", "/bg3.jpg"];
const fadeTime = 5; // Set to 5 for debugging, 28 for production

function App() {
  const [currIdx, setCurrIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(null);
  const [showFade, setShowFade] = useState(false);

  // Initial fade from black
  const [firstLoad, setFirstLoad] = useState(true);

  // --- Main Crossfade Logic ---
  useEffect(() => {
    let startTimer;
    if (firstLoad) {
      // Fade in from black to first image
      setShowFade(true);
      setPrevIdx(null);
      startTimer = setTimeout(() => {
        setShowFade(false);
        setFirstLoad(false);
        setPrevIdx(currIdx);
      }, fadeTime * 1000);
      return () => clearTimeout(startTimer);
    }
    // After initial, begin loop
    if (!showFade && !firstLoad) {
      startTimer = setTimeout(() => {
        setPrevIdx(currIdx);
        setCurrIdx((currIdx + 1) % bgImages.length);
        setShowFade(true);
      }, fadeTime * 1000);
      return () => clearTimeout(startTimer);
    }
    if (showFade && !firstLoad) {
      // After fade, hide the fading image
      startTimer = setTimeout(() => {
        setShowFade(false);
      }, fadeTime * 1000);
      return () => clearTimeout(startTimer);
    }
  }, [currIdx, showFade, firstLoad, bgImages.length]);

  // Nav/audio/etc as before
  const [showHeader, setShowHeader] = useState(false);
  const [headerPinned, setHeaderPinned] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const handleToggleHeader = () => {
    if (showHeader) {
      setShowHeader(false);
      setHeaderPinned(true);
    } else {
      setShowHeader(true);
      setHeaderPinned(false);
    }
  };

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

  // On first load, fade from black
  const prevImg = firstLoad
    ? null
    : prevIdx !== null
      ? bgImages[prevIdx]
      : null;

  return (
    <Router>
      <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>
        <BackgroundTransition
          currentImg={bgImages[currIdx]}
          prevImg={prevImg}
          showFade={showFade || firstLoad}
          fadeDuration={fadeTime}
        />
        <AnimatePresence>
          {showHeader && (
            <Header
              onHide={handleToggleHeader}
              audioPlaying={audioPlaying}
              setAudioPlaying={setAudioPlaying}
              setBgIdx={setCurrIdx}
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

export default App;
