import { useEffect, useState } from 'react';
import { FaLock, FaSearch, FaTrophy } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from '../../Components/Homepage/HomeNavbar';
import { fetchGames } from '../../State/slices/gameSlice';
import { GAMES_CONFIG } from './gamesConfig';
import './styles/Funzone.css';

const FunzoneHub = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { games: fetchedGames, status } = useSelector((state) => state.games);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchGames());
        }
    }, [status, dispatch]);

    // Merge fetched DB data with local config for Icons/Paths (since functions/components can't be stored in DB)
    // Use local config as the source of truth for available games, merge with DB data if available
    const displayGames = GAMES_CONFIG.map(localGame => {
        const dbGame = fetchedGames.find(g => g.id === localGame.id) || {};
        return { ...localGame, ...dbGame };
    });

    const categories = ['All', ...new Set(displayGames.map(game => game.category))];

    const filteredGames = displayGames.filter(game => {
        const matchesSearch = game.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              game.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getDifficultyColor = (diff) => {
        switch(diff) {
            case 'Easy': return '#4ade80';
            case 'Medium': return '#facc15';
            case 'Hard': return '#f87171';
            case 'Expert': return '#c084fc';
            default: return 'white';
        }
    };

    return (
        <div className="funzone-container">
            <HomeNavbar />
            
            <div className="container py-5 mt-5">
                <div className="text-center fade-in-up mb-5">
                    <h1 className="fw-bold display-4 mb-2">
                        <span className="text-gradient">Gaming Funzone</span> 🎮
                    </h1>
                    <p className="lead text-secondary">
                        Play, compete, and climb the leaderboards in the Eduverse arcade.
                    </p>
                    
                    <div className="row justify-content-center mt-4">
                        <div className="col-md-6">
                            <div className="input-group mb-3">
                                <span className="input-group-text bg-transparent border-end-0 border-secondary">
                                    <FaSearch className="text-secondary" />
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control bg-transparent border-start-0 border-secondary text-light" 
                                    placeholder="Search games..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button 
                                className="btn w-100 btn-outline-warning d-flex justify-content-center align-items-center gap-2 py-2"
                                onClick={() => navigate('/leaderboards?tab=funzone')}
                            >
                                <FaTrophy /> View Funzone Leaderboard
                            </button>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center gap-2 mt-4 flex-wrap">
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                className={`btn rounded-pill px-3 py-1 btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="row g-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {filteredGames.map((game) => (
                        <div key={game.id} className="col-md-6 col-lg-4">
                            <div 
                                className={`game-card d-flex flex-column ${game.status === 'maintenance' ? 'opacity-75' : ''}`}
                                onClick={() => game.status !== 'maintenance' && navigate(game.path)}
                                style={{ 
                                    '--game-color': game.accentColor || '#3b82f6', 
                                    '--game-glow': `${game.accentColor || '#3b82f6'}40`,
                                    cursor: game.status === 'maintenance' ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {game.status === 'maintenance' && (
                                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75" style={{zIndex: 10, borderRadius: '16px'}}>
                                        <div className="text-center text-warning">
                                            <FaLock size={32} className="mb-2" />
                                            <h5 className="fw-bold">MAINTENANCE</h5>
                                        </div>
                                    </div>
                                )}
                                <span 
                                    className="game-difficulty" 
                                    style={{ color: getDifficultyColor(game.difficulty), borderColor: getDifficultyColor(game.difficulty) }}
                                >
                                    {game.difficulty || 'Medium'}
                                </span>
                                
                                <div 
                                    className="game-icon-wrapper"
                                    style={{ color: game.accentColor }}
                                >
                                    {game.icon ? <game.icon /> : <FaGamepad />}
                                </div>
                                <h3 className="fw-bold mb-1 text-light">{game.name}</h3>
                                <p className="text-secondary small mb-3">{game.category}</p>
                                <p className="text-secondary opacity-75 small mb-0">{game.description || 'Experience this amazing game!'}</p>
                                
                                <div className="mt-auto pt-3 d-flex align-items-center text-warning small">
                                    <FaTrophy className="me-2" />
                                    <span>Compete for glory!</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {filteredGames.length === 0 && (
                        <div className="col-12 text-center py-5">
                            <h3 className="text-secondary">No games found.</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FunzoneHub;
