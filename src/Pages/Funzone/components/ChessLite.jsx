
import { Chess } from 'chess.js';
import { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { FaChessKing, FaRedo, FaTrophy } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

export const ChessLite = () => {
    const dispatch = useDispatch();
    const [game, setGame] = useState(new Chess());
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [status, setStatus] = useState('');
    const [playerColor, setPlayerColor] = useState('white');
    const [boardWidth, setBoardWidth] = useState(500);

    // Responsive Board
    useEffect(() => {
        const handleResize = () => {
             const width = window.innerWidth;
             if (width < 550) {
                 setBoardWidth(width - 60);
             } else {
                 setBoardWidth(500);
             }
        };
        
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Initialize High Score
    useEffect(() => {
        const storedHighScore = localStorage.getItem('chessLiteHighScore');
        if (storedHighScore) {
            setHighScore(parseInt(storedHighScore, 10));
        }
    }, []);

    // Check game status on every move
    useEffect(() => {
        if (game.isGameOver()) {
            setIsGameOver(true);
            let result = '';
            let finalScore = score;

            if (game.isCheckmate()) {
                result = game.turn() === 'w' ? 'Black Wins!' : 'White Wins!';
                // Bonus for winning (assuming player is White)
                if (game.turn() === 'b' && playerColor === 'white') {
                    finalScore += 500;
                    setScore(s => s + 500); 
                }
            } else if (game.isDraw()) {
                result = 'Draw!';
                finalScore += 100;
                setScore(s => s + 100);
            } else {
                result = 'Game Over';
            }
            setStatus(result);
            
            // Save Score
            handleGameOver(finalScore);
        } else {
            setStatus(game.turn() === 'w' ? "White's Turn" : "Black's Turn");
            if (game.inCheck()) {
                setStatus(s => s + " (Check!)");
            }

            // AI Turn Handler
            // Assuming player is always White for now
            if (game.turn() === 'b' && !isGameOver) {
                const timeoutId = setTimeout(makeRandomMove, 500);
                return () => clearTimeout(timeoutId);
            }
        }
    }, [game]); 

    // ... (handleGameOver is fine, skipping to next part)

    // AI Logic
    const makeRandomMove = () => {
        const possibleMoves = game.moves();
        if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        
        const gameCopy = new Chess(game.fen());
        gameCopy.move(possibleMoves[randomIndex]);
        setGame(gameCopy);
    };

    function onDrop(sourceSquare, targetSquare) {
        if (isGameOver || game.turn() !== 'w') return false;
        
        const gameCopy = new Chess(game.fen());
        let move = null;
        
        try {
            move = gameCopy.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q', 
            });
        } catch(e) { move = null; }

        if (move === null) return false;
        
        // Scoring
        let points = 0;
        if (move.captured) {
            const values = { p: 10, n: 30, b: 30, r: 50, q: 90 };
            points = values[move.captured] || 10;
        }
        setScore(prev => prev + points + 1);
        
        setGame(gameCopy);
        return true;
    }

    const resetGame = () => {
        setGame(new Chess());
        setScore(0);
        setIsGameOver(false);
        setStatus("White's Turn");
    };

    return (
        <div className="d-flex flex-column align-items-center w-100 pb-4">
             <div className="d-flex justify-content-between w-100 px-4 mb-3" style={{ maxWidth: '600px' }}>
                <div className="text-info fs-5 game-font">
                    SCORE: <span className="text-white">{score}</span>
                </div>
                 <div className="text-center text-secondary small pt-1">
                    <FaChessKing className="me-1 mb-1"/> {status}
                </div>
                <div className="text-warning fs-5 game-font">
                    BEST: <span className="text-white">{highScore}</span>
                </div>
            </div>

            <div className="position-relative" style={{ width: '100%', maxWidth: '500px' }}>
                <div style={{
                    border: '3px solid #333',
                    borderRadius: '8px',
                    boxShadow: '0 0 30px rgba(0,0,0,0.5)',
                    overflow: 'hidden'
                }}>
                    <Chessboard 
                        id="ChessLiteBoard" 
                        position={game.fen()} 
                        onPieceDrop={onDrop}
                        boardWidth={boardWidth}
                        customDarkSquareStyle={{ backgroundColor: '#779556' }}
                        customLightSquareStyle={{ backgroundColor: '#ebecd0' }}
                    />
                </div>

                {isGameOver && (
                    <div className="position-absolute top-50 start-50 translate-middle text-center bg-dark bg-opacity-90 p-4 rounded-4 border border-info" style={{ minWidth: '300px', zIndex: 10 }}>
                        <h2 className="text-info game-font mb-3">{status}</h2>
                        <div className="text-warning mb-4">
                             <FaTrophy className="me-2 text-warning" />
                             <span className="fs-4">{score} Pts</span>
                        </div>
                        <button 
                            className="btn btn-light rounded-pill px-4 py-2 game-font fw-bold"
                            onClick={resetGame}
                        >
                            <FaRedo className="me-2" /> Play Again
                        </button>
                    </div>
                )}
            </div>
            
            <div className="mt-4 text-center">
                 <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={resetGame}>
                    <FaRedo className="me-1"/> Reset Board
                 </button>
                 <p className="mt-2 text-muted small">
                    Classic Chess vs AI. +Points for captures.
                 </p>
            </div>
        </div>
    );
};
