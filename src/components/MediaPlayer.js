import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './MediaPlayer.css';

const MediaPlayer = () => {
    const [mediaSource, setMediaSource] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMaximized, setIsMaximized] = useState(false);
    const mediaRef = useRef(null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            const fileURL = URL.createObjectURL(file);
            setMediaSource(fileURL);
            setIsPlaying(true);
            console.log('Media source set:', fileURL); // Debugging
        },
    });

    useEffect(() => {
        if (mediaRef.current) {
            console.log('Media element:', mediaRef.current); // Debugging
            console.log('Media source:', mediaRef.current.src); // Debugging
        }
    }, [mediaSource]);

    const handlePlayPause = () => {
        if (mediaRef.current) {
            if (isPlaying) {
                mediaRef.current.pause();
            } else {
                mediaRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleStop = () => {
        if (mediaRef.current) {
            mediaRef.current.pause();
            mediaRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    const handleSkip = (seconds) => {
        if (mediaRef.current) {
            mediaRef.current.currentTime += seconds;
        }
    };

    const handleMuteToggle = () => {
        if (mediaRef.current) {
            mediaRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (mediaRef.current) {
            mediaRef.current.volume = newVolume;
        }
    };

    const handleTimeUpdate = () => {
        if (mediaRef.current) {
            setCurrentTime(mediaRef.current.currentTime);
            setDuration(mediaRef.current.duration);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const toggleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    return (
        <div className={`media-player-container ${isMaximized ? 'maximized' : ''}`} {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the media file here...</p>
            ) : (
                <div className="media-player">
                    {mediaSource ? (
                        <>
                            <div className="controls">
                                <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
                                <button onClick={handleStop}>Stop</button>
                                <button onClick={() => handleSkip(-10)}>Skip Back 10s</button>
                                <button onClick={() => handleSkip(10)}>Skip Forward 10s</button>
                                <button onClick={handleMuteToggle}>{isMuted ? 'Unmute' : 'Mute'}</button>
                                <button onClick={toggleMaximize}>{isMaximized ? 'Minimize' : 'Maximize'}</button>
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
                                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                            </div>

                            <div className="media-container">
                                {mediaSource.endsWith('.mp4') ? (
                                    <video
                                        ref={mediaRef}
                                        src={mediaSource}
                                        onTimeUpdate={handleTimeUpdate}
                                        autoPlay={isPlaying}
                                        muted={isMuted}
                                        controls={false}
                                        style={{ width: '100%', height: 'auto' }} // Ensure video is visible
                                    />
                                ) : (
                                    <audio
                                        ref={mediaRef}
                                        src={mediaSource}
                                        onTimeUpdate={handleTimeUpdate}
                                        autoPlay={isPlaying}
                                        muted={isMuted}
                                        controls={false}
                                    />
                                )}
                            </div>
                        </>
                    ) : (
                        <p>Drag and drop a media file to play.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default MediaPlayer;