import React, { useEffect, useRef } from "react";

function AudioPlayer({ playing, tracks, trackIdx }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (playing) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing, trackIdx]);

  // Loop the current track, let parent component handle changing index
  return (
    <audio
      ref={audioRef}
      src={tracks[trackIdx]}
      loop
      preload="auto"
      style={{ display: "none" }}
    />
  );
}
export default AudioPlayer;
