import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BreatheLoader from '../components/BreatheLoader';
import { FaSpotify, FaYoutube } from 'react-icons/fa';
import './DashboardPage.css';

const MusicPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('quiz'); // 'quiz' or 'result'
    const [loading, setLoading] = useState(true);
    const [recommendation, setRecommendation] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const response = await axios.get('/api/quiz/music/questions');
                setQuestions(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching music questions:", error);
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleOptionSelect = (option) => {
        const newAnswers = [...answers, option];
        setAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            submitQuiz(newAnswers);
        }
    };

    const submitQuiz = async (finalAnswers) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const response = await axios.post('/api/quiz/music', finalAnswers);
            setRecommendation(response.data);
            setStep('result');
        } catch (error) {
            console.error("Error getting music:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <BreatheLoader />;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>Calm.ai</div>
                <button className="nav-btn" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            </header>

            <main className="dashboard-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                {step === 'quiz' && questions.length > 0 && (
                    <div className="quiz-container" style={{ width: '100%', maxWidth: '700px', background: 'white', padding: '3rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <div className="progress-bar" style={{ marginBottom: '2.5rem', height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
                                    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            ></div>
                        </div>

                        <div className="question-card">
                            <h2 className="question-text" style={{ fontSize: '2rem', marginBottom: '2.5rem', color: '#333', fontWeight: '700', lineHeight: '1.3' }}>
                                {questions[currentQuestionIndex].ques}
                            </h2>
                            <div className="options-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                {[questions[currentQuestionIndex].opt1, questions[currentQuestionIndex].opt2, questions[currentQuestionIndex].opt3, questions[currentQuestionIndex].opt4].map((opt, idx) => (
                                    <button
                                        key={idx}
                                        className="option-btn"
                                        onClick={() => handleOptionSelect(opt)}
                                        style={{
                                            padding: '1.2rem 2rem',
                                            fontSize: '1.1rem',
                                            border: '2px solid #f0f0f0',
                                            borderRadius: '12px',
                                            background: 'white',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            fontWeight: '500',
                                            color: '#555',
                                            textAlign: 'left',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.borderColor = '#2575fc';
                                            e.currentTarget.style.background = '#f8faff';
                                            e.currentTarget.style.color = '#2575fc';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 117, 252, 0.1)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.borderColor = '#f0f0f0';
                                            e.currentTarget.style.background = 'white';
                                            e.currentTarget.style.color = '#555';
                                            e.currentTarget.style.transform = 'none';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        {opt}
                                        <span style={{ opacity: 0.5 }}>→</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 'result' && recommendation && (
                    <section className="recommendation-result" style={{ width: '100%', maxWidth: '800px', animation: 'fadeIn 0.5s ease' }}>
                        <div className="result-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your Sonic Vibe</h2>
                            {(recommendation.motivating_message || recommendation.message) && (
                                <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                                    {recommendation.motivating_message || recommendation.message}
                                </p>
                            )}
                        </div>

                        <div className="playlist-grid" style={{ display: 'grid', gap: '1.5rem' }}>
                            {recommendation.playlist ? (
                                recommendation.playlist.map((item, index) => (
                                    <div key={index} className="track-card" style={{
                                        background: 'white',
                                        padding: '1.5rem',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.5rem',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                        border: '1px solid #f0f0f0'
                                    }}>
                                        <div className="track-icon" style={{
                                            width: '60px',
                                            height: '60px',
                                            background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '1.5rem',
                                            flexShrink: 0
                                        }}>
                                            🎵
                                        </div>
                                        <div className="track-info" style={{ flex: 1 }}>
                                            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.3rem', color: '#333' }}>{item.title || "Unknown Track"}</h4>
                                            <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{item.artist || "Unknown Artist"}</p>
                                            {item.vibe_check && <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>"{item.vibe_check}"</p>}
                                        </div>
                                        <div className="track-actions" style={{ display: 'flex', gap: '0.8rem' }}>
                                            {item.links?.spotify && (
                                                <a href={item.links.spotify} target="_blank" rel="noopener noreferrer"
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: '44px',
                                                        height: '44px',
                                                        borderRadius: '50%',
                                                        background: '#1DB954',
                                                        color: 'white',
                                                        fontSize: '1.4rem',
                                                        transition: 'transform 0.2s'
                                                    }}
                                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                                    title="Listen on Spotify"
                                                >
                                                    <FaSpotify />
                                                </a>
                                            )}
                                            {item.links?.youtube && (
                                                <a href={item.links.youtube} target="_blank" rel="noopener noreferrer"
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: '44px',
                                                        height: '44px',
                                                        borderRadius: '50%',
                                                        background: '#FF0000',
                                                        color: 'white',
                                                        fontSize: '1.4rem',
                                                        transition: 'transform 0.2s'
                                                    }}
                                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                                    title="Watch on YouTube"
                                                >
                                                    <FaYoutube />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', color: '#666' }}>No playlist found. Try again later.</p>
                            )}
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <button
                                onClick={() => {
                                    setStep('quiz');
                                    setCurrentQuestionIndex(0);
                                    setAnswers([]);
                                    setRecommendation(null);
                                }}
                                style={{
                                    padding: '1rem 2.5rem',
                                    fontSize: '1.1rem',
                                    background: 'white',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '30px',
                                    color: '#666',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={e => {
                                    e.currentTarget.style.borderColor = '#333';
                                    e.currentTarget.style.color = '#333';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.borderColor = '#e0e0e0';
                                    e.currentTarget.style.color = '#666';
                                }}
                            >
                                Start New Quiz
                            </button>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default MusicPage;
