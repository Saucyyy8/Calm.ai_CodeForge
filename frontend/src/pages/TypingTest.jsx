import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TypingTest.css';

const WORDS_LIST = [
    "the", "be", "of", "and", "a", "to", "in", "he", "have", "it", "that", "for", "they", "with", "as", "not", "on", "she", "at", "by", "this", "we", "you", "do", "but", "from", "or", "which", "one", "would", "all", "will", "there", "say", "who", "make", "when", "can", "more", "if", "no", "man", "out", "other", "so", "what", "time", "up", "go", "about", "than", "into", "could", "state", "only", "new", "year", "some", "take", "come", "these", "know", "see", "use", "get", "like", "then", "first", "any", "work", "now", "may", "such", "give", "over", "think", "most", "even", "find", "day", "also", "after", "way", "many", "must", "look", "before", "great", "back", "through", "long", "where", "much", "should", "well", "people", "down", "own", "just", "because", "good", "each", "those", "feel", "seem", "how", "high", "too", "place", "little", "world", "very", "still", "nation", "hand", "old", "life", "tell", "write", "become", "here", "show", "house", "both", "between", "need", "mean", "call", "develop", "under", "last", "right", "move", "thing", "general", "school", "never", "same", "another", "begin", "while", "number", "part", "turn", "real", "leave", "might", "want", "point", "form", "off", "child", "few", "small", "since", "against", "ask", "late", "home", "interest", "large", "person", "end", "open", "public", "follow", "during", "present", "without", "again", "hold", "govern", "around", "possible", "head", "consider", "word", "program", "problem", "however", "lead", "system", "set", "order", "eye", "plan", "run", "keep", "face", "fact", "group", "play", "stand", "increase", "early", "course", "change", "help", "line"
];

const GAME_DURATION = 10;

