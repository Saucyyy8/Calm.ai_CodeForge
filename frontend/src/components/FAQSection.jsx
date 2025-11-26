import React, { useState } from 'react';
import '../pages/DashboardPage.css'; // We'll use the main dashboard CSS for simplicity

const FAQItem = ({ question, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="faq-item">
            <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
                {question}
                <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </button>
            {isOpen && <div className="faq-answer">{children}</div>}
        </div>
    );
};

const FAQSection = () => {
    return (
        <section className="faq-section">
            <h2 className="section-title">Frequently Asked Questions</h2>

            <div className="faq-category">
                <h3>GENERAL</h3>
                <FAQItem question="What is Calm.ai?">
                    <p>Calm.ai is your personal mental wellness companion that uses AI to recommend music, books, and activities tailored to your current mood. We help you find peace and productivity in one place.</p>
                </FAQItem>
                <FAQItem question="How does the mood detection work?">
                    <p>We use advanced AI algorithms to analyze your responses to our interactive quizzes. Based on your answers, we suggest the perfect content to either match your vibe or lift your spirits.</p>
                </FAQItem>
                <FAQItem question="Is Calm.ai free to use?">
                    <p>Yes! All our core features including music and book recommendations, the chat companion, and relaxation tools are completely free to use.</p>
                </FAQItem>
                <FAQItem question="Do I need an account?">
                    <p>No account is needed to get started. You can jump right in and start exploring our features immediately without any sign-up barriers.</p>
                </FAQItem>
                <FAQItem question="How can I contact support?">
                    <p>You can reach out to our team through the 'Contact Us' section or join our community discord for help, feedback, and feature requests.</p>
                </FAQItem>
            </div>

            <div className="faq-category">
                <h3>FEATURES</h3>
                <FAQItem question="How does the Music Recommender work?">
                    <p>Our AI analyzes your mood and preferences to curate a personalized playlist from Spotify and YouTube that resonates with how you're feeling right now.</p>
                </FAQItem>
                <FAQItem question="Can I get book recommendations?">
                    <p>Absolutely! Our Book Recommender suggests titles based on your interests and emotional state, helping you find your next great read that fits your current headspace.</p>
                </FAQItem>
            </div>

            <div className="faq-category">
                <h3>TOOLS</h3>
                <FAQItem question="What is the 'Learn Java' feature?">
                    <p>It's a calm, linear way to master Java algorithms. We believe learning should be stress-free, so we've designed a distraction-free environment for you to practice coding at your own pace.</p>
                </FAQItem>
                <FAQItem question="What is CalmType?">
                    <p>CalmType is a relaxation tool that uses typing exercises to help you focus your mind and enter a state of flow, reducing anxiety and stress through rhythmic action.</p>
                </FAQItem>
            </div>
        </section>
    );
};

export default FAQSection;
