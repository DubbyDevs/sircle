import React from "react";

function Header({ onHide, audioPlaying, onPlay, showSongBox, trackTitle, onPrevSong, onNextSong }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, width: "100vw", zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(0,0,0,0.38)", boxShadow: "0 4px 20px #00ffe033",
        padding: "16px 0"
      }}
    >
      {/* O button - top left */}
      <button
        onClick={e => { e.stopPropagation(); onHide(); }}
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: 22,
          marginLeft: 28,
          cursor: "pointer"
        }}
      >
        O
      </button>

      {/* Music box - center, only if music playing */}
      {showSongBox && (
        <div
          style={{
            background: "rgba(0,0,0,0.5)",
            color: "#fff",
            padding: "9px 26px",
            borderRadius: "15px",
            boxShadow: "0 0 10px #00ffe066",
            fontSize: 15,
            fontWeight: 400,
            fontcolor: "#00ffe066",
            letterSpacing: "0.04em",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <button
            onClick={e => { e.stopPropagation(); onPrevSong(); }}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: 14,
              cursor: "pointer",
              textShadow: "0 0 7px #00ffe0",
              marginRight: 5,
              padding: "0 5px"
            }}
            aria-label="Previous"
          >
            &#60;
          </button>
          <span style={{ padding: "0 5px" }}>{trackTitle}</span>
          <button
            onClick={e => { e.stopPropagation(); onNextSong(); }}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: 14,
              cursor: "pointer",
              textShadow: "0 0 7px #00ffe0",
              marginLeft: 5,
              padding: "0 5px"
            }}
            aria-label="Next"
          >
            &#62;
          </button>
        </div>
      )}

      {/* Play button - top right */}
      <button
        onClick={e => { e.stopPropagation(); onPlay(); }}
        style={{
          borderRadius: "50%",
          width: 48, height: 48,
          background: audioPlaying ? "#00ffe0" : "#111",
          color: audioPlaying ? "#000" : "#fff",
          border: "none",
          fontSize: 24,
          marginRight: 28,
          boxShadow: audioPlaying ? "0 0 14px #00ffe099" : "0 0 7px #222",
          cursor: "pointer"
        }}
      >
        {audioPlaying ? "⏸" : "▶"}
      </button>
    </div>
  );
}
export default Header;