const TypingTest = () => {
    const navigate = useNavigate();
    const [words, setWords] = useState([]);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [status, setStatus] = useState('waiting'); // waiting, playing, finished
    const [currInput, setCurrInput] = useState('');
    const [currWordIndex, setCurrWordIndex] = useState(0);
    const [currCharIndex, setCurrCharIndex] = useState(-1);
    const [correctCharCount, setCorrectCharCount] = useState(0);
    const [incorrectCharCount, setIncorrectCharCount] = useState(0);
    const [history, setHistory] = useState({}); // { wordIndex: { charIndex: boolean } }

    const inputRef = useRef(null);

    const generateWords = useCallback(() => {
        const shuffled = [...WORDS_LIST].sort(() => 0.5 - Math.random());
        setWords(shuffled.slice(0, 100));
    }, []);

    useEffect(() => {
        generateWords();
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [generateWords]);

    useEffect(() => {
        let interval;
        if (status === 'playing' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setStatus('finished');
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [status, timeLeft]);

    const start = () => {
        if (status === 'finished') {
            setWords([]);
            generateWords();
            setCurrWordIndex(0);
            setCurrCharIndex(-1);
            setCurrInput('');
            setHistory({});
            setCorrectCharCount(0);
            setIncorrectCharCount(0);
            setTimeLeft(GAME_DURATION);
        }

        if (status !== 'playing') {
            setStatus('playing');
        }
    };

    const handleKeyDown = (e) => {
        if (status === 'finished') return;

        // Focus input if user clicks anywhere and starts typing
        if (document.activeElement !== inputRef.current) {
            inputRef.current.focus();
        }

        if (status === 'waiting') {
            start();
        }

        const { key } = e;
        const currentWord = words[currWordIndex];

        // Handle Backspace
        if (key === 'Backspace') {
            if (currInput.length > 0) {
                // Removing character from current word
                const newCharIndex = currCharIndex - 1;
                setCurrCharIndex(newCharIndex);
                setCurrInput(currInput.slice(0, -1));

                // Remove from history
                const newHistory = { ...history };
                if (newHistory[currWordIndex]) {
                    delete newHistory[currWordIndex][currCharIndex];
                }
                setHistory(newHistory);
            } else if (currWordIndex > 0) {
                // Go back to previous word (optional, but standard behavior usually blocks this or allows it)
                // For simplicity, we'll block going back to previous words for now like some modes of monkeytype
                // Or we can allow it but it gets complicated. Let's stick to current word editing only for MVP.
            }
            return;
        }

        // Handle Space (Next Word)
        if (key === ' ') {
            e.preventDefault(); // Prevent scroll
            if (currInput.trim() === '') return; // Don't allow empty words

            // Check remaining chars in current word as incorrect if skipped? 
            // Monkeytype usually just moves on.

            setCurrWordIndex(currWordIndex + 1);
            setCurrInput('');
            setCurrCharIndex(-1);
            return;
        }

        // Handle Character Input
        if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const charToType = currentWord[currCharIndex + 1];
            const isCorrect = key === charToType;

            // Update stats
            if (isCorrect) {
                setCorrectCharCount(prev => prev + 1);
            } else {
                setIncorrectCharCount(prev => prev + 1);
            }

            const newCharIndex = currCharIndex + 1;
            setCurrCharIndex(newCharIndex);
            setCurrInput(currInput + key);

            setHistory(prev => ({
                ...prev,
                [currWordIndex]: {
                    ...prev[currWordIndex],
                    [newCharIndex]: isCorrect
                }
            }));

            // Auto-advance if word is complete and correct? 
            // Usually typing games require space, but some auto-advance. We'll stick to space requirement.
        }
    };

    const calculateWPM = () => {
        const minutes = (GAME_DURATION - timeLeft) / 60;
        if (minutes === 0) return 0;
        const wpm = Math.round((correctCharCount / 5) / ((GAME_DURATION - 0) / 60)); // Standard WPM formula
        return wpm;
    };

    const calculateAccuracy = () => {
        const total = correctCharCount + incorrectCharCount;
        if (total === 0) return 100;
        return Math.round((correctCharCount / total) * 100);
    };

    const restartGame = () => {
        setStatus('finished'); // Trigger reset logic in start()
        start();
    };

    return (
        <div className="typing-container" onClick={() => inputRef.current && inputRef.current.focus()}>
            <header className="typing-header">
                <div className="typing-logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                    Calm.ai
                </div>
                <div className="stats-bar">
                    <span className="timer" style={{ fontSize: '1.2rem', fontWeight: 'normal', letterSpacing: '1px' }}>Stay calm and flow...</span>
                </div>
                <div className="page-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-color)' }}>
                    Serene Keys
                </div>
            </header>

            <div className={`game-area ${status === 'finished' ? 'blur-overlay' : ''}`}>
                <div className="word-display">
                    {words.map((word, wIndex) => {
                        // Only render a window of words around current index to improve performance/focus
                        if (wIndex < currWordIndex - 10 || wIndex > currWordIndex + 30) return null;

                        return (
                            <div key={wIndex} className={`word ${wIndex === currWordIndex ? 'active' : ''}`}>
                                {word.split('').map((char, cIndex) => {
                                    let className = 'char';
                                    const isTyped = history[wIndex] && history[wIndex][cIndex] !== undefined;
                                    const isCorrect = isTyped && history[wIndex][cIndex];
                                    const isIncorrect = isTyped && !history[wIndex][cIndex];

                                    if (isCorrect) className += ' correct';
                                    if (isIncorrect) className += ' incorrect';
                                    if (wIndex === currWordIndex && cIndex === currCharIndex + 1) className += ' active'; // Cursor

                                    return <span key={cIndex} className={className}>{char}</span>;
                                })}
                                {/* Show extra incorrect chars if user typed more than word length */}
                                {wIndex === currWordIndex && currInput.length > word.length && (
                                    currInput.slice(word.length).split('').map((char, i) => (
                                        <span key={`extra-${i}`} className="char incorrect">{char}</span>
                                    ))
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <input
                ref={inputRef}
                type="text"
                className="hidden-input"
                value={currInput}
                onKeyDown={handleKeyDown}
                onChange={() => { }} // Handled by onKeyDown
                autoFocus
            />

            {status === 'finished' && (
                <div className="results-modal">
                    <div className="results-content">
                        <h2>Time's Up!</h2>
                        <div className="stat-grid">
                            <div className="stat-item">
                                <span className="stat-label">WPM</span>
                                <span className="stat-value">{calculateWPM()}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Accuracy</span>
                                <span className="stat-value">{calculateAccuracy()}%</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Correct Chars</span>
                                <span className="stat-value">{correctCharCount}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Incorrect Chars</span>
                                <span className="stat-value">{incorrectCharCount}</span>
                            </div>
                        </div>
                        <button className="restart-btn" onClick={restartGame}>Try Again</button>
                        <p className="restart-hint">Press Tab + Enter to restart quickly</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TypingTest;
