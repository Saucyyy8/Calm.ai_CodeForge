import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BreatheLoader from '../components/BreatheLoader';
import Chatbot from '../components/Chatbot';
import './DashboardPage.css';

const DashboardPage = () => {
    const location = useLocation();
    const moodData = location.state?.moodData || { mood: "Unknown" }; // Fallback
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState(null);
    const [activeTab, setActiveTab] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const getMusic = async () => {
        setLoading(true);
        setActiveTab('music');
        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Breathe animation time
            const response = await axios.post('/api/quiz/music', { mood: moodData.mood || "Neutral" });
            setRecommendation(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error getting music:", error);
            setLoading(false);
        }
    };

    const getBook = async () => {
        setLoading(true);
        setActiveTab('book');
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const response = await axios.post('/api/quiz/book', { mood: moodData.mood || "Neutral" });
            setRecommendation(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error getting book:", error);
            setLoading(false);
        }
    };

    if (loading) {
        return <BreatheLoader />;
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="logo">Calm.ai</div>
                <div className="user-profile">
                    <span>Welcome, Friend</span>
                    <div className="avatar"></div>
                </div>
            </header>

            <main className="dashboard-content">
                <section className="mood-section card">
                    <h2>Your Current State</h2>
                    <div className="mood-display">
                        <p>Based on your answers, you seem to be feeling:</p>
                        <h3 className="mood-text">{moodData.mood || "Reflective"}</h3>
                        <p className="mood-desc">{moodData.description || "Take a moment to breathe."}</p>
                    </div>
                </section>

                <section className="tools-grid">
                    <div className="tool-card card" onClick={getMusic}>
                        <h3>🎵 Music Recommender</h3>
                        <p>Find tunes to match or lift your mood.</p>
                    </div>
                    <div className="tool-card card" onClick={getBook}>
                        <h3>📚 Book Recommender</h3>
                        <p>Discover stories that resonate with you.</p>
                    </div>
                    <div className="tool-card card" onClick={() => setIsChatOpen(true)}>
                        <h3>🤖 Chat Companion</h3>
                        <p>Talk to our AI friend.</p>
                    </div>
                    <div className="tool-card card" onClick={() => window.location.href = '/todo'}>
                        <h3>📝 To-Do List</h3>
                        <p>Organize your tasks and clear your mind.</p>
                    </div>
                    <div className="tool-card card" onClick={() => window.location.href = '/typing-test'}>
                        <h3>⌨️ CalmType</h3>
                        <p>Focus your mind with a typing flow test.</p>
                    </div>
                    <div className="tool-card card" onClick={() => window.location.href = '/learn-java'}>
                        <h3>☕ Learn Java</h3>
                        <p>Master algorithms with a calm, linear flow.</p>
                    </div>
                    <div className="tool-card card disabled">
                        <h3>🗑️ Anxiety Shredder</h3>
                        <p>Coming Soon</p>
                    </div>
                </section>

                {recommendation && (
                    <section className="recommendation-result card">
                        <h3>Your Recommendation ({activeTab === 'music' ? 'Music' : 'Book'})</h3>

                        <div className="result-content">
                            {/* Handle Music Playlist Structure */}
                            {activeTab === 'music' && recommendation.playlist ? (
                                <>
                                    <div className="music-visualizer">
                                        <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXJvM3JvM3JvM3JvM3JvM3JvM3JvM3JvM3JvM3JvMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3o7TKSjRrfIPjeiVyM/giphy.gif" alt="Music Vibes" className="music-gif" />
                                    </div>
                                    {recommendation.playlist.map((item, index) => (
                                        <div key={index} className="rec-card music-card">
                                            <div className="rec-icon">🎵</div>
                                            <div className="rec-details">
                                                <h4>{item.title || "Unknown Track"}</h4>
                                                <p className="sub-text">{item.artist || "Unknown Artist"}</p>

                                                {item.vibe_check && <p className="reason"><strong>Vibe Check:</strong> {item.vibe_check}</p>}

                                                <div className="links-container">
                                                    {item.links?.spotify && (
                                                        <a href={item.links.spotify} target="_blank" rel="noopener noreferrer" className="rec-link spotify">
                                                            Listen on Spotify
                                                        </a>
                                                    )}
                                                    {item.links?.youtube && (
                                                        <a href={item.links.youtube} target="_blank" rel="noopener noreferrer" className="rec-link youtube">
                                                            Watch on YouTube
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                /* Fallback / Book Structure (assuming books might still use the old or a different format, or we can adapt) */
                                (Array.isArray(recommendation.recommendations) ? recommendation.recommendations : (recommendation.books || [recommendation])).map((item, index) => (
                                    <div key={index} className={`rec-card ${activeTab === 'music' ? 'music-card' : 'book-card'}`}>
                                        <div className="rec-icon">{activeTab === 'music' ? '🎵' : '📚'}</div>
                                        <div className="rec-details">
                                            <h4>{item.title || "Unknown Title"}</h4>
                                            <p className="sub-text">{activeTab === 'music' ? (item.artist || "Unknown Artist") : (item.author ? `by ${item.author}` : "Unknown Author")}</p>

                                            {item.description && <p className="description">{item.description}</p>}
                                            {item.reason && <p className="reason"><strong>Why:</strong> {item.reason}</p>}

                                            {item.link && (
                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="rec-link">
                                                    {activeTab === 'music' ? 'Listen' : 'Read More'}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {(recommendation.motivating_message || recommendation.message) && (
                            <div className="motivating-message">
                                <p>✨ {recommendation.motivating_message || recommendation.message} ✨</p>
                            </div>
                        )}

                        <button className="close-btn" onClick={() => setRecommendation(null)}>Close</button>
                    </section>
                )}
            </main>

            {/* Chatbot Component */}
            <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

            {/* Floating Toggle Button (visible when chat is closed) */}
            {!isChatOpen && (
                <button className="chatbot-toggle" onClick={() => setIsChatOpen(true)}>
                    💬
                </button>
            )}
        </div>
    );
};

export default DashboardPage;
