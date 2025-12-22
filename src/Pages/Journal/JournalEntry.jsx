import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaChevronLeft, FaSave, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HomeNavbar from '../../Components/Homepage/HomeNavbar';
import { addEntry, deleteEntry, updateEntry } from '../../State/slices/journalSlice';
import { HeatmapCalendar } from './components/JournalComponents';
import './styles/Journal.css';

const JournalEntry = () => {
    const { entryId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const existingEntry = useSelector(state => state.journal.entries.find(e => e.id === entryId));
    
    const isNew = entryId === 'new';

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('happy'); // Default mood
    const [tags, setTags] = useState(''); // New tags state

    useEffect(() => {
        if (!isNew && existingEntry) {
            setTitle(existingEntry.title);
            setContent(existingEntry.content);
            setMood(existingEntry.mood || 'happy');
            setTags(existingEntry.tags ? existingEntry.tags.join(', ') : '');
        } else if (!isNew && !existingEntry) {
            // Entry not found
            navigate('/journal');
        }
    }, [isNew, existingEntry, navigate]);

    const handleSave = () => {
        if (!title.trim() && !content.trim()) return;

        const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);

        if (isNew) {
            // New ID logic moved to slice ideally, but fine here
            dispatch(addEntry({ title, content, mood, tags: tagArray }));
            navigate('/journal');
        } else {
            dispatch(updateEntry({ id: entryId, title, content, mood, tags: tagArray, date: existingEntry.date }));
            navigate('/journal');
        }
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            dispatch(deleteEntry(entryId));
            navigate('/journal');
        }
    };

    const moods = [
        { id: 'happy', emoji: '😄' },
        { id: 'excited', emoji: '🤩' },
        { id: 'calm', emoji: '😌' },
        { id: 'focused', emoji: '🤓' },
        { id: 'sad', emoji: '😢' },
    ];

    return (
        <div className="journal-container">
            <HomeNavbar />

            <div className="container py-5 mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Link to="/journal" className="text-decoration-none text-secondary d-inline-flex align-items-center hover-white">
                        <FaChevronLeft className="me-2" /> Back to Journal
                    </Link>
                    <div className="d-flex gap-3">
                        {!isNew && (
                            <button className="btn btn-outline-danger d-flex align-items-center gap-2" onClick={handleDelete}>
                                <FaTrash /> Delete
                            </button>
                        )}
                        <button className="btn btn-primary d-flex align-items-center gap-2 px-4" onClick={handleSave}>
                            <FaSave /> Save
                        </button>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="journal-card">
                            <input 
                                type="text" 
                                className="form-control bg-transparent border-0 text-light display-5 fw-bold mb-3 ps-0" 
                                placeholder="Title your thought..."
                                style={{ boxShadow: 'none' }}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            
                            <div className="d-flex align-items-center gap-3 mb-4 text-secondary small border-bottom border-secondary border-opacity-25 pb-3">
                                <div className="d-flex align-items-center gap-2">
                                    <FaCalendarAlt />
                                    <span>{isNew ? new Date().toLocaleDateString() : existingEntry?.date}</span>
                                </div>
                                <div className="vr"></div>
                                <div className="mood-selector d-flex gap-2">
                                    {moods.map(m => (
                                        <button 
                                            key={m.id}
                                            className={mood === m.id ? 'active' : ''}
                                            onClick={() => setMood(m.id)}
                                            title={m.id}
                                        >
                                            {m.emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-3">
                                <input 
                                    type="text" 
                                    className="form-control bg-transparent text-secondary border-0 ps-0" 
                                    placeholder="Add tags (comma separated)..."
                                    style={{ fontSize: '0.9rem' }}
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                />
                            </div>

                            {/* Editor Toolbar - Visual Only for now */}
                            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-secondary border-opacity-25 text-secondary">
                                <button className="btn btn-sm btn-link text-secondary p-0 me-2" title="Bold"><strong>B</strong></button>
                                <button className="btn btn-sm btn-link text-secondary p-0 me-2" title="Italic"><em>I</em></button>
                                <button className="btn btn-sm btn-link text-secondary p-0 me-2" title="Underline"><u>U</u></button>
                                <div className="vr mx-2"></div>
                                <button className="btn btn-sm btn-link text-secondary p-0 me-2" title="List"><i className="bi bi-list-ul"></i>List</button>
                                <button className="btn btn-sm btn-link text-secondary p-0 me-2" title="Quote">"</button>
                            </div>

                            <textarea 
                                className="journal-editor-textarea"
                                placeholder="Write your story here..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    <div className="col-lg-4 d-none d-lg-block">
                        <div className="journal-card bg-opacity-50">
                            <h6 className="fw-bold mb-3 text-secondary">Writing Prompts</h6>
                            <ul className="text-secondary small ps-3 mb-4">
                                <li className="mb-2">What made you smile today?</li>
                                <li className="mb-2">What was the biggest challenge you faced?</li>
                                <li className="mb-2">One thing you learned...</li>
                            </ul>
                            
                            <h6 className="fw-bold mb-3 text-secondary mt-5">Recent Activity</h6>
                            <HeatmapCalendar />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JournalEntry;
