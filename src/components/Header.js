import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Button from 'react-bootstrap/Button';

const navItems = [
  { label: "Home", path: "/" },
  { label: "Videos", path: "/videos" },
  { label: "Music", path: "/music" },
  { label: "Contact", path: "/contact" },
];

function Header({ onHide, audioPlaying, setAudioPlaying }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -32 }}
      transition={{ duration: 0.7, type: "spring" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(10,10,18,0.22)",
        boxShadow: "0 4px 22px #0008",
        padding: "12px 0"
      }}
    >
      <nav className="d-flex gap-4 align-items-center">
        {navItems.map((item, i) => (
          <Button
            key={i}
            variant={location.pathname === item.path ? "info" : "outline-light"}
            onClick={() => navigate(item.path)}
            style={{
              fontSize: "1.16rem",
              fontWeight: "bold",
              background: location.pathname === item.path ? "#0ff8" : undefined,
              border: "none",
              boxShadow: location.pathname === item.path ? "0 0 12px #0ff" : undefined,
              marginRight: 14,
            }}
          >
            {item.label}
          </Button>
        ))}
        <Button
          variant={audioPlaying ? "danger" : "success"}
          onClick={() => setAudioPlaying((v) => !v)}
          style={{
            fontSize: "1.15rem",
            fontWeight: "bold",
            width: 54,
            height: 44,
            borderRadius: "1em",
            marginRight: 14,
            boxShadow: audioPlaying ? "0 0 16px #f06" : "0 0 8px #0f08",
          }}
        >
          {audioPlaying ? "Pause" : "Play"}
        </Button>
        <span
          onClick={onHide}
          style={{
            fontSize: "2.1rem",
            color: "#fff",
            cursor: "pointer",
            marginLeft: 22,
            textShadow: "0 0 16px #0ff, 0 0 12px #111",
            userSelect: "none",
            letterSpacing: "2px"
          }}
          title="Hide menu"
        >
          O
        </span>
      </nav>
    </motion.div>
  );
}
export default Header;
