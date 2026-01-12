
import { useEffect, useRef, useState } from 'react';
import { FaKeyboard, FaPlay, FaRedo } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { submitScore } from '../../../State/slices/gameSlice';

const WORDS_LIST = [
    'react', 'redux', 'javascript', 'frontend', 'developer', 'coding', 'ninja', 'eduverse', 
    'keyboard', 'speed', 'algorithm', 'component', 'interface', 'variable', 'function', 
    'constant', 'framework', 'library', 'browser', 'server', 'database', 'api', 'json', 
    'promise', 'async', 'await', 'callback', 'debugging', 'compile', 'execute', 'binary',
    'sytle', 'design', 'animation', 'responsive', 'mobile', 'desktop', 'performance', 
    'optimize', 'deploy', 'github', 'version', 'control', 'merge', 'branch', 'command',
    'terminal', 'console', 'syntax', 'error', 'warning', 'hook', 'state', 'effect',
    'context', 'router', 'navigation', 'layout', 'grid', 'flexbox', 'container', 'wrapper'
];

export const SpeedTyperGame = () => {
    const dispatch = useDispatch();
    const inputRef = useRef(null);
    
    // Game State
    const [currentWord, setCurrentWord] = useState('');
    const [nextWord, setNextWord] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [highScore, setHighScore] = useState(0);
    const [correctChars, setCorrectChars] = useState(0); // For detailed accuracy visual

    useEffect(() => {
        const storedHighScore = localStorage.getItem('speedTyperHighScore');
        if (storedHighScore) {
            setHighScore(parseInt(storedHighScore, 10));
        }
    }, []);

    // Timer Logic
    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            endGame();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const startGame = () => {
        setScore(0);
        setTimeLeft(60);
        setIsActive(true);
        setIsGameOver(false);
        setInputValue('');
        setCorrectChars(0);
        pickNewWords();
        
        // Focus input after a brief delay to ensure render
        setTimeout(() => {
            if(inputRef.current) inputRef.current.focus();
        }, 100);
    };

    const pickNewWords = () => {
        const rand1 = WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
        let rand2 = WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
        while (rand1 === rand2) {
            rand2 = WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
        }
        setCurrentWord(rand1);
        setNextWord(rand2);
        setInputValue('');
        setCorrectChars(0);
    };

    const handleInput = (e) => {
        if (!isActive) return;
        
        const value = e.target.value;
        if (value.includes(' ')) {
            // Check word on space
            const trimmed = value.trim();
            if (trimmed === currentWord) {
                // Correct word
                setScore(prev => prev + 10 + currentWord.length); // Bonus for length
                // Shift words
                setCurrentWord(nextWord);
                setNextWord(WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)]);
                setInputValue('');
                setCorrectChars(0);
            } else {
                // Wrong word - clear input but penalty? Or just block?
                // For this game, let's just clear for flow, or keep it to force correction
                // We'll reset input to encourage speed over perfect correction
                setInputValue(''); 
            }
        } else {
            setInputValue(value);
            // Check how many chars match prefix so far for styling
            let matches = 0;
            for(let i=0; i<value.length; i++) {
                if (value[i] === currentWord[i]) matches++;
                else break; 
            }
            setCorrectChars(matches);
            
            // Auto-advance if fully correct (optional, but spaces are usually better delimiters)
            if (value === currentWord) {
                setScore(prev => prev + 10 + currentWord.length);
                setCurrentWord(nextWord);
                setNextWord(WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)]);
                setInputValue('');
                setCorrectChars(0);
            }
        }
    };

    const endGame = () => {
        setIsActive(false);
        setIsGameOver(true);
        clearInterval();
        
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('speedTyperHighScore', score.toString());
        }
        
        dispatch(submitScore({ gameId: 'typing', score: score, user: 'You' }));
    };

    const renderWord = () => {
        return currentWord.split('').map((char, index) => {
            let color = 'text-white';
            if (index < inputValue.length) {
                color = inputValue[index] === char ? 'text-success' : 'text-danger';
            }
            return (
                <span key={index} className={`fw-bold ${color}`} style={{ fontSize: '3rem', transition: 'color 0.2s' }}>
                    {char}
                </span>
            );
        });
    };

    return (
        <div className="d-flex flex-column align-items-center w-100">
            {/* HUD */}
             <div className="d-flex justify-content-between w-100 px-4 mb-4" style={{ maxWidth: '800px' }}>
                <div className="text-info fs-5 game-font">
                    SCORE: <span className="text-white">{score}</span>
                </div>
                 <div className={`fs-5 game-font ${timeLeft < 10 ? 'text-danger animate-pulse' : 'text-warning'}`}>
                    TIME: <span className="text-white">{timeLeft}s</span>
                </div>
                 <div className="text-success fs-5 game-font">
                    BEST: <span className="text-white">{highScore}</span>
                </div>
            </div>

            {/* Game Area */}
            <div className="game-container p-5 rounded-4 border border-secondary bg-dark bg-opacity-75 position-relative w-100 shadow-lg" style={{ maxWidth: '800px', minHeight: '400px' }}>
                
                {!isActive && !isGameOver && (
                    <div className="position-absolute top-50 start-50 translate-middle text-center z-3">
                         <h2 className="text-light mb-4 game-font">READY TO TYPE?</h2>
                         <button 
                            className="btn btn-lg btn-outline-warning rounded-pill px-5 py-3 game-font glow-effect"
                            onClick={startGame}
                            style={{ 
                                boxShadow: '0 0 20px rgba(255, 159, 28, 0.5)',
                                background: 'rgba(0,0,0,0.8)' 
                            }}
                        >
                            <FaPlay className="me-2" /> START TYPING
                        </button>
                        <p className="mt-4 text-secondary">Types words correctly to earn points.<br/>Bonus points for longer words!</p>
                    </div>
                )}

                {(isActive || isGameOver) && (
                    <div className="d-flex flex-column align-items-center justify-content-center h-100">
                        {isGameOver ? (
                             <div className="text-center">
                                <h1 className="display-4 fw-bold text-danger mb-3 font-monospace">TIME UP!</h1>
                                <p className="fs-3 text-white mb-4">Final Score: <span className="text-warning fw-bold">{score}</span></p>
                                <div className="text-secondary mb-4">
                                     ~ {Math.round(score / 5)} WPM (Approx)
                                </div>
                                <button 
                                    className="btn btn-info rounded-pill px-4 py-2 game-font"
                                    onClick={startGame}
                                >
                                    <FaRedo className="me-2" /> TRY AGAIN
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-2 text-secondary text-uppercase tracking-widest small">Current Word</div>
                                <div className="mb-5 p-4 rounded-3 bg-black bg-opacity-50 border border-secondary w-100 text-center" style={{ minHeight: '100px' }}>
                                    {renderWord()}
                                </div>
                                
                                <div className="mb-4 w-100 position-relative">
                                    <input 
                                        ref={inputRef}
                                        type="text" 
                                        className="form-control form-control-lg bg-dark text-white border-info text-center fs-3"
                                        placeholder="Type here..."
                                        value={inputValue}
                                        onChange={handleInput}
                                        autoFocus
                                        autoComplete="off"
                                        style={{ height: '60px', letterSpacing: '2px' }}
                                    />
                                    <FaKeyboard className="position-absolute top-50 end-0 translate-middle-y me-3 text-secondary fs-4" />
                                </div>

                                <div className="text-center opacity-50">
                                    <p className="small text-secondary mb-1">NEXT WORD</p>
                                    <h4 className="text-secondary fw-bold" style={{ filter: 'blur(1px)' }}>{nextWord}</h4>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
             <div className="mt-4 text-center text-secondary small">
                <p>Type the word and press <span className="text-light border border-secondary px-1 rounded">SPACE</span> or complete the word.</p>
            </div>
        </div>
    );
};
