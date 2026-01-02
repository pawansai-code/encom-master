import { useState } from 'react';
import { FaBookOpen, FaPlus, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from '../../Components/Homepage/HomeNavbar';
import { HabitTracker, TodoManager } from './components/JournalComponents';
import './styles/Journal.css';

const JournalHub = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const entries = useSelector(state => state.journal.entries);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);

    const filteredEntries = entries.filter(e => {
        const lowerSearch = searchTerm.toLowerCase();
        const matchesSearch = e.title.toLowerCase().includes(lowerSearch) || 
                              e.content.toLowerCase().includes(lowerSearch) ||
                              (e.mood && e.mood.toLowerCase() === lowerSearch);
        const matchesDate = selectedDate ? e.date === selectedDate : true;
        
        return matchesSearch && matchesDate;
    });

    const handleCreateNew = () => {
        navigate('/journal/new');
    };

    const handleDateClick = (date) => {
        if (selectedDate === date) {
            setSelectedDate(null); // Deselect
        } else {
            setSelectedDate(date);
        }
    };

    return (
        <div className="journal-container">
            <HomeNavbar />
            
            <div className="container py-5 mt-5">
                {/* Header */}
                <div className="journal-header d-flex justify-content-between align-items-end mb-5 fade-in-up">
                    <div>
                        <h1 className="text-gradient mb-1 display-4 fw-bold">My Journal</h1>
                        <p className="text-secondary lead mb-0">Capture your thoughts, track your growth.</p>
                    </div>
                    <button className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2 shadow-lg" onClick={handleCreateNew}>
                        <FaPlus /> <span>New Entry</span>
                    </button>
                </div>

                <div className="row g-4">
                    {/* Left Column: Entries List */}
                    <div className="col-lg-8 fade-in-up">
                        <div className="journal-card mb-4" style={{ minHeight: 'auto' }}>
                             <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="input-group" style={{ maxWidth: '300px' }}>
                                    <span className="input-group-text bg-transparent border-end-0 border-secondary">
                                        <FaSearch className="text-secondary" />
                                    </span>
                                    <input 
                                        type="text" 
                                        className="form-control bg-transparent border-start-0 border-secondary text-light" 
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                {selectedDate && (
                                    <button className="btn btn-sm btn-outline-warning rounded-pill" onClick={() => setSelectedDate(null)}>
                                        Printing: {selectedDate} <FaTrash className="ms-1" />
                                    </button>
                                )}
                             </div>
                            <div className="d-flex gap-2 overflow-auto pb-1 custom-scrollbar">
                                <button 
                                    className={`btn btn-sm rounded-pill px-3 ${searchTerm === '' ? 'btn-light' : 'btn-outline-secondary'}`}
                                    onClick={() => setSearchTerm('')}
                                >
                                    All
                                </button>
                                {['Happy', 'Excited', 'Focused', 'Calm', 'Sad'].map(m => (
                                    <button 
                                        key={m}
                                        className={`btn btn-sm rounded-pill px-3 ${searchTerm.toLowerCase() === m.toLowerCase() ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => setSearchTerm(m)}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="d-flex flex-column gap-3">
                            {filteredEntries.map(entry => (
                                <div 
                                    key={entry.id} 
                                    className="entry-item"
                                    onClick={() => navigate(`/journal/${entry.id}`)}
                                >
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h4 className="fw-bold mb-0 text-light">{entry.title}</h4>
                                        <span className="entry-mood" title={`Mood: ${entry.mood}`}>
                                            {getMoodEmoji(entry.mood)}
                                        </span>
                                    </div>
                                    <p className="text-secondary small mb-2 line-clamp-2">
                                        {entry.content.substring(0, 150)}...
                                    </p>
                                    <div className="entry-date">
                                        {entry.date}
                                    </div>
                                </div>
                            ))}
                            {filteredEntries.length === 0 && (
                                <div className="text-center py-5">
                                    <FaBookOpen className="display-4 text-secondary opacity-50 mb-3" />
                                    <h4 className="text-secondary">No entries found</h4>
                                    <button className="btn btn-link text-accent-pink" onClick={handleCreateNew}>
                                        Write your first entry
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Widgets */}
                    <div className="col-lg-4 d-flex flex-column gap-4 fade-in-up" style={{ animationDelay: '0.1s' }}>

                        <TodoManager />
                        <HabitTracker />
                    </div>
                </div>
            </div>
        </div>
    );
};

const getMoodEmoji = (mood) => {
    switch(mood) {
        case 'happy': return '😄';
        case 'sad': return '😢';
        case 'excited': return '🤩';
        case 'focused': return '🤓';
        case 'calm': return '😌';
        default: return '😐';
    }
};

export default JournalHub;
