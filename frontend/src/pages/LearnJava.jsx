import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './LearnJava.css';

const PROBLEMS = [
    {
        id: 'two-sum',
        title: 'Level 1: The Vending Machine (Two Sum)',
        icon: '🤖',
        story: `Beep boop! I'm Java Bot. I'm super hungry! 
        
I have a pocket full of coins (array \`nums\`), but this picky vending machine only accepts exactly two coins that add up to the price (\`target\`). 

Can you help me pick the indices of the right pair so I can get my snack?`,
        example: `Input: nums = [2,7,11,15], target = 9
Output: [0,1] (Because 2 + 7 = 9)`,
        defaultCode: `public int[] twoSum(int[] nums, int target) {
    // Help Java Bot find the snack!
    // Return the indices of the two numbers.
    
}`
    },
    {
        id: 'reverse-list',
        title: 'Level 2: The Conga Line (Reverse Linked List)',
        icon: '💃',
        story: `Oh no! The party conga line is moving backwards! 😱
        
The leader (\`head\`) is at the wrong end, and everyone is facing the wrong way. 

Can you reverse the links so we can dance forward?`,
        example: `Input: 1 -> 2 -> 3 -> 4 -> 5
Output: 5 -> 4 -> 3 -> 2 -> 1`,
        defaultCode: `public ListNode reverseList(ListNode head) {
    // Flip the dancers around!
    
}`
    },
    {
        id: 'palindrome',
        title: 'Level 3: The Mirror Gate (Palindrome Number)',
        icon: '🪞',
        story: `We've reached the Magic Mirror Gate! ✨
        
It only opens for numbers that look exactly the same in a reflection (palindromes). 

Check if the number \`x\` is worthy to pass through the gate.`,
        example: `Input: 121 -> True (It matches!)
Input: 10 -> False (01 isn't 10)`,
        defaultCode: `public boolean isPalindrome(int x) {
    // Is it a mirror match?
    
}`
    }
];

const HINTS = [
    "Hmm, try printing your variables to see what's happening!",
    "Are you checking for edge cases? What if the list is empty?",
    "Don't give up! Maybe try a loop?",
    "Check your return types. The machine is picky!",
    "Remember, arrays start at index 0!"
];

const SUCCESS_MSGS = [
    "Yum! That snack was delicious! 🍫",
    "The party is saved! Let's dance! 💃",
    "The gate opens! You are a wizard! 🧙‍♂️"
];

