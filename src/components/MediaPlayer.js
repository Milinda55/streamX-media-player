import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaPlay, FaPause, FaStop, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress } from 'react-icons/fa';

const MediaPlayer = () => {
    const [mediaSource, setMediaSource] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const mediaRef = useRef(null);
    const playerRef = useRef(null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            const fileURL = URL.createObjectURL(file);
            setMediaSource(fileURL);
            setIsPlaying(true);
        },
        noClick: true, // Prevent file selector from opening on clicks
    });

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

    const handleProgressChange = (e) => {
        if (mediaRef.current) {
            mediaRef.current.currentTime = (e.target.value / 100) * duration;
        }
    };

    const toggleFullscreen = () => {
        if (playerRef.current) {
            if (!isFullscreen) {
                playerRef.current.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
            setIsFullscreen(!isFullscreen);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div
            className={`bg-gray-900 rounded-lg shadow-lg overflow-hidden ${isFullscreen ? 'w-screen h-screen' : 'w-[800px] h-[600px]'}`}
            ref={playerRef}
        >
            <div className="h-full flex flex-col">
                <div className="flex-1 relative">
                    {mediaSource ? (
                        <video
                            ref={mediaRef}
                            src={mediaSource}
                            onTimeUpdate={handleTimeUpdate}
                            autoPlay={isPlaying}
                            muted={isMuted}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div
                            {...getRootProps()}
                            className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-colors ${
                                isDragActive ? 'bg-gray-700' : 'bg-gray-800'
                            }`}
                            onClick={() => document.getElementById('file-input').click()}
                        >
                            <input {...getInputProps()} id="file-input" />
                            <p className="text-white text-lg mb-4">
                                {isDragActive ? 'Drop the media file here...' : 'Click or drag and drop a media file to play'}
                            </p>
                            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                                <FaPlay size={24} className="text-white" />
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-gray-800">
                    <div className="flex items-center space-x-6">
                        <button onClick={handlePlayPause} className="text-white">
                            {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
                        </button>
                        <button onClick={handleStop} className="text-white">
                            <FaStop size={24} />
                        </button>
                        <button onClick={() => handleSkip(-10)} className="text-white">
                            -10s
                        </button>
                        <button onClick={() => handleSkip(10)} className="text-white">
                            +10s
                        </button>
                        <button onClick={handleMuteToggle} className="text-white">
                            {isMuted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-24"
                        />
                        <span className="text-white">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
                    </div>
                    <div className="flex items-center mt-2">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={(currentTime / duration) * 100 || 0}
                            onChange={handleProgressChange}
                            className="flex-1"
                        />
                        <button onClick={toggleFullscreen} className="text-white ml-4">
                            {isFullscreen ? <FaCompress size={24} /> : <FaExpand size={24} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaPlayer;