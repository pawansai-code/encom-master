import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { submitScore } from '../../../State/slices/gameSlice';

// --- Tic Tac Toe ---
export const TicTacToeGame = () => {
    const dispatch = useDispatch();
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const winner = calculateWinner(board);
    const isDraw = !winner && board.every(Boolean);

    const handleClick = (i) => {
        if (winner || board[i]) return;
        const newBoard = [...board];
        newBoard[i] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
    };

    useEffect(() => {
        if (winner) {
            // Mock score 100 for win
            dispatch(submitScore({ gameId: 'tic-tac-toe', score: 100, user: winner === 'X' ? 'You' : 'AI' }));
        }
    }, [winner, dispatch]);

    function calculateWinner(squares) {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    }

    return (
        <div className="text-center">
            <h2 className="game-font mb-4 text-warning">
                {winner ? `Winner: ${winner}` : isDraw ? "It's a Draw!" : `Next Player: ${isXNext ? 'X' : 'O'}`}
            </h2>
            <div className="ttt-grid mx-auto" style={{ width: 'fit-content' }}>
                {board.map((val, i) => (
                    <div 
                        key={i} 
                        className="ttt-cell" 
                        style={{ color: val === 'X' ? '#FF6B6B' : '#4ECDC4' }}
                        onClick={() => handleClick(i)}
                    >
                        {val}
                    </div>
                ))}
            </div>
            <button className="btn btn-outline-light mt-4" onClick={resetGame}>Restart Game</button>
        </div>
    );
};

// --- Memory Game ---
const CARDS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
const DECK = [...CARDS, ...CARDS];

export const MemoryGame = () => {
    const dispatch = useDispatch();
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [moves, setMoves] = useState(0);

    useEffect(() => {
        shuffleCards();
    }, []);

    const shuffleCards = () => {
        const shuffled = [...DECK].sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setFlipped([]);
        setSolved([]);
        setMoves(0);
    };

    const handleCardClick = (index) => {
        if (flipped.length === 2 || flipped.includes(index) || solved.includes(index)) return;
        
        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            const [first, second] = newFlipped;
            if (cards[first] === cards[second]) {
                setSolved(prev => [...prev, first, second]);
                setFlipped([]);
                if (solved.length + 2 === cards.length) {
                    dispatch(submitScore({ gameId: 'memory', score: 100 - moves, user: 'You' }));
                }
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    return (
        <div className="text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="d-flex justify-content-between mb-4">
                <h4 className="text-info">Moves: {moves}</h4>
                <button className="btn btn-sm btn-outline-secondary" onClick={shuffleCards}>Reset</button>
            </div>
            <div className="memory-grid">
                {cards.map((emoji, i) => (
                    <div 
                        key={i} 
                        className={`memory-card ${flipped.includes(i) || solved.includes(i) ? '' : 'hidden'}`}
                        onClick={() => handleCardClick(i)}
                    >
                        <div className="memory-card-inner">
                            {flipped.includes(i) || solved.includes(i) ? emoji : ''}
                        </div>
                    </div>
                ))}
            </div>
            {solved.length === cards.length && (
                 <h2 className="text-warning mt-4 game-font">YOU WON!</h2>
            )}
        </div>
    );
};

// --- Typing Game ---
const WORDS = ['react', 'redux', 'javascript', 'frontend', 'developer', 'coding', 'ninja', 'eduverse', 'keyboard', 'speed'];

export const TypingGame = () => {
    const dispatch = useDispatch();
    const [word, setWord] = useState('');
    const [input, setInput] = useState('');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if(score > 0) dispatch(submitScore({ gameId: 'typing', score: score * 10, user: 'You' }));
        }
    }, [isActive, timeLeft, score, dispatch]);

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setIsActive(true);
        setInput('');
        nextWord();
    };

    const nextWord = () => {
        const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        setWord(randomWord);
    };

    const handleChange = (e) => {
        const val = e.target.value;
        setInput(val);
        if (val === word) {
            setScore(s => s + 1);
            setInput('');
            nextWord();
        }
    };

    return (
        <div className="text-center" style={{ maxWidth: '500px', margin: '0 auto' }}>
            {!isActive && timeLeft !== 0 && (
                <button className="btn btn-primary btn-lg px-5" onClick={startGame}>Start Typing Test</button>
            )}
            
            {(isActive || timeLeft === 0) && (
                <div>
                    <div className="d-flex justify-content-between mb-4 fs-4 fw-bold">
                        <span className="text-danger">Time: {timeLeft}s</span>
                        <span className="text-success">Score: {score}</span>
                    </div>
                    
                    {timeLeft > 0 ? (
                        <>
                            <h1 className="display-3 mb-4 fw-bold user-select-none" style={{ letterSpacing: '5px' }}>{word}</h1>
                            <input 
                                type="text" 
                                className="form-control form-control-lg text-center bg-transparent text-white border-secondary fs-2" 
                                value={input} 
                                onChange={handleChange}
                                autoFocus
                            />
                        </>
                    ) : (
                        <div>
                            <h2 className="mb-3">Game Over!</h2>
                            <p className="fs-4">Final Score: <span className="text-warning">{score}</span></p>
                            <button className="btn btn-outline-light mt-2" onClick={startGame}>Play Again</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// --- Placeholder for others ---
export const PlaceholderGame = ({ name }) => (
    <div className="text-center py-5">
        <h2 className="text-secondary opacity-50 mb-3">🚧</h2>
        <h3>{name} is under construction</h3>
        <p>Our ninja developers are working on it!</p>
    </div>
);
