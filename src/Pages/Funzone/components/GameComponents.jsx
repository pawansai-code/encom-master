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

// --- Placeholder for others ---
export const PlaceholderGame = ({ name }) => (
    <div className="text-center py-5">
        <h2 className="text-secondary opacity-50 mb-3">🚧</h2>
        <h3>{name} is under construction</h3>
        <p>Our ninja developers are working on it!</p>
    </div>
);
