import { useEffect } from 'react';
import { FaChartLine, FaGamepad, FaPlus, FaTrash, FaTrophy } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { deleteGame, fetchGames, toggleGameStatus } from '../../../State/slices/gameSlice';

const FunzoneManagement = () => {
    const dispatch = useDispatch();
    const games = useSelector((state) => state.games.games);
    
    useEffect(() => {
        dispatch(fetchGames());
    }, [dispatch]);

    const handleStatusToggle = (game) => {
        dispatch(toggleGameStatus({ id: game.id, currentStatus: game.status }));
    };

    const handleDelete = (id) => {
        if(window.confirm('Are you sure? This will remove the game and all its data.')) {
            dispatch(deleteGame(id));
        }
    };

    return (
        <div className="admin-view">
            <header className="view-header mb-4 d-flex justify-content-between">
                <div>
                    <h2 className="view-title">Funzone Management</h2>
                    <p className="text-muted">Manage arcade games and leaderboards</p>
                </div>
                <button className="btn btn-primary btn-sm h-50">
                    <FaPlus /> Add New Game
                </button>
            </header>

            <div className="stats-grid mb-4">
                <div className="admin-card">
                    <div className="stat-label">Total Games</div>
                    <div className="stat-value">{games.length}</div>
                </div>
                <div className="admin-card">
                    <div className="stat-label">Total Plays (All Time)</div>
                    <div className="stat-value text-accent">{games.reduce((acc, g) => acc + g.plays, 0).toLocaleString()}</div>
                </div>
                <div className="admin-card">
                    <div className="stat-label">Top Rated</div>
                    <div className="stat-value text-success">Memory Ninja</div>
                </div>
            </div>

            <div className="admin-card overflow-hidden p-0">
                <table className="table table-dark table-hover mb-0">
                    <thead>
                        <tr>
                            <th className="p-3">Game Name</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Plays</th>
                            <th className="p-3">Rating</th>
                            <th className="p-3 text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map(game => (
                            <tr key={game.id}>
                                <td className="p-3 fw-bold">
                                    <FaGamepad className="me-2 text-muted" />
                                    {game.name}
                                </td>
                                <td className="p-3">
                                    <span className="badge bg-secondary opacity-50">{game.category}</span>
                                </td>
                                <td className="p-3">
                                    <span 
                                        className={`badge bg-${game.status === 'active' ? 'success' : 'warning'} cursor-pointer`}
                                        onClick={() => handleStatusToggle(game)}
                                        style={{cursor: 'pointer'}}
                                        title="Click to toggle status"
                                    >
                                        {game.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-3">{game.plays.toLocaleString()}</td>
                                <td className="p-3 text-warning">★ {game.rating}</td>
                                <td className="p-3 text-end">
                                    <button className="btn btn-sm btn-outline-info me-2" title="Analytics">
                                        <FaChartLine />
                                    </button>
                                    <button className="btn btn-sm btn-outline-warning me-2" title="Reset Leaderboard">
                                        <FaTrophy />
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(game.id)}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FunzoneManagement;
