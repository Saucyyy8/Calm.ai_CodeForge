import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FruitSlicerPage.css';

const FruitSlicerPage = () => {
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const [gameState, setGameState] = useState('start'); // start, playing, gameover
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    // Game constants
    const GRAVITY = 0.15;
    const SPAWN_RATE = 40; // Frames

    // Game state refs
    const objectsRef = useRef([]); // Fruits and bombs
    const particlesRef = useRef([]); // Slice effects
    const mousePathRef = useRef([]); // Trail
    const frameRef = useRef(0);
    const scoreRef = useRef(0);
    const animationFrameId = useRef(null);
    const isMouseDownRef = useRef(false);

    const resetGame = () => {
        objectsRef.current = [];
        particlesRef.current = [];
        mousePathRef.current = [];
        frameRef.current = 0;
        scoreRef.current = 0;
        setScore(0);
        setGameState('playing');
    };

    const createObject = (canvasWidth, canvasHeight) => {
        const isBomb = Math.random() < 0.2; // 20% chance of bomb
        const radius = isBomb ? 25 : 30;
        const x = Math.random() * (canvasWidth - 100) + 50;
        const y = canvasHeight + radius;
        const vx = (Math.random() - 0.5) * 4; // Horizontal velocity
        const vy = -(Math.random() * 5 + 10); // Vertical toss velocity

        // Colors for fruits
        const colors = ['#e74c3c', '#f1c40f', '#9b59b6', '#2ecc71', '#e67e22'];
        const color = isBomb ? '#2c3e50' : colors[Math.floor(Math.random() * colors.length)];

        return {
            x, y, vx, vy, radius, color, isBomb,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
            sliced: false
        };
    };

    const createParticles = (x, y, color) => {
        for (let i = 0; i < 10; i++) {
            particlesRef.current.push({
                x, y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0,
                color
            });
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = 800;
        canvas.height = 600;

        const render = () => {
            if (gameState !== 'playing') return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Spawn Objects
            if (frameRef.current % SPAWN_RATE === 0) {
                objectsRef.current.push(createObject(canvas.width, canvas.height));
            }

            // Update & Draw Objects
            for (let i = objectsRef.current.length - 1; i >= 0; i--) {
                const obj = objectsRef.current[i];

                // Physics
                obj.x += obj.vx;
                obj.y += obj.vy;
                obj.vy += GRAVITY;
                obj.rotation += obj.rotationSpeed;

                // Remove if out of bounds (bottom)
                if (obj.y > canvas.height + 100) {
                    objectsRef.current.splice(i, 1);
                    continue;
                }

                // Draw
                ctx.save();
                ctx.translate(obj.x, obj.y);
                ctx.rotate(obj.rotation);

                ctx.beginPath();
                if (obj.isBomb) {
                    // Draw Bomb
                    ctx.arc(0, 0, obj.radius, 0, Math.PI * 2);
                    ctx.fillStyle = '#2c3e50';
                    ctx.fill();
                    // Fuse
                    ctx.beginPath();
                    ctx.moveTo(0, -obj.radius);
                    ctx.lineTo(10, -obj.radius - 10);
                    ctx.strokeStyle = '#7f8c8d';
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    // Spark
                    if (frameRef.current % 10 < 5) {
                        ctx.fillStyle = '#e74c3c';
                        ctx.fillRect(8, -obj.radius - 15, 4, 4);
                    }
                } else {
                    // Draw Fruit
                    ctx.arc(0, 0, obj.radius, 0, Math.PI * 2);
                    ctx.fillStyle = obj.color;
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
                ctx.restore();
            }

            // Update & Draw Particles
            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                const p = particlesRef.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += GRAVITY;
                p.life -= 0.02;

                if (p.life <= 0) {
                    particlesRef.current.splice(i, 1);
                    continue;
                }

                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }

            // Draw Blade Trail
            if (mousePathRef.current.length > 1) {
                ctx.beginPath();
                ctx.moveTo(mousePathRef.current[0].x, mousePathRef.current[0].y);
                for (let i = 1; i < mousePathRef.current.length; i++) {
                    ctx.lineTo(mousePathRef.current[i].x, mousePathRef.current[i].y);
                }
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 5;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();

                // Fade trail
                if (mousePathRef.current.length > 10) {
                    mousePathRef.current.shift();
                }
            }

            // Collision Detection (Blade vs Objects)
            if (isMouseDownRef.current && mousePathRef.current.length >= 2) {
                const p1 = mousePathRef.current[mousePathRef.current.length - 2];
                const p2 = mousePathRef.current[mousePathRef.current.length - 1];

                for (let i = objectsRef.current.length - 1; i >= 0; i--) {
                    const obj = objectsRef.current[i];
                    if (obj.sliced) continue;

                    // Simple distance check to line segment
                    const dist = pointToLineDistance(obj.x, obj.y, p1.x, p1.y, p2.x, p2.y);

                    if (dist < obj.radius) {
                        if (obj.isBomb) {
                            setGameState('gameover');
                            createParticles(obj.x, obj.y, '#e74c3c'); // Explosion
                        } else {
                            // Slice Fruit
                            objectsRef.current.splice(i, 1);
                            createParticles(obj.x, obj.y, obj.color);
                            scoreRef.current += 1;
                            setScore(scoreRef.current);
                        }
                    }
                }
            }

            frameRef.current++;
            animationFrameId.current = requestAnimationFrame(render);
        };

        if (gameState === 'playing') {
            render();
        } else {
            // Initial render background
            ctx.clearRect(0, 0, canvas.width, canvas.height);
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

    // Helper: Distance from point to line segment
    const pointToLineDistance = (x, y, x1, y1, x2, y2) => {
        const A = x - x1;
        const B = y - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;
        if (len_sq !== 0) // in case of 0 length line
            param = dot / len_sq;

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = x - xx;
        const dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    };

    // Input Handling
    const handleMouseDown = (e) => {
        isMouseDownRef.current = true;
        updateMousePath(e);
    };

    const handleMouseMove = (e) => {
        if (isMouseDownRef.current) {
            updateMousePath(e);
        }
    };

    const handleMouseUp = () => {
        isMouseDownRef.current = false;
        mousePathRef.current = [];
    };

    const updateMousePath = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mousePathRef.current.push({ x, y });
    };

    return (
        <div className="fruit-slicer-container">
            <div className="game-header">
                <div className="logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', color: '#fff', fontSize: '2rem', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Calm.ai</div>
            </div>

            <div className="score-display">
                {score}
            </div>

            <canvas
                ref={canvasRef}
                className="game-canvas"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />

            {gameState === 'start' && (
                <div className="game-overlay">
                    <div className="game-message">
                        <h2>Fruit Slicer</h2>
                        <p>Slice fruits! Avoid bombs!</p>
                        <button className="play-btn" onClick={resetGame}>Start Slicing</button>
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
                            <button className="play-btn" onClick={resetGame}>Slice Again</button>
                            <button className="play-btn" onClick={() => navigate('/dashboard')} style={{ background: '#795548', boxShadow: '0 4px 0 #5d4037' }}>Back to Dashboard</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FruitSlicerPage;
