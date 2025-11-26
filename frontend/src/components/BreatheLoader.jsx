import React, { useState, useEffect } from 'react';
import './BreatheLoader.css';

const BreatheLoader = () => {
    const [text, setText] = useState("Breathe In...");

    useEffect(() => {
        const interval = setInterval(() => {
            setText((prev) => (prev === "Breathe In..." ? "Breathe Out..." : "Breathe In..."));
        }, 2000); // Sync with half of CSS animation duration (4s)

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="breathe-container">
            <div className="circle"></div>
            <div className="text">{text}</div>
        </div>
    );
};

export default BreatheLoader;
