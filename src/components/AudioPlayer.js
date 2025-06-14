import React, { useEffect, useRef } from "react";

function AudioPlayer({ playing, setPlaying, tracks = [] }) {
  const audioRef = useRef(null);
  const [trackIdx, setTrackIdx] = React.useState(0);

  useEffect(() => {
    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [playing, trackIdx]);

  const handleEnded = () => {
    // Loop current track
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  return (
    <div
      style={{
        position: "fixed",
        right: 32,
        bottom: 32,
        zIndex: 60,
        background: "rgba(20,20,28,0.66)",
        borderRadius: 22,
        padding: "10px 16px",
        boxShadow: "0 2px 18px #0ff3",
        display: playing ? "block" : "none"
      }}
    >
      <audio
        ref={audioRef}
        src={tracks[trackIdx]}
        loop
        preload="auto"
        onEnded={handleEnded}
        style={{ width: "250px" }}
      />
      <span style={{ color: "#0ff", marginRight: 16 }}>Now Playing: Track {trackIdx + 1}</span>
      {tracks.length > 1 && (
        <>
          <button
            onClick={() => setTrackIdx((idx) => (idx + tracks.length - 1) % tracks.length)}
            style={{ margin: "0 8px" }}
          >Prev</button>
          <button
            onClick={() => setTrackIdx((idx) => (idx + 1) % tracks.length)}
            style={{ margin: "0 8px" }}
          >Next</button>
        </>
      )}
    </div>
  );
}
export default AudioPlayer;
