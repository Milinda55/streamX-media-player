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

    return (
        <div className="media-player-container" >

            <div className="media-player">
                {mediaSource && (
                    <>
                        <div className="controls">

                        </div>

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
