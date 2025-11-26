import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: "Hello! I'm your calm companion. How are you feeling today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Generate or retrieve userId for session memory
    const getUserId = () => {
        let storedUserId = localStorage.getItem('chat_user_id');
        if (!storedUserId) {
            storedUserId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chat_user_id', storedUserId);
        }
        return storedUserId;
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // Call the backend proxy endpoint with userId
            const response = await axios.post('/api/quiz/chat', {
                message: input,
                userId: getUserId()
            });

            // Assuming N8N returns { output: "response text" } or similar
            // Adjust based on actual N8N response structure
            // Try to find the message in various common keys
            let data = response.data;

            // Handle N8N array response (common)
            if (Array.isArray(data) && data.length > 0) {
                data = data[0];
            }

            const botText = data.output || data.text || data.message || data.answer || data.response || data.reply || (typeof data === 'string' ? data : JSON.stringify(data));

            setMessages(prev => [...prev, { sender: 'bot', text: botText || "Received empty response." }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: "I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="chatbot-window">
            <div className="chatbot-header">
                <h3>Chat Companion</h3>
                <button onClick={onClose} className="close-chat">×</button>
            </div>
            <div className="chatbot-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <div className="message-bubble">
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="message bot">
                        <div className="message-bubble typing">
                            <span>.</span><span>.</span><span>.</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form className="chatbot-input" onSubmit={handleSend}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit" disabled={loading}>Send</button>
            </form>
        </div>
    );
};

export default Chatbot;
