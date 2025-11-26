import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RainyHomePage.css';

const RainyHomePage = () => {
    const navigate = useNavigate();
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // Attempt to autoplay audio
        const playAudio = async () => {
            if (audioRef.current) {
                try {
                    await audioRef.current.play();
                    setIsPlaying(true);
                } catch (err) {
                    console.log("Autoplay prevented by browser, waiting for user interaction");
                }
            }
        };
        playAudio();
    }, []);

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="rainy-home-container">
            <div className="background-overlay"></div>

            {/* Background Video */}
            <video autoPlay loop muted className="background-video">
                <source src="/assets/BeachVideo.mp4" type="video/mp4" />
            </video>

            <div className="content-wrapper">
                <h1 className="title">Serene Shores</h1>
                <p className="subtitle">Let the waves wash away your worries.</p>

                <button className="mood-btn" onClick={() => navigate('/dashboard')}>
                    Check Your Mood
                </button>

                <div className="audio-controls">
                    <button className="audio-btn" onClick={toggleAudio}>
                        {isPlaying ? '❚❚ Pause Music' : '▶ Play Music'}
                    </button>
                </div>
            </div>

            <audio ref={audioRef} loop>
                <source src="/assets/RelaxingMusic.mp3" type="audio/mp3" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
};

export default RainyHomePage;
