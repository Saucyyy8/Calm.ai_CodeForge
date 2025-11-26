import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Chatbot from '../components/Chatbot';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import './DashboardPage.css';

const DashboardPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const moodData = location.state || {}; // Empty object if no state
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleToolClick = (type) => {
        // Allow direct access to tools, they will handle their own "quiz"
        if (type === 'music') {
            navigate('/music');
        } else if (type === 'book') {
            navigate('/book');
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Calm.ai</div>
                <div className="user-profile">
                    <span>Welcome, Friend</span>
                    <div className="avatar"></div>
                </div>
            </header>

            <main className="dashboard-content">
                <section className="hero-section">
                    <div className="hero-background" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3540&auto=format&fit=crop')" }}></div>
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                        {moodData.mood ? (
                            <div className="mood-display">
                                <p className="hero-subtitle">Based on your answers, you seem to be feeling:</p>
                                <h1 className="hero-title">{moodData.mood}</h1>
                                <p className="hero-desc">{moodData.description || "Take a moment to breathe."}</p>
                            </div>
                        ) : (
                            <div className="mood-display">
                                <h1 className="hero-title">Calm your mind. Change your life.</h1>
                                <p className="hero-subtitle">Mental health is hard. Getting support doesn't need to be.</p>
                                <button className="take-quiz-btn" onClick={() => navigate('/quiz')}>
                                    Check Your Mood
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                <section className="tools-grid">
                    <div className="tool-card card" onClick={() => handleToolClick('music')}>
                        <h3>🎵 Music Recommender</h3>
                        <p>Find tunes to match or lift your mood.</p>
                    </div>
                    <div className="tool-card card" onClick={() => handleToolClick('book')}>
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
                    <div className="tool-card card disabled">
                        <h3>🗑️ Anxiety Shredder</h3>
                        <p>Coming Soon</p>
                    </div>
                </section>

                {/* Blogs Section */}
                <section className="blogs-section">
                    <h2 className="section-title">Check out our blog for more resources.</h2>
                    <div className="blogs-grid">
                        <a href="https://www.calm.com/blog/what-does-nihilism-mean" target="_blank" rel="noopener noreferrer" className="blog-card">
                            <div className="blog-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2574&auto=format&fit=crop')" }}></div>
                            <div className="blog-content">
                                <span className="blog-category">Mental Health</span>
                                <h3>What does nihilism mean? Plus, how it can affect your life</h3>
                            </div>
                        </a>
                        <a href="https://www.calm.com/blog/what-is-stoicism" target="_blank" rel="noopener noreferrer" className="blog-card">
                            <div className="blog-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2670&auto=format&fit=crop')" }}></div>
                            <div className="blog-content">
                                <span className="blog-category">Personal Growth</span>
                                <h3>What is Stoicism? Plus, 12 ways to use it in your everyday life</h3>
                            </div>
                        </a>
                        <a href="https://www.calm.com/blog/christmas-party-ideas" target="_blank" rel="noopener noreferrer" className="blog-card">
                            <div className="blog-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513297887119-d46091b24bfa?q=80&w=2670&auto=format&fit=crop')" }}></div>
                            <div className="blog-content">
                                <span className="blog-category">Holidays</span>
                                <h3>Christmas Party Ideas: 12 ways to celebrate mindfully</h3>
                            </div>
                        </a>
                        {/* New Blogs */}
                        <a href="https://www.calm.com/blog/christmas-gift-ideas" target="_blank" rel="noopener noreferrer" className="blog-card">
                            <div className="blog-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=2669&auto=format&fit=crop')" }}></div>
                            <div className="blog-content">
                                <span className="blog-category">Holidays</span>
                                <h3>Christmas Gift Ideas: 10 mindful gifts for everyone on your list</h3>
                            </div>
                        </a>
                        <a href="https://www.calm.com/blog/winter-solstice-celebration" target="_blank" rel="noopener noreferrer" className="blog-card">
                            <div className="blog-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1483664852095-d6cc6870702d?q=80&w=2670&auto=format&fit=crop')" }}></div>
                            <div className="blog-content">
                                <span className="blog-category">Seasonal</span>
                                <h3>Winter Solstice Celebration: Rituals to welcome the return of light</h3>
                            </div>
                        </a>
                        <a href="https://www.calm.com/blog/christmas-mindfulness" target="_blank" rel="noopener noreferrer" className="blog-card">
                            <div className="blog-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=2574&auto=format&fit=crop')" }}></div>
                            <div className="blog-content">
                                <span className="blog-category">Mindfulness</span>
                                <h3>Christmas Mindfulness: 5 tips for a calmer holiday season</h3>
                            </div>
                        </a>
                    </div>
                </section>

                {/* Reviews Section */}
                <section className="reviews-section">
                    <h2 className="section-title">Over 2 million 5-star reviews.</h2>
                    <div className="reviews-grid">
                        <div className="review-card">
                            <div className="quote-icon">“</div>
                            <p className="review-text">When I cannot fall asleep, I turn on this app and am out within 5 minutes.</p>
                            <p className="review-author">Brandy from Houston</p>
                            <div className="stars">★★★★★</div>
                        </div>
                        <div className="review-card">
                            <div className="quote-icon">“</div>
                            <p className="review-text">I have a very busy brain and can find it hard to unwind. Now a daily practice is actually so wonderful and healing for me.</p>
                            <p className="review-author">John from Chicago</p>
                            <div className="stars">★★★★★</div>
                        </div>
                        <div className="review-card">
                            <div className="quote-icon">“</div>
                            <p className="review-text">Calm has completely changed how I start my day. I feel more connected and grounded.</p>
                            <p className="review-author">Allison from New York</p>
                            <div className="stars">★★★★★</div>
                        </div>
                        {/* New Reviews */}
                        <div className="review-card">
                            <div className="quote-icon">“</div>
                            <p className="review-text">The sleep stories are a game changer. I've never slept better in my life.</p>
                            <p className="review-author">Michael from London</p>
                            <div className="stars">★★★★★</div>
                        </div>
                        <div className="review-card">
                            <div className="quote-icon">“</div>
                            <p className="review-text">A must-have app for anyone dealing with stress. The meditations are short and effective.</p>
                            <p className="review-author">Sarah from Toronto</p>
                            <div className="stars">★★★★★</div>
                        </div>
                        <div className="review-card">
                            <div className="quote-icon">“</div>
                            <p className="review-text">I love the variety of content. There's always something new to discover.</p>
                            <p className="review-author">David from Sydney</p>
                            <div className="stars">★★★★★</div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <FAQSection />
            </main>

            {/* Footer */}
            <Footer />

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
