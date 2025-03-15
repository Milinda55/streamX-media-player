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
            setIsPlaying(false);
            setTime(0);  // Reset the time when a new file is dropped
            setDuration(0);
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
        const mediaElement = videoRef.current || audioRef.current;
        if (mediaElement) {
            mediaElement.volume = e.target.value;
        }
    };


    const updateTime = () => {
        const mediaElement = videoRef.current || audioRef.current;
        if (mediaElement) {
            setTime(mediaElement.currentTime);
            setDuration(mediaElement.duration);
        }
    };

    const handleFullscreen = () => {
        const mediaElement = videoRef.current;
        if (mediaElement) {
            if (mediaElement.requestFullscreen) {
                mediaElement.requestFullscreen();
            } else if (mediaElement.mozRequestFullScreen) { // Firefox
                mediaElement.mozRequestFullScreen();
            } else if (mediaElement.webkitRequestFullscreen) { // Chrome, Safari
                mediaElement.webkitRequestFullscreen();
            } else if (mediaElement.msRequestFullscreen) { // IE/Edge
                mediaElement.msRequestFullscreen();
            }
        }
    };



    return (
        <div className="media-player-container" {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="media-player">
                {mediaSource && (
                    <>
                        <div className="controls">
                            <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
                            <button onClick={handleStop}>Stop</button>
                            <button onClick={() => handleSkip(-10)}>Skip Back 10s</button>
                            <button onClick={() => handleSkip(10)}>Skip Forward 10s</button>
                            <button onClick={handleMuteToggle}>{isMuted ? "Unmute" : "Mute"}</button>
                            <button onClick={handleFullscreen}>Fullscreen</button>


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
                            <span>{Math.floor(time)} / {Math.floor(duration)}</span>
                        </div>

                        <div className="media-container">
                            {mediaSource && mediaSource.endsWith('.mp4') ? (
                                <video
                                    ref={videoRef}
                                    src={mediaSource}
                                    onTimeUpdate={updateTime}
                                    controls
                                    width="100%"
                                    height="auto"
                                ></video>
                            ) : mediaSource && mediaSource.endsWith('.mp3') ? (
                                <audio
                                    ref={audioRef}
                                    src={mediaSource}
                                    onTimeUpdate={updateTime}
                                    controls
                                    width="100%"
                                    height="auto"
                                ></audio>
                            ) : null}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
export default MediaPlayer;
