import { useRef, useState, useEffect } from "react";
import AudioPlayer from "./assets/audio/TheBattleofLife.mp3";

function App() {
  const audioRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    audioRef.current.currentTime += 10;
  };

  const skipBackward = () => {
    audioRef.current.currentTime -= 10;
  };

  const handleProgressChange = (e: any) => {
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: any) => {
    const newVolume = e.target.value;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={AudioPlayer} className="audio-element" />

      <div className="controls">
        <button onClick={togglePlayPause} className="control-button play-pause">
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={skipBackward} className="control-button skip-backward">
          -10s
        </button>
        <button onClick={skipForward} className="control-button skip-forward">
          +10s
        </button>
      </div>

      <div className="time-indicator">
        <span>
          {Math.floor(currentTime)} / {Math.floor(duration)}
        </span>
      </div>

      <div className="progress-bar" onClick={(e) => handleProgressChange(e)}>
        <span
          className="progress-fill"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        ></span>
      </div>

      <div className="volume-controls">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
        <button
          onClick={toggleMute}
          className={`mute-button ${isMuted ? "muted" : ""}`}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
      </div>
    </div>
  );
}

export default App;
