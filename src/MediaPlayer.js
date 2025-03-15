import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import './MediaPlayer.css';

const MediaPlayer = () => {
    const [mediaSource, setMediaSource] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const videoRef = useRef(null);
    const audioRef = useRef(null);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            setMediaSource(URL.createObjectURL(file));
            setIsPlaying(true);
        },
    });

    const handlePlayPause = () => {
        if (videoRef.current || audioRef.current) {
            isPlaying ? (videoRef.current || audioRef.current).pause() : (videoRef.current || audioRef.current).play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleStop = () => {
        if (videoRef.current || audioRef.current) {
            (videoRef.current || audioRef.current).pause();
            (videoRef.current || audioRef.current).currentTime = 0;
            setIsPlaying(false);
        }
    };

    const handleSkip = (seconds) => {
        if (videoRef.current || audioRef.current) {
            (videoRef.current || audioRef.current).currentTime += seconds;
        }
    };

    const handleMuteToggle = () => {
        setIsMuted(!isMuted);
        if (videoRef.current || audioRef.current) {
            (videoRef.current || audioRef.current).muted = !isMuted;
        }
    };

    const handleVolumeChange = (e) => {
        setVolume(e.target.value);
        if (videoRef.current || audioRef.current) {
            (videoRef.current || audioRef.current).volume = volume;
        }
    };

    return (
        <div className="media-player-container" >

            <div className="media-player">
                {mediaSource && (
                    <>
                        <div className="controls">
                            <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
                            <button onClick={handleStop}>Stop</button>
                            <button onClick={() => handleSkip(-10)}>Skip Back 10s</button>
                            <button onClick={() => handleSkip(10)}>Skip Forward 10s</button>
                            <button onClick={handleMuteToggle}>{isMuted ? "Unmute" : "Mute"}</button>

                        </div>

                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                        />

                        <div className="time-info">

                        </div>

                        <input

                        />
                        <div className="media-container">


                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
export default MediaPlayer;
