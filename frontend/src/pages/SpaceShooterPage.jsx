import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SpaceShooterPage.css';

const SpaceShooterPage = () => {
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const [gameState, setGameState] = useState('start'); // start, playing, gameover
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    // Game constants
    const PLAYER_SPEED = 5;
    const BULLET_SPEED = 7;
    const ENEMY_SPEED = 2;
    const ENEMY_SPAWN_RATE = 60; // Frames

    // Game state refs
    const playerRef = useRef({ x: 200, y: 550, width: 40, height: 40 });
    const bulletsRef = useRef([]);
    const enemiesRef = useRef([]);
    const keysRef = useRef({});
    const frameRef = useRef(0);
    const scoreRef = useRef(0);
    const animationFrameId = useRef(null);

    const resetGame = () => {
        playerRef.current = { x: 200, y: 550, width: 40, height: 40 };
        bulletsRef.current = [];
        enemiesRef.current = [];
        frameRef.current = 0;
        scoreRef.current = 0;
        setScore(0);
        setGameState('playing');
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = 400;
        canvas.height = 600;

        const render = () => {
            if (gameState !== 'playing') return;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Handle Player Movement
            if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) {
                playerRef.current.x = Math.max(0, playerRef.current.x - PLAYER_SPEED);
            }
            if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) {
                playerRef.current.x = Math.min(canvas.width - playerRef.current.width, playerRef.current.x + PLAYER_SPEED);
            }

            // Spawn Enemies
            if (frameRef.current % ENEMY_SPAWN_RATE === 0) {
                const x = Math.random() * (canvas.width - 30);
                enemiesRef.current.push({ x, y: -30, width: 30, height: 30 });
            }

            // Update Bullets
            bulletsRef.current.forEach((bullet, index) => {
                bullet.y -= BULLET_SPEED;
                if (bullet.y < 0) bulletsRef.current.splice(index, 1);
            });

            // Update Enemies
            enemiesRef.current.forEach((enemy, index) => {
                enemy.y += ENEMY_SPEED;
                if (enemy.y > canvas.height) {
                    enemiesRef.current.splice(index, 1);
                    // Optional: Penalty for missing enemies?
                }
            });

            // Collision Detection
            // Bullet hits Enemy
            bulletsRef.current.forEach((bullet, bIndex) => {
                enemiesRef.current.forEach((enemy, eIndex) => {
                    if (
                        bullet.x < enemy.x + enemy.width &&
                        bullet.x + bullet.width > enemy.x &&
                        bullet.y < enemy.y + enemy.height &&
                        bullet.y + bullet.height > enemy.y
                    ) {
                        bulletsRef.current.splice(bIndex, 1);
                        enemiesRef.current.splice(eIndex, 1);
                        scoreRef.current += 10;
                        setScore(scoreRef.current);
                    }
                });
            });

            // Enemy hits Player
            enemiesRef.current.forEach((enemy) => {
                if (
                    playerRef.current.x < enemy.x + enemy.width &&
                    playerRef.current.x + playerRef.current.width > enemy.x &&
                    playerRef.current.y < enemy.y + enemy.height &&
                    playerRef.current.y + playerRef.current.height > enemy.y
                ) {
                    setGameState('gameover');
                }
            });

            // Draw Player
            ctx.fillStyle = '#66fcf1';
            ctx.beginPath();
            ctx.moveTo(playerRef.current.x + 20, playerRef.current.y);
            ctx.lineTo(playerRef.current.x + 40, playerRef.current.y + 40);
            ctx.lineTo(playerRef.current.x, playerRef.current.y + 40);
            ctx.fill();

            // Draw Bullets
            ctx.fillStyle = '#ff0055'; // Laser color
            bulletsRef.current.forEach(bullet => {
                ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            });

            // Draw Enemies
            ctx.fillStyle = '#c5c6c7';
            enemiesRef.current.forEach(enemy => {
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                // Simple enemy detail
                ctx.fillStyle = '#0b0c10';
                ctx.fillRect(enemy.x + 5, enemy.y + 5, 5, 5);
                ctx.fillRect(enemy.x + 20, enemy.y + 5, 5, 5);
                ctx.fillStyle = '#c5c6c7';
            });

            frameRef.current++;
            animationFrameId.current = requestAnimationFrame(render);
        };

        if (gameState === 'playing') {
            render();
        } else {
            // Initial render background
            ctx.fillStyle = '#0b0c10';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
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

    // Input Handling
    useEffect(() => {
        const handleKeyDown = (e) => {
            keysRef.current[e.code] = true;
            if (e.code === 'Space' && gameState === 'playing') {
                bulletsRef.current.push({
                    x: playerRef.current.x + 18, // Center of ship
                    y: playerRef.current.y,
                    width: 4,
                    height: 10
                });
            }
        };
        const handleKeyUp = (e) => {
            keysRef.current[e.code] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameState]);

    return (
        <div className="space-shooter-container">
            <div className="game-header">
                <div className="logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', color: '#66fcf1', fontSize: '2rem', fontWeight: 'bold', textShadow: '0 0 10px rgba(102, 252, 241, 0.5)' }}>Calm.ai</div>
            </div>

            <div className="score-display">
                Score: {score}
            </div>

            <canvas
                ref={canvasRef}
                className="game-canvas"
            />

            {gameState === 'start' && (
                <div className="game-overlay">
                    <div className="game-message">
                        <h2>Space Shooter</h2>
                        <p>Arrow Keys/WASD to Move • Space to Shoot</p>
                        <button className="play-btn" onClick={resetGame}>Start Mission</button>
                    </div>
                </div>
            )}

            {gameState === 'gameover' && (
                <div className="game-overlay">
                    <div className="game-message">
                        <h2>Mission Failed</h2>
                        <p>Score: {score}</p>
                        <p>Best: {highScore}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button className="play-btn" onClick={resetGame}>Retry Mission</button>
                            <button className="play-btn" onClick={() => navigate('/dashboard')} style={{ borderColor: '#c5c6c7', color: '#c5c6c7' }}>Abort to Dashboard</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpaceShooterPage;
