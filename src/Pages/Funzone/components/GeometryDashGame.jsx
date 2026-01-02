
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaPlay, FaRedo } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { submitScore } from '../../../State/slices/gameSlice';

// Game Constants
const GRAVITY = 0.6;
const JUMP_FORCE = -10;
const GAME_SPEED_INITIAL = 5;
const PLAYER_SIZE = 30;
const OBSTACLE_WIDTH = 30;
const OBSTACLE_HEIGHT = 40;
const SPAWN_RATE = 90; // Frames between spawns

export const GeometryDashGame = () => {
    const dispatch = useDispatch();
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    // Game State Refs (for loop performance)
    const gameState = useRef({
        player: { x: 50, y: 0, dy: 0, grounded: false, rotation: 0 },
        obstacles: [],
        particles: [],
        frame: 0,
        speed: GAME_SPEED_INITIAL,
        score: 0
    });
    
    const requestRef = useRef();

    useEffect(() => {
        const storedHighScore = localStorage.getItem('geoDashHighScore');
        if (storedHighScore) {
            setHighScore(parseInt(storedHighScore, 10));
        }
    }, []);

    // Core Game Loop
    const gameLoop = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const state = gameState.current;
        
        const width = canvas.width;
        const height = canvas.height;
        const groundY = height - 50;

        // --- UPDATE ---

        // Player Physics
        state.player.dy += GRAVITY;
        state.player.y += state.player.dy;

        // Ground Collision
        if (state.player.y + PLAYER_SIZE >= groundY) {
            state.player.y = groundY - PLAYER_SIZE;
            state.player.dy = 0;
            state.player.grounded = true;
            
            // Round rotation to nearest 90 on ground
            const rot = state.player.rotation % 360;
            if (rot !== 0 && rot !== 90 && rot !== 180 && rot !== 270) {
                 state.player.rotation = Math.round(state.player.rotation / 90) * 90;
            }
        } else {
            state.player.grounded = false;
            state.player.rotation += 5; // Rotate while jumping
        }

        // Obstacles Spawning
        state.frame++;
        if (state.frame % SPAWN_RATE === 0) {
            // Randomly choose obstacle type (spike or block)
            const type = Math.random() > 0.5 ? 'spike' : 'block';
            state.obstacles.push({
                x: width,
                y: type === 'spike' ? groundY - 30 : groundY - 40,
                w: type === 'spike' ? 30 : 40,
                h: type === 'spike' ? 30 : 40,
                type: type,
                passed: false
            });
            
            // Speed up slightly over time
            if (state.frame % 500 === 0) {
                state.speed += 0.5;
            }
        }

        // Move Obstacles & Collision Detection
        for (let i = state.obstacles.length - 1; i >= 0; i--) {
            const obs = state.obstacles[i];
            obs.x -= state.speed;

            // Remove if off screen
            if (obs.x + obs.w < 0) {
                state.obstacles.splice(i, 1);
                continue;
            }

            // Score update
            if (!obs.passed && obs.x + obs.w < state.player.x) {
                obs.passed = true;
                state.score += 10;
                setScore(state.score);
            }

            // Collision AABB (Axis-Aligned Bounding Box) slightly forgiving
            const buffer = 4;
            if (
                state.player.x + buffer < obs.x + obs.w - buffer &&
                state.player.x + PLAYER_SIZE - buffer > obs.x + buffer &&
                state.player.y + buffer < obs.y + obs.h - buffer &&
                state.player.y + PLAYER_SIZE - buffer > obs.y + buffer
            ) {
                // Game Over
                handleGameOver(state.score);
                return; // Stop loop
            }
        }

        // Particle System (Trail)
        if (state.frame % 3 === 0) {
            state.particles.push({
                x: state.player.x,
                y: state.player.y + PLAYER_SIZE / 2,
                life: 20,
                color: `hsl(${state.frame % 360}, 100%, 50%)`
            });
        }
        
        for (let i = state.particles.length - 1; i >= 0; i--) {
            state.particles[i].x -= state.speed;
            state.particles[i].life--;
            if (state.particles[i].life <= 0) state.particles.splice(i, 1);
        }

        // --- DRAW ---
        
        // Background
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, width, height);
        
        // Grid bg effect
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        const gridSize = 40;
        const offsetX = (state.frame * state.speed) % gridSize;
        ctx.beginPath();
        for(let x = -offsetX; x < width; x+=gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        for(let y = 0; y < height; y+=gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        ctx.stroke();


        // Ground
        ctx.fillStyle = '#222';
        ctx.fillRect(0, groundY, width, height - groundY);
        ctx.fillStyle = '#00f2fe';
        ctx.fillRect(0, groundY, width, 2); // Neon Line

        // Particles
        state.particles.forEach(p => {
             ctx.fillStyle = p.color;
             ctx.globalAlpha = p.life / 20;
             ctx.fillRect(p.x, p.y, 4, 4);
        });
        ctx.globalAlpha = 1.0;

        // Player (Rotating Square)
        ctx.save();
        ctx.translate(state.player.x + PLAYER_SIZE / 2, state.player.y + PLAYER_SIZE / 2);
        ctx.rotate(state.player.rotation * Math.PI / 180);
        ctx.fillStyle = '#ff0055';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff0055';
        ctx.fillRect(-PLAYER_SIZE / 2, -PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
        // Face
        ctx.fillStyle = 'white';
        ctx.fillRect(5, -5, 5, 5); // Eye
        ctx.shadowBlur = 0;
        ctx.restore();

        // Obstacles
        state.obstacles.forEach(obs => {
            if (obs.type === 'spike') {
                ctx.fillStyle = '#ffe600'; // Yellow Spikes
                ctx.beginPath();
                ctx.moveTo(obs.x, obs.y + obs.h);
                ctx.lineTo(obs.x + obs.w / 2, obs.y);
                ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
                ctx.closePath();
                ctx.fill();
            } else {
                ctx.fillStyle = '#4cc9f0'; // Blue Blocks
                ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
            }
        });

        // Loop
        requestRef.current = requestAnimationFrame(gameLoop);

    }, []);

    const handleGameOver = (finalScore) => {
        setIsPlaying(false);
        setIsGameOver(true);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        
        if (finalScore > highScore) {
            setHighScore(finalScore);
            localStorage.setItem('geoDashHighScore', finalScore.toString());
        }
        dispatch(submitScore({ gameId: 'geometry-dash', score: finalScore, user: 'You' }));
    };

    const jump = useCallback(() => {
        if (!isPlaying || isGameOver) return;
        const state = gameState.current;
        if (state.player.grounded) {
            state.player.dy = JUMP_FORCE;
            state.player.grounded = false;
        }
    }, [isPlaying, isGameOver]);

    // Input Handling
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                jump();
            }
        };
        
        // Touch/Click handled by div wrapper
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [jump]);

    const initGame = () => {
        setScore(0);
        setIsGameOver(false);
        setIsPlaying(true);
        
        gameState.current = {
            player: { x: 50, y: 0, dy: 0, grounded: false, rotation: 0 },
            obstacles: [],
            particles: [],
            frame: 0,
            speed: GAME_SPEED_INITIAL,
            score: 0
        };
        
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        requestRef.current = requestAnimationFrame(gameLoop);
    };

    // Canvas Resize
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = 700;
            canvas.height = 350;
        }
    }, []);

    // Cleanup
    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);


    return (
        <div className="d-flex flex-column align-items-center w-100">
             <div className="d-flex justify-content-between w-100 px-4 mb-3" style={{ maxWidth: '700px' }}>
                <div className="text-info fs-5 game-font">
                    SCORE: <span className="text-white">{Math.floor(score)}</span>
                </div>
                 <div className="text-warning fs-5 game-font">
                    BEST: <span className="text-white">{highScore}</span>
                </div>
            </div>

            <div 
                className="game-container position-relative w-100" 
                style={{ maxWidth: '700px', cursor: 'pointer' }}
                onClick={jump}
            >
                <canvas
                    ref={canvasRef}
                    style={{
                        background: '#09090b',
                        borderRadius: '12px',
                        boxShadow: '0 0 30px rgba(0, 242, 254, 0.2)',
                        width: '100%',
                        border: '2px solid #333'
                    }}
                />

                {!isPlaying && !isGameOver && (
                    <div className="position-absolute top-50 start-50 translate-middle text-center z-3">
                         <button 
                            className="btn btn-lg btn-outline-info rounded-pill px-5 py-3 game-font glow-effect"
                            onClick={(e) => { e.stopPropagation(); initGame(); }}
                            style={{ 
                                boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
                                background: 'rgba(0,0,0,0.8)' 
                            }}
                        >
                            <FaPlay className="me-2" /> PLAY DASH
                        </button>
                    </div>
                )}

                {isGameOver && (
                    <div className="position-absolute top-50 start-50 translate-middle text-center bg-dark bg-opacity-90 p-5 rounded-4 border border-danger">
                        <h2 className="text-danger game-font mb-4 text-uppercase fw-bold" style={{ textShadow: '0 0 10px red' }}>CRASHED!</h2>
                        <p className="text-white mb-4 fs-4">Score: {Math.floor(score)}</p>
                        <button 
                            className="btn btn-warning rounded-pill px-4 py-2 game-font fw-bold"
                            onClick={(e) => { e.stopPropagation(); initGame(); }}
                        >
                            <FaRedo className="me-2" /> RESTART
                        </button>
                    </div>
                )}
            </div>
             <div className="mt-4 text-center text-secondary small">
                <p>Press <span className="text-light border border-secondary px-1 rounded">SPACE</span>, <span className="text-light border border-secondary px-1 rounded">UP</span> or Click to Jump!</p>
            </div>
        </div>
    );
};
