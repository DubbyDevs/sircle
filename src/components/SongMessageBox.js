import React from "react";

function SongMessageBox({ text, onPrev, onNext }) {
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: 36,
        transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.7)",
        color: "#fff",
        padding: "18px 44px",
        borderRadius: "24px",
        boxShadow: "0 0 28px #00ffe088, 0 2px 16px #000",
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: "0.05em",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: "32px"
      }}
    >
      <button
        onClick={onPrev}
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: 36,
          cursor: "pointer",
          textShadow: "0 0 12px #00ffe0",
          marginRight: 10,
          padding: "0 12px"
        }}
        aria-label="Previous"
      >
        &#60;
      </button>
      <span style={{
        padding: "0 8px",
        textShadow: "0 2px 12px #000"
      }}>
        {text}
      </span>
      <button
        onClick={onNext}
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: 36,
          cursor: "pointer",
          textShadow: "0 0 12px #00ffe0",
          marginLeft: 10,
          padding: "0 12px"
        }}
        aria-label="Next"
      >
        &#62;
      </button>
    </div>
  );
}

export default SongMessageBox;
