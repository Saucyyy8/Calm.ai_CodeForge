import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BreatheLoader from '../components/BreatheLoader';
import './QuizPage.css';

const QuizPage = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // Simulate a delay to show the breathe animation
                await new Promise(resolve => setTimeout(resolve, 2000));
                const response = await axios.get('/api/quiz');
                setQuestions(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching questions:", error);
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
            // Simulate a delay for processing
            await new Promise(resolve => setTimeout(resolve, 3000));
            const response = await axios.post('/api/quiz', finalAnswers);
            // Navigate to dashboard with the mood result
            // The backend returns a Map, likely containing the mood or analysis
            navigate('/dashboard', { state: { moodData: response.data } });
        } catch (error) {
            console.error("Error submitting quiz:", error);
            setLoading(false);
        }
    };

    if (loading) {
        return <BreatheLoader />;
    }

    if (questions.length === 0) {
        return <div className="error-msg">Unable to load questions. Please try again later.</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="quiz-container">
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
            </div>

            <div className="question-card card">
                <h2 className="question-text">{currentQuestion.ques}</h2>
                <div className="options-grid">
                    {[currentQuestion.opt1, currentQuestion.opt2, currentQuestion.opt3, currentQuestion.opt4].map((opt, idx) => (
                        <button
                            key={idx}
                            className="option-btn"
                            onClick={() => handleOptionSelect(opt)}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
