import { useEffect } from 'react';
import { FaChevronLeft, FaInfoCircle, FaTrophy } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import HomeNavbar from '../../Components/Homepage/HomeNavbar';
import { updateActivity } from '../../State/slices/userSlice';
import { ChessLite } from './components/ChessLite';
import { CodeBreaker } from './components/CodeBreaker';
import { MemoryGame, PlaceholderGame, TicTacToeGame, TypingGame } from './components/GameComponents';
import { GeometryDashGame } from './components/GeometryDashGame';
import { HangmanGame } from './components/HangmanGame';
import { SnakeGame } from './components/SnakeGame';
import { GAMES_CONFIG } from './gamesConfig';
import './styles/Funzone.css';

const GameView = () => {
    const dispatch = useDispatch();
    const { gameId } = useParams();

    const game = GAMES_CONFIG.find(g => g.id === gameId);
    // Use a stable selector or handle default value outside to prevent infinite re-render loops/warnings
    const rawLeaderboards = useSelector(state => state.games.leaderboards[gameId]);
    const leaderboards = rawLeaderboards || [];
    
    // Scroll to top on load and Log Activity
    useEffect(() => {
        window.scrollTo(0, 0);

        if (game) {
            // Log activity to backend (Earn XP!)
            // Debounce or ensure we only log once per session? 
            // For now, logging on "View" is acceptable for "Play" credit, 
            // but ideally we hook into "Game Over" events.
            // Let's log a small "participation" amount.
            dispatch(updateActivity({
                type: 'game_play',
                gameId: gameId,
                xpEarned: 10, // 10 XP for starting a game
                description: `Played ${game.name}`
            }));
        }
    }, [gameId, dispatch, game]);

    if (!game) {
        return <div className="text-white text-center py-5">Game not found.</div>;
    }

    const renderGame = () => {
        switch (gameId) {
            case 'tic-tac-toe': return <TicTacToeGame />;
            case 'memory': return <MemoryGame />;
            case 'typing': return <TypingGame />;
            case 'snake': return <SnakeGame />;
            case 'chess-lite': return <ChessLite />;
            case 'code-breaker': return <CodeBreaker />;
            case 'hangman': return <HangmanGame />;
            case 'geometry-dash': return <GeometryDashGame />;
            default: return <PlaceholderGame name={game.name} />;
        }
    };

    return (
        <div className="funzone-container">
            <HomeNavbar />
            
            <div className="container py-5 mt-4">
                <div className="mb-4">
                    <Link to="/funzone" className="text-decoration-none text-secondary d-inline-flex align-items-center mb-3 hover-white">
                        <FaChevronLeft className="me-2" /> Back to Funzone
                    </Link>
                    <div className="d-flex align-items-center gap-3">
                        <div 
                            className="game-icon-wrapper mb-0"
                            style={{ color: game.accentColor, width: '60px', height: '60px', fontSize: '2rem' }}
                        >
                            <game.icon />
                        </div>
                        <div>
                            <h1 className="fw-bold mb-0 text-white">{game.name}</h1>
                            <p className="text-secondary mb-0">{game.description}</p>
                        </div>
                        <div className="ms-auto d-none d-md-block">
                             <span className="badge bg-secondary bg-opacity-25 border border-secondary text-light px-3 py-2 rounded-pill">
                                {game.category}
                             </span>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-lg-8">
                        <div 
                            className="game-workspace"
                            style={{
                                '--game-primary-glass': `${game.accentColor}20`,
                                '--game-primary-glow': `${game.accentColor}40`,
                                '--game-primary': game.accentColor
                            }}
                        >
                            <div className="game-header">
                                <span className="text-uppercase small fw-bold text-secondary tracking-wider">
                                    Difficulty: <span className="text-light">{game.difficulty}</span>
                                </span>
                                <button className="btn btn-sm btn-outline-info rounded-pill px-3">
                                    <FaInfoCircle className="me-1" /> Instructions
                                </button>
                            </div>
                            <div className="game-area">
                                {renderGame()}
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-4">
                        <div className="leaderboard-card">
                            <div className="leaderboard-header text-warning">
                                <FaTrophy /> Top Players
                            </div>
                            {leaderboards.length > 0 ? (
                                <div className="leaderboard-list">
                                    {leaderboards.map((entry, index) => (
                                        <div key={index} className="leaderboard-item">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className={`leaderboard-rank rank-${index + 1}`}>
                                                    {index + 1}
                                                </div>
                                                <span className="fw-bold text-light">{entry.user}</span>
                                            </div>
                                            <span className="text-gradient fw-bold">{entry.score} pts</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-secondary small">
                                    No scores recorded yet. Be the first!
                                </div>
                            )}
                        </div>

                         <div className="mt-4 p-4 rounded-3 bg-opacity-10 bg-white border border-secondary border-opacity-25">
                            <h6 className="fw-bold text-light mb-2">How to Play</h6>
                            <p className="small text-secondary mb-0">
                                {gameId === 'memory' ? "Find all matching pairs with fewer moves to get a higher score!" :
                                 gameId === 'typing' ? "Type the words as fast as you can. Don't make mistakes!" :
                                 gameId === 'tic-tac-toe' ? "Get 3 in a row to win against the AI." :
                                 gameId === 'hangman' ? "Guess the hidden word letter by letter before you run out of attempts." :
                                 gameId === 'geometry-dash' ? "Tap or Space to jump over obstacles. Don't crash!" :
                                 "Follow the on-screen instructions to win."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameView;
