
import { useEffect, useRef, useState } from 'react';
import { FaClock, FaLock, FaLockOpen, FaPlay, FaTerminal } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { submitScore } from '../../../State/slices/gameSlice';

const LEVELS = [
    { id: 1, type: 'sequence', question: '2, 4, 6, 8, ?', answer: '10', hint: 'Add 2' },
    { id: 2, type: 'sequence', question: '1, 1, 2, 3, 5, ?', answer: '8', hint: 'Fibonacci' },
    { id: 3, type: 'binary', question: 'Binary: 1010 to Decimal', answer: '10', hint: '8 + 2' },
    { id: 4, type: 'logic', question: 'If A=1, B=2, C=3... HELLO=?', answer: '85121215', hint: 'A1...Z26' },
    { id: 5, type: 'hex', question: 'Hex: F to Decimal', answer: '15', hint: 'Base 16' },
    { id: 6, type: 'sequence', question: '1, 4, 9, 16, ?', answer: '25', hint: 'Squares' },
    { id: 7, type: 'logic', question: 'What comes next: M, T, W, T, F, ?', answer: 'S', hint: 'Weekdays' },
    { id: 8, type: 'binary', question: '1111 + 1 = ? (Binary)', answer: '10000', hint: 'Binary Addition' },
    { id: 9, type: 'math', question: '2 * 3 + 4 * 0 = ?', answer: '6', hint: 'BODMAS' },
    { id: 10, type: 'code', question: 'x = 5; y = 2; x % y = ?', answer: '1', hint: 'Modulus' }
];

export const CodeBreaker = () => {
    const dispatch = useDispatch();
    const [gameState, setGameState] = useState('idle'); // idle, playing, won, lost
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [showHint, setShowHint] = useState(false);
    
    const inputRef = useRef(null);
    const timerRef = useRef(null);

    const currentLevel = LEVELS[currentLevelIndex];

    useEffect(() => {
        if (gameState === 'playing') {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        endGame(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [gameState]);

    const startGame = () => {
        setGameState('playing');
        setCurrentLevelIndex(0);
        setScore(0);
        setTimeLeft(60);
        setUserInput('');
        setFeedback('');
        setShowHint(false);
    };

    const endGame = (won) => {
        clearInterval(timerRef.current);
        setGameState(won ? 'won' : 'lost');
        if (score > 0) {
            dispatch(submitScore({ gameId: 'code-breaker', score, user: 'You' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let correct = false;
        // Case insensitive check
        if (userInput.trim().toLowerCase() === currentLevel.answer.toLowerCase()) {
            correct = true;
        }

        if (correct) {
            const levelScore = Math.ceil(timeLeft / 2) * 10;
            setScore(prev => prev + levelScore);
            setFeedback('Access Granted. Decrypting next layer...');
            setUserInput('');
            
            setTimeout(() => {
                if (currentLevelIndex + 1 >= LEVELS.length) {
                    endGame(true);
                } else {
                    setCurrentLevelIndex(prev => prev + 1);
                    setTimeLeft(60); // Reset time for next level
                    setFeedback('');
                    setShowHint(false);
                }
            }, 1000);
        } else {
            setFeedback('Access Denied. Integrity compromised.');
            setTimeLeft(prev => Math.max(0, prev - 5)); // Penalty
            setUserInput('');
        }
    };

    return (
        <div className="d-flex flex-column align-items-center w-100" style={{ maxWidth: '800px', margin: '0 auto' }}>
            
            {/* HUD */}
            <div className="d-flex justify-content-between w-100 mb-4 bg-dark bg-opacity-50 p-3 rounded border border-secondary">
                <div className="d-flex gap-4">
                     <div className="text-info fs-5 game-font">
                        SCORE: <span className="text-white">{score}</span>
                    </div>
                    <div className="text-warning fs-5 game-font">
                         LEVEL: <span className="text-white">{currentLevelIndex + 1}/{LEVELS.length}</span>
                    </div>
                </div>
                <div className={`fs-5 game-font ${timeLeft < 10 ? 'text-danger swing-animation' : 'text-success'}`}>
                    <FaClock className="me-2" />
                    TIME: {timeLeft}s
                </div>
            </div>

            {/* Game Area */}
            <div className="position-relative w-100 border border-success border-opacity-25 rounded-3 overflow-hidden" 
                 style={{ minHeight: '400px', backgroundColor: '#0a0a0a', boxShadow: '0 0 50px rgba(0, 255, 0, 0.05)' }}>
                
                {gameState === 'idle' && (
                    <div className="d-flex flex-column align-items-center justify-content-center h-100 w-100 p-5 text-center">
                        <FaTerminal className="text-success mb-4" size={60} />
                        <h2 className="text-success game-font mb-4">SYSTEM READY</h2>
                        <p className="text-secondary mb-5" style={{ maxWidth: '400px' }}>
                            Crack the logic patterns to unlock the firewall. 
                            Time is limited. Wrong attempts cost time.
                        </p>
                        <button 
                            className="btn btn-lg btn-outline-success rounded-pill px-5 py-3 game-font glow-effect"
                            onClick={startGame}
                        >
                            <FaPlay className="me-2" /> INITIALIZE HACK
                        </button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="p-5 d-flex flex-column align-items-center justify-content-center h-100">
                        <div className="mb-5 text-center">
                            <h6 className="text-secondary text-uppercase letter-spacing-2 mb-3">Target Protocol</h6>
                            <h1 className="text-white game-font display-4 mb-4" style={{ fontFamily: 'monospace' }}>
                                {currentLevel.question}
                            </h1>
                            {showHint && <p className="text-info fst-italic animate__animated animate__fadeIn">Hint: {currentLevel.hint}</p>}
                        </div>

                        <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '400px' }}>
                            <div className="input-group mb-3">
                                <span className="input-group-text bg-dark border-success text-success">&gt;</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="form-control bg-dark border-success text-white game-font py-3"
                                    placeholder="Enter decryption key..."
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    autoFocus
                                />
                                <button className="btn btn-success" type="submit">ENTER</button>
                            </div>
                            <div className="d-flex justify-content-between">
                                <small className={`text-${feedback.includes('Granted') ? 'success' : 'danger'}`}>
                                    {feedback}
                                </small>
                                <button 
                                    type="button" 
                                    className="btn btn-link text-secondary text-decoration-none btn-sm"
                                    onClick={() => {
                                        setShowHint(true);
                                        setTimeLeft(prev => Math.max(0, prev - 10)); // Penalty for hint
                                    }}
                                >
                                    Use Hint (-10s)
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {(gameState === 'won' || gameState === 'lost') && (
                    <div className="d-flex flex-column align-items-center justify-content-center h-100 w-100 p-5 text-center">
                        {gameState === 'won' ? (
                            <FaLockOpen className="text-warning mb-4" size={60} />
                        ) : (
                            <FaLock className="text-danger mb-4" size={60} />
                        )}
                        
                        <h2 className={`game-font mb-2 ${gameState === 'won' ? 'text-warning' : 'text-danger'}`}>
                            {gameState === 'won' ? 'SYSTEM BREACHED' : 'ACCESS DENIED'}
                        </h2>
                        <h4 className="text-white mb-4">Final Score: {score}</h4>
                        
                        <button 
                            className="btn btn-outline-light rounded-pill px-4 py-2 game-font"
                            onClick={startGame}
                        >
                            <FaPlay className="me-2" /> REBOOT SYSTEM
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