const LearnJava = () => {
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [code, setCode] = useState(PROBLEMS[0].defaultCode);
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);

    // Dialog State
    const [showDialog, setShowDialog] = useState(false);
    const [dialogType, setDialogType] = useState('success');
    const [dialogMessage, setDialogMessage] = useState('');

    const currentProblem = PROBLEMS[currentProblemIndex];

    const handleEditorChange = (value) => {
        setCode(value);
    };

    const getRandomHint = () => {
        return HINTS[Math.floor(Math.random() * HINTS.length)];
    };

    const runCode = async () => {
        setIsRunning(true);
        setOutput('Java Bot is thinking...');
        setIsSuccess(false);

        try {
            const response = await axios.post('/api/java/execute', {
                problemId: currentProblem.id,
                code: code
            });

            const result = response.data;
            setOutput(result.output);
            setIsSuccess(result.success);

            if (result.success) {
                if (currentProblemIndex === PROBLEMS.length - 1) {
                    // Last problem - show full celebration
                    setShowCelebration(true);
                } else {
                    setDialogType('success');
                    setDialogMessage(SUCCESS_MSGS[currentProblemIndex] || "Awesome job!");
                    setShowDialog(true);
                }
            } else {
                setDialogType('error');
                setDialogMessage(getRandomHint());
                setShowDialog(true);
            }

        } catch (error) {
            const errorMsg = error.response?.data?.output || error.message;
            setOutput('Ouch! Java Bot tripped: ' + errorMsg);
            setIsSuccess(false);

            setDialogType('error');
            setDialogMessage("Something broke! " + getRandomHint());
            setShowDialog(true);
        } finally {
            setIsRunning(false);
        }
    };

    const nextProblem = () => {
        if (currentProblemIndex < PROBLEMS.length - 1) {
            const nextIndex = currentProblemIndex + 1;
            setCurrentProblemIndex(nextIndex);
            setCode(PROBLEMS[nextIndex].defaultCode);
            setOutput('');
            setIsSuccess(false);
            setShowDialog(false);
        }
    };

    return (
        <div className="learn-java-container">
            <header className="java-header">
                <Link to="/dashboard" className="logo" style={{ textDecoration: 'none', color: '#6a8caf', cursor: 'pointer' }}>Calm.ai</Link>
                <div className="map-progress">
                    {PROBLEMS.map((p, index) => (
                        <div key={p.id} className={`map-node ${index <= currentProblemIndex ? 'active' : ''} ${index === currentProblemIndex ? 'current' : ''}`}>
                            <span className="node-icon">{p.icon}</span>
                        </div>
                    ))}
                </div>
                <Link to="/dashboard" className="exit-btn">Exit Adventure</Link>
            </header>

            <div className="workspace">
                <div className="problem-panel">
                    <div className="mission-card">
                        <div className="mission-header">
                            <span className="mission-icon">{currentProblem.icon}</span>
                            <h2>{currentProblem.title}</h2>
                        </div>
                        <div className="mission-body">
                            <p className="story-text">{currentProblem.story}</p>
                            <div className="example-box">
                                <strong>Example:</strong>
                                <pre>{currentProblem.example}</pre>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="editor-panel">
                    <Editor
                        height="50vh"
                        defaultLanguage="java"
                        value={code}
                        onChange={handleEditorChange}
                        theme="light"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 15,
                            fontFamily: "'Fira Code', monospace",
                            scrollBeyondLastLine: false,
                            lineNumbers: 'on',
                            roundedSelection: true,
                            cursorStyle: 'line'
                        }}
                    />

                    <div className="output-panel">
                        <h3>🤖 Bot Log</h3>
                        <pre className={`output-content ${isSuccess ? 'success' : 'error'}`}>
                            {output || 'Waiting for your command...'}
                        </pre>
                    </div>

                    <div className="action-bar">
                        <button
                            className="run-btn"
                            onClick={runCode}
                            disabled={isRunning}
                        >
                            {isRunning ? '🚀 Running...' : '▶ Run Code'}
                        </button>

                        {isSuccess && currentProblemIndex < PROBLEMS.length - 1 && (
                            <button className="next-btn" onClick={nextProblem}>
                                Next Level ➡️
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Dialog Box */}
            {showDialog && (
                <div className="dialog-overlay" onClick={() => setShowDialog(false)}>
                    <div className={`dialog-box ${dialogType}`} onClick={e => e.stopPropagation()}>
                        <span className="dialog-icon">
                            {dialogType === 'success' ? '🌟' : '💥'}
                        </span>
                        <h3>{dialogType === 'success' ? 'Level Cleared!' : 'Bug Splat!'}</h3>
                        <p>{dialogMessage}</p>
                        <button className="dialog-btn" onClick={() => setShowDialog(false)}>
                            {dialogType === 'success' ? 'Continue' : 'Try Again'}
                        </button>
                    </div>
                </div>
            )}

            {/* Full Page Celebration */}
            {showCelebration && (
                <div className="celebration-overlay">
                    <div className="celebration-content">
                        <div className="celebration-icon">🎉</div>
                        <h1>Adventure Complete!</h1>
                        <p className="celebration-message">
                            Congratulations! You've mastered all three challenges and helped Java Bot on an epic journey!
                        </p>
                        <div className="celebration-stats">
                            <div className="stat-badge">
                                <span className="stat-emoji">🤖</span>
                                <span className="stat-text">Fed the Bot</span>
                            </div>
                            <div className="stat-badge">
                                <span className="stat-emoji">💃</span>
                                <span className="stat-text">Fixed the Party</span>
                            </div>
                            <div className="stat-badge">
                                <span className="stat-emoji">🪞</span>
                                <span className="stat-text">Opened the Gate</span>
                            </div>
                        </div>
                        <div className="celebration-actions">
                            <Link to="/dashboard" className="celebration-btn primary">
                                Return to Dashboard
                            </Link>
                            <button className="celebration-btn secondary" onClick={() => {
                                setShowCelebration(false);
                                setCurrentProblemIndex(0);
                                setCode(PROBLEMS[0].defaultCode);
                                setOutput('');
                                setIsSuccess(false);
                            }}>
                                Play Again
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LearnJava;
