import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BreatheLoader from '../components/BreatheLoader';
import './DashboardPage.css';

const BookPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('quiz');
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState(null);

    // Mini-quiz state
    const [interestInput, setInterestInput] = useState('');
    const [moodInput, setMoodInput] = useState('');

    const fetchBook = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const combinedMood = `Interested in ${interestInput}, feeling ${moodInput}`;

            await new Promise(resolve => setTimeout(resolve, 2000));
            const response = await axios.post('/api/quiz/book', { mood: combinedMood });
            setRecommendation(response.data);
            setStep('result');
        } catch (error) {
            console.error("Error getting book:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <BreatheLoader />;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>Calm.ai</div>
                <button className="close-btn" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            </header>

            <main className="dashboard-content">
                {step === 'quiz' && (
                    <section className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <h2>Book Preferences</h2>
                        <p>Help us find the perfect story for you.</p>
                        <form onSubmit={fetchBook} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>What topics or genres interest you?</label>
                                <input
                                    type="text"
                                    value={interestInput}
                                    onChange={(e) => setInterestInput(e.target.value)}
                                    placeholder="e.g., Sci-Fi, Self-help, History"
                                    required
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>How are you feeling?</label>
                                <input
                                    type="text"
                                    value={moodInput}
                                    onChange={(e) => setMoodInput(e.target.value)}
                                    placeholder="e.g., Curious, Bored, Need inspiration"
                                    required
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>
                            <button type="submit" className="take-quiz-btn" style={{ marginTop: '1rem' }}>Get Recommendations</button>
                        </form>
                    </section>
                )}

                {step === 'result' && recommendation && (
                    <section className="recommendation-result card" style={{ borderTop: '5px solid #d35400' }}>
                        <h3>Your Book Recommendation</h3>

                        <div className="result-content">
                            {(Array.isArray(recommendation.recommendations) ? recommendation.recommendations : (recommendation.books || [recommendation])).map((item, index) => (
                                <div key={index} className="rec-card book-card">
                                    <div className="rec-icon">📚</div>
                                    <div className="rec-details">
                                        <h4>{item.title || "Unknown Title"}</h4>
                                        <p className="sub-text">{item.author ? `by ${item.author}` : "Unknown Author"}</p>

                                        {item.description && <p className="description">{item.description}</p>}
                                        {item.reason && <p className="reason"><strong>Why:</strong> {item.reason}</p>}

                                        {item.link && (
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="rec-link" style={{ backgroundColor: '#d35400' }}>
                                                Read More
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {(recommendation.motivating_message || recommendation.message) && (
                                <div className="motivating-message">
                                    <p>✨ {recommendation.motivating_message || recommendation.message} ✨</p>
                                </div>
                            )}

                            <button className="close-btn" onClick={() => setStep('quiz')}>Try Again</button>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default BookPage;
