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
                <FAQItem question="What is Calm?">
                    <p>Calm is the #1 app for sleep, meditation and relaxation. Join the millions experiencing lower stress, less anxiety, and more restful sleep with our guided meditations, Sleep Stories, breathing programs, masterclasses and relaxing music.</p>
                </FAQItem>
                <FAQItem question="What's included in a Calm subscription?">
                    <p>A subscription gives you unlimited access to our entire library of content, including hundreds of guided meditations, Sleep Stories, music tracks, and masterclasses.</p>
                </FAQItem>
                <FAQItem question="Where should I get started once I download the app?">
                    <p>We recommend starting with the "Daily Calm," a 10-minute daily meditation to help you build a consistent practice.</p>
                </FAQItem>
                <FAQItem question="What devices support the Calm app?">
                    <p>Calm is available on iOS, Android, and via our website on desktop computers. We also have integrations with Apple Watch, Sonos, and more.</p>
                </FAQItem>
                <FAQItem question="How do I cancel?">
                    <p>You can cancel your subscription at any time through your account settings on the platform where you purchased it (Apple App Store, Google Play Store, or Calm.com).</p>
                </FAQItem>
            </div>

            <div className="faq-category">
                <h3>MEDITATION & MINDFULNESS</h3>
                <FAQItem question="What is meditation?">
                    <p>Meditation is a practice where an individual uses a technique – such as mindfulness, or focusing the mind on a particular object, thought, or activity – to train attention and awareness, and achieve a mentally clear and emotionally calm and stable state.</p>
                </FAQItem>
                <FAQItem question="What is mindfulness?">
                    <p>Mindfulness is the basic human ability to be fully present, aware of where we are and what we’re doing, and not overly reactive or overwhelmed by what’s going on around us.</p>
                </FAQItem>
            </div>

            <div className="faq-category">
                <h3>SOUNDSCAPES</h3>
                <FAQItem question="How do different sound frequencies affect your brain?">
                    <p>Different sound frequencies can help induce different brainwave states, such as relaxation (alpha waves) or deep sleep (delta waves).</p>
                </FAQItem>
                <FAQItem question="How do binaural beats help improve focus and reduce anxiety?">
                    <p>Binaural beats involve playing two slightly different frequencies in each ear, which the brain perceives as a single new frequency. This can help entrain the brain to desired states of focus or relaxation.</p>
                </FAQItem>
            </div>
        </section>
    );
};

export default FAQSection;
