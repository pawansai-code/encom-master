
import { useCallback, useEffect, useState } from 'react';
import { FaPlay, FaRedo } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { submitScore } from '../../../State/slices/gameSlice';

const WORD_LIST = [
    'ALGORITHM', 'BINARY', 'CACHE', 'DEBUG', 'ENCRYPTION', 'FIREWALL', 'GITHUB', 'HARDWARE',
    'INTERFACE', 'JAVASCRIPT', 'KERNEL', 'LATENCY', 'MAINFRAME', 'NETWORK', 'OBJECT',
    'GAMING', 'NINJA', 'EDUVERSE', 'STUDENT', 'REACT', 'PYTHON', 'DATABASE', 'SERVER'
];

export const HangmanGame = () => {
    const dispatch = useDispatch();
    const [word, setWord] = useState('');
    const [guessedLetters, setGuessedLetters] = useState(new Set());
    const [mistakes, setMistakes] = useState(0);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isVictor, setIsVictor] = useState(false);

    const MAX_MISTAKES = 6;

    useEffect(() => {
        const storedHighScore = localStorage.getItem('hangmanHighScore');
        if (storedHighScore) {
            setHighScore(parseInt(storedHighScore, 10));
        }
    }, []);

    const startGame = () => {
        const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
        setWord(randomWord);
        setGuessedLetters(new Set());
        setMistakes(0);
        setIsPlaying(true);
        setIsGameOver(false);
        setIsVictor(false);
        setScore(0);
    };

    const handleGuess = useCallback((letter) => {
        if (!isPlaying || isGameOver || guessedLetters.has(letter)) return;

        setGuessedLetters(prev => {
            const newSet = new Set(prev);
            newSet.add(letter);
            return newSet;
        });

        if (!word.includes(letter)) {
            setMistakes(prev => {
                const newMistakes = prev + 1;
                if (newMistakes >= MAX_MISTAKES) {
                    endGame(false);
                }
                return newMistakes;
            });
        } else {
            // Check win condition
            const isWin = word.split('').every(char => guessedLetters.has(char) || char === letter);
            if (isWin) {
                // Calculate score based on remaining attempts and word length
                const roundScore = (MAX_MISTAKES - mistakes) * 10 + word.length * 5;
                setScore(roundScore);
                endGame(true, roundScore);
            }
        }
    }, [word, guessedLetters, isPlaying, isGameOver, mistakes]);

    const endGame = (win, finalScore = 0) => {
        setIsPlaying(false);
        setIsGameOver(true);
        setIsVictor(win);

        if (win) {
             if (finalScore > highScore) {
                setHighScore(finalScore);
                localStorage.setItem('hangmanHighScore', finalScore.toString());
            }
            dispatch(submitScore({ gameId: 'hangman', score: finalScore, user: 'You' }));
        }
    };

    // Keyboard Input
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isPlaying) return;
            const char = e.key.toUpperCase();
            if (/^[A-Z]$/.test(char)) {
                handleGuess(char);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, handleGuess]);

    const renderHangman = () => {
        // Simple SVG or CSS based hangman
        const parts = [
            // Base
             <line key="base" x1="10" y1="250" x2="150" y2="250" stroke="#4a5568" strokeWidth="4" />,
             <line key="pole" x1="80" y1="250" x2="80" y2="20" stroke="#4a5568" strokeWidth="4" />,
             <line key="top" x1="80" y1="20" x2="200" y2="20" stroke="#4a5568" strokeWidth="4" />,
             <line key="rope" x1="200" y1="20" x2="200" y2="50" stroke="#4a5568" strokeWidth="4" />,
        ];
        
        const bodyParts = [
             <circle key="head" cx="200" cy="80" r="30" stroke="white" strokeWidth="4" fill="transparent" />,
             <line key="body" x1="200" y1="110" x2="200" y2="170" stroke="white" strokeWidth="4" />,
             <line key="l-arm" x1="200" y1="130" x2="170" y2="160" stroke="white" strokeWidth="4" />,
             <line key="r-arm" x1="200" y1="130" x2="230" y2="160" stroke="white" strokeWidth="4" />,
             <line key="l-leg" x1="200" y1="170" x2="170" y2="210" stroke="white" strokeWidth="4" />,
             <line key="r-leg" x1="200" y1="170" x2="230" y2="210" stroke="white" strokeWidth="4" />,
        ];

        return (
            <svg width="250" height="260" viewBox="0 0 300 300" className="mx-auto">
                {parts}
                {bodyParts.slice(0, mistakes)}
            </svg>
        );
    };

    return (
        <div className="d-flex flex-column align-items-center w-100">
             <div className="d-flex justify-content-between w-100 px-4 mb-3" style={{ maxWidth: '800px' }}>
                <div className="text-info fs-5 game-font">
                    SCORE: <span className="text-white">{score}</span>
                </div>
                 <div className="text-warning fs-5 game-font">
                    BEST: <span className="text-white">{highScore}</span>
                </div>
            </div>

            <div className="game-container p-4 rounded-4 border border-secondary bg-dark bg-opacity-50 position-relative w-100" style={{ maxWidth: '800px', minHeight: '500px' }}>
                
                {!isPlaying && !isGameOver && (
                    <div className="position-absolute top-50 start-50 translate-middle text-center z-3">
                         <button 
                            className="btn btn-lg btn-outline-info rounded-pill px-5 py-3 game-font glow-effect"
                            onClick={startGame}
                            style={{ 
                                boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
                                background: 'rgba(0,0,0,0.8)' 
                            }}
                        >
                            <FaPlay className="me-2" /> START GAME
                        </button>
                    </div>
                )}

                {(isPlaying || isGameOver) && (
                    <div className="row">
                        <div className="col-md-5 d-flex justify-content-center align-items-center">
                            {renderHangman()}
                        </div>
                        <div className="col-md-7 d-flex flex-column justify-content-between">
                            
                            {/* Word Display */}
                            <div className="word-display text-center mb-4 mt-4">
                                {word.split('').map((char, index) => (
                                    <span key={index} className="mx-1 d-inline-block border-bottom border-2 border-white text-center fw-bold fs-2" style={{ width: '40px', height: '60px', color: isGameOver && !guessedLetters.has(char) ? '#ef4444' : 'white' }}>
                                        {guessedLetters.has(char) || isGameOver ? char : ''}
                                    </span>
                                ))}
                            </div>

                            {/* Keyboard */}
                            <div className="keyboard-grid d-flex flex-wrap justify-content-center gap-2 mb-3">
                                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(char => {
                                    const isGuessed = guessedLetters.has(char);
                                    let btnClass = "btn-outline-light";
                                    if (isGuessed) {
                                        btnClass = word.includes(char) ? "btn-success" : "btn-secondary opacity-50";
                                    }
                                    return (
                                        <button 
                                            key={char} 
                                            className={`btn sm-btn fw-bold ${btnClass}`} 
                                            style={{ width: '45px', height: '45px' }}
                                            disabled={isGuessed || isGameOver}
                                            onClick={() => handleGuess(char)}
                                        >
                                            {char}
                                        </button>
                                    );
                                })}
                            </div>

                             {isGameOver && (
                                <div className="text-center mt-3">
                                     <h2 className={`game-font mb-3 ${isVictor ? 'text-success' : 'text-danger'}`}>
                                        {isVictor ? 'YOU WON!' : 'GAME OVER'}
                                    </h2>
                                    <button 
                                        className="btn btn-warning rounded-pill px-4 py-2 game-font"
                                        onClick={startGame}
                                    >
                                        <FaRedo className="me-2" /> Play Again
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </div>
             <div className="mt-4 text-center text-secondary small">
                <p>Type letters or click the virtual keyboard to guess the word.</p>
            </div>
        </div>
    );
};
