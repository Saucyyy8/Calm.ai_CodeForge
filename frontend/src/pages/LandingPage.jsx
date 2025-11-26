import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <div className="hero-content">
                <h1 className="title">Calm.ai</h1>
                <p className="subtitle">Find your peace. Understand your mind.</p>
                <button className="start-btn" onClick={() => navigate('/quiz')}>
                    Begin Your Journey
                </button>
            </div>
        </div>
    );
};

export default LandingPage;
