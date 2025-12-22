
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaPlay, FaRedo } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { submitScore } from '../../../State/slices/gameSlice';

const GRID_SIZE = 20;
const GAME_SPEED = 200;

export const SnakeGame = () => {
    const dispatch = useDispatch();
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // Game state refs to avoid closure stale state in interval
    const snakeRef = useRef([{ x: 10, y: 10 }]);
    const foodRef = useRef({ x: 15, y: 15 });
    const directionRef = useRef({ x: 0, y: 0 });
    const nextDirectionRef = useRef({ x: 0, y: 0 }); // Buffer for next move to prevent self-collision on quick turns
    const gameLoopRef = useRef(null);

    // Initialize High Score
    useEffect(() => {
        const storedHighScore = localStorage.getItem('snakeIdxHighScore');
        if (storedHighScore) {
            setHighScore(parseInt(storedHighScore, 10));
        }
    }, []);

    const spawnFood = useCallback(() => {
        const newFood = {
            x: Math.floor(Math.random() * (canvasRef.current.width / GRID_SIZE)),
            y: Math.floor(Math.random() * (canvasRef.current.height / GRID_SIZE))
        };
        // Ensure food doesn't spawn on snake
        const onSnake = snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y);
        if (onSnake) return spawnFood();
        foodRef.current = newFood;
    }, []);

    const startGame = () => {
        setIsGameOver(false);
        setIsPlaying(true);
        setScore(0);
        snakeRef.current = [{ x: 10, y: 10 }];
        directionRef.current = { x: 1, y: 0 };
        nextDirectionRef.current = { x: 1, y: 0 };
        spawnFood();
        
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        gameLoopRef.current = setInterval(gameLoop, GAME_SPEED);
    };

    const gameOver = () => {
        clearInterval(gameLoopRef.current);
        setIsGameOver(true);
        setIsPlaying(false);
        
        // Save local high score
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('snakeIdxHighScore', score.toString());
        }

        // Submit to global leaderboard
        if (score > 0) {
            dispatch(submitScore({ gameId: 'snake', score: score, user: 'You' }));
        }
    };

    const gameLoop = () => {
        const head = { ...snakeRef.current[0] };
        directionRef.current = nextDirectionRef.current;
        head.x += directionRef.current.x;
        head.y += directionRef.current.y;

        const canvas = canvasRef.current;
        const cols = canvas.width / GRID_SIZE;
        const rows = canvas.height / GRID_SIZE;

        // Wall Collision
        if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
            gameOver();
            return;
        }

        // Self Collision
        if (snakeRef.current.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }

        snakeRef.current.unshift(head);

        // Eat Food
        if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
            setScore(prev => prev + 10);
            spawnFood();
        } else {
            snakeRef.current.pop();
        }

        draw();
    };

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Grid (Optional for cyber effect)
        ctx.strokeStyle = '#1a1a2e';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }

        // Draw Food
        ctx.fillStyle = '#ff0055';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff0055';
        ctx.beginPath();
        ctx.arc(
            foodRef.current.x * GRID_SIZE + GRID_SIZE / 2,
            foodRef.current.y * GRID_SIZE + GRID_SIZE / 2,
            GRID_SIZE / 2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Draw Snake
        snakeRef.current.forEach((segment, index) => {
            const isHead = index === 0;
            ctx.fillStyle = isHead ? '#00ffcc' : '#00ccaa';
            ctx.shadowBlur = isHead ? 20 : 10;
            ctx.shadowColor = '#00ffcc';
            
            ctx.fillRect(
                segment.x * GRID_SIZE + 1,
                segment.y * GRID_SIZE + 1,
                GRID_SIZE - 2,
                GRID_SIZE - 2
            );

            // Eyes for head
            if (isHead) {
                ctx.fillStyle = '#000';
                ctx.shadowBlur = 0;
                // Simple eyes logic based on direction could be added here
                ctx.fillRect(
                    segment.x * GRID_SIZE + 5,
                    segment.y * GRID_SIZE + 5,
                    4, 4
                );
            }
        });
        
        ctx.shadowBlur = 0; // Reset shadow
    };

    // Handle Input
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isPlaying) return;
            
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }

            switch (e.key) {
                case 'ArrowUp':
                    if (directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
                    break;
                case 'ArrowDown':
                    if (directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
                    break;
                case 'ArrowLeft':
                    if (directionRef.current.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
                    break;
                case 'ArrowRight':
                    if (directionRef.current.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying]);

    // Initial Draw
    useEffect(() => {
        if (canvasRef.current) {
            // Set canvas size dynamically or fixed
            canvasRef.current.width = 600;
            canvasRef.current.height = 400;
            draw();
        }
    }, [canvasRef]);

    return (
        <div className="d-flex flex-column align-items-center w-100">
            <div className="d-flex justify-content-between w-100 px-4 mb-3" style={{ maxWidth: '600px' }}>
                <div className="text-info fs-5 game-font">
                    SCORE: <span className="text-white">{score}</span>
                </div>
                <div className="text-warning fs-5 game-font">
                    BEST: <span className="text-white">{highScore}</span>
                </div>
            </div>

            <div className="position-relative">
                <canvas
                    ref={canvasRef}
                    style={{
                        background: '#050510',
                        borderRadius: '12px',
                        boxShadow: '0 0 30px rgba(0, 255, 204, 0.1)',
                        maxWidth: '100%',
                        border: '2px solid #333'
                    }}
                />

                {!isPlaying && !isGameOver && (
                    <div className="position-absolute top-50 start-50 translate-middle text-center">
                        <button 
                            className="btn btn-lg btn-outline-info rounded-pill px-5 py-3 game-font glow-effect"
                            onClick={startGame}
                            style={{ 
                                boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
                                background: 'rgba(0,0,0,0.8)' 
                            }}
                        >
                            <FaPlay className="me-2" /> CREATE START
                        </button>
                    </div>
                )}

                {isGameOver && (
                    <div className="position-absolute top-50 start-50 translate-middle text-center bg-dark bg-opacity-75 p-5 rounded-4 border border-danger">
                        <h2 className="text-danger game-font mb-4 text-uppercase" style={{ textShadow: '0 0 10px red' }}>Game Over</h2>
                        <p className="text-white mb-4 fs-5">Score: {score}</p>
                        <button 
                            className="btn btn-warning rounded-pill px-4 py-2 game-font"
                            onClick={startGame}
                        >
                            <FaRedo className="me-2" /> Try Again
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-4 text-center text-secondary small">
                <p>Use <span className="text-light border border-secondary px-1 rounded">Arrow Keys</span> to move</p>
            </div>
        </div>
    );
};
