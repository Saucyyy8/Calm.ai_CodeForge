import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FlappyBirdPage.css';

const FlappyBirdPage = () => {
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const [gameState, setGameState] = useState('start'); // start, playing, gameover
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    // Game constants
    const GRAVITY = 0.6;
    const JUMP = -10;
    const PIPE_SPEED = 3;
    const PIPE_SPAWN_RATE = 100; // Frames
    const PIPE_GAP = 150;

    // Game state refs (for loop access)
    const birdRef = useRef({ x: 50, y: 200, velocity: 0, radius: 20 });
    const pipesRef = useRef([]);
    const frameRef = useRef(0);
    const scoreRef = useRef(0);
    const animationFrameId = useRef(null);

    const resetGame = () => {
        birdRef.current = { x: 50, y: 200, velocity: 0, radius: 20 };
        pipesRef.current = [];
        frameRef.current = 0;
        scoreRef.current = 0;
        setScore(0);
        setGameState('playing');
    };

    const jump = () => {
        if (gameState === 'playing') {
            birdRef.current.velocity = JUMP;
        } else if (gameState === 'start') {
            resetGame();
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas size
        canvas.width = 400;
        canvas.height = 600;

        const render = () => {
            if (gameState !== 'playing') return;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update Bird
            birdRef.current.velocity += GRAVITY;
            birdRef.current.y += birdRef.current.velocity;

            // Floor collision
            if (birdRef.current.y + birdRef.current.radius >= canvas.height) {
                setGameState('gameover');
                return;
            }
            // Ceiling collision
            if (birdRef.current.y - birdRef.current.radius <= 0) {
                birdRef.current.y = birdRef.current.radius;
                birdRef.current.velocity = 0;
            }

            // Spawn Pipes
            if (frameRef.current % PIPE_SPAWN_RATE === 0) {
                const minHeight = 50;
                const maxHeight = canvas.height - PIPE_GAP - minHeight;
                const height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);

                pipesRef.current.push({
                    x: canvas.width,
                    topHeight: height,
                    passed: false
                });
            }

            // Update Pipes & Collision
            pipesRef.current.forEach((pipe, index) => {
                pipe.x -= PIPE_SPEED;

                // Draw Pipes
                ctx.fillStyle = '#2ecc71'; // Green pipe
                // Top Pipe
                ctx.fillRect(pipe.x, 0, 50, pipe.topHeight);
                // Bottom Pipe
                ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, 50, canvas.height - (pipe.topHeight + PIPE_GAP));

                // Pipe Border
                ctx.strokeStyle = '#27ae60';
                ctx.lineWidth = 2;
                ctx.strokeRect(pipe.x, 0, 50, pipe.topHeight);
                ctx.strokeRect(pipe.x, pipe.topHeight + PIPE_GAP, 50, canvas.height - (pipe.topHeight + PIPE_GAP));

                // Collision Detection
                const bird = birdRef.current;
                // Horizontal check
                if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + 50) {
                    // Vertical check
                    if (bird.y - bird.radius < pipe.topHeight || bird.y + bird.radius > pipe.topHeight + PIPE_GAP) {
                        setGameState('gameover');
                    }
                }

                // Score update
                if (pipe.x + 50 < bird.x && !pipe.passed) {
                    scoreRef.current += 1;
                    setScore(scoreRef.current);
                    pipe.passed = true;
                }

                // Remove off-screen pipes
                if (pipe.x + 50 < 0) {
                    pipesRef.current.shift();
                }
            });

            // Draw Bird
            ctx.beginPath();
            ctx.arc(birdRef.current.x, birdRef.current.y, birdRef.current.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#f1c40f'; // Yellow bird
            ctx.fill();
            ctx.strokeStyle = '#f39c12';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Bird Eye
            ctx.beginPath();
            ctx.arc(birdRef.current.x + 10, birdRef.current.y - 5, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(birdRef.current.x + 12, birdRef.current.y - 5, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'black';
            ctx.fill();

            frameRef.current++;
            animationFrameId.current = requestAnimationFrame(render);
        };

        if (gameState === 'playing') {
            render();
        } else {
            // Initial render for start screen background
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#70c5ce';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw static bird
            ctx.beginPath();
            ctx.arc(birdRef.current.x, birdRef.current.y, birdRef.current.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#f1c40f';
            ctx.fill();
            ctx.strokeStyle = '#f39c12';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        return () => {
            cancelAnimationFrame(animationFrameId.current);
        };
    }, [gameState]);

    useEffect(() => {
        if (gameState === 'gameover') {
            if (score > highScore) {
                setHighScore(score);
            }
        }
    }, [gameState, score, highScore]);

    // Handle keyboard input
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                jump();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState]);

    return (
        <div className="flappy-bird-container">
            <div className="game-header">
                <div className="logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', color: 'white', fontSize: '2rem', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>Calm.ai</div>
            </div>

            <div className="score-display">
                {score}
            </div>

            <canvas
                ref={canvasRef}
                className="game-canvas"
                onClick={jump}
            />

            {gameState === 'start' && (
                <div className="game-overlay">
                    <div className="game-message">
                        <h2>Flappy Bird</h2>
                        <p>Press Space or Click to Jump</p>
                        <button className="play-btn" onClick={resetGame}>Start Game</button>
                    </div>
                </div>
            )}

            {gameState === 'gameover' && (
                <div className="game-overlay">
                    <div className="game-message">
                        <h2>Game Over</h2>
                        <p>Score: {score}</p>
                        <p>Best: {highScore}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button className="play-btn" onClick={resetGame}>Play Again</button>
                            <button className="play-btn" onClick={() => navigate('/dashboard')} style={{ background: '#95a5a6' }}>Back to Dashboard</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlappyBirdPage;
