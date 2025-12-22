import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaChevronRight, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addAnnouncement, deleteAnnouncement, fetchAnnouncements } from '../../State/slices/announcementSlice';

const Announcements = () => {
    const dispatch = useDispatch();
    const { items: announcements, status } = useSelector((state) => state.announcements);
    const userProfile = useSelector((state) => state.user.profile);
    const isAdmin = userProfile?.role === 'admin';

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Update'
    });

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAnnouncements());
        }
    }, [status, dispatch]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description) return;
        
        await dispatch(addAnnouncement(formData));
        setFormData({ title: '', description: '', category: 'Update' });
        setShowForm(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            dispatch(deleteAnnouncement(id));
        }
    };

    const formatDate = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <section className="announcements-section">
            <div className="features-container">
                <div className="section-header text-center mb-5">
                    <h2 className="hero-title" style={{ fontSize: '42px' }}>
                        Latest <span className="ninja-text">Announcements</span>
                    </h2>
                    <p className="hero-subtitle">Stay updated with the latest news from the multiverse.</p>
                </div>

                {/* Admin Controls */}
                {isAdmin && (
                    <div className="text-center mb-4">
                        <button 
                            className="btn btn-outline-light d-inline-flex align-items-center gap-2"
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add Announcement</>}
                        </button>
                    </div>
                )}

                {/* Add Form */}
                {showForm && isAdmin && (
                    <div className="announcement-card-wrapper mb-4 p-4 border-warning border">
                        <h4 className="text-white mb-3">New Announcement</h4>
                        <form onSubmit={handleAdd}>
                            <div className="mb-3">
                                <input 
                                    type="text" 
                                    className="form-control bg-dark text-white border-secondary" 
                                    placeholder="Title"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <select 
                                    className="form-select bg-dark text-white border-secondary"
                                    value={formData.category}
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="Update">Update</option>
                                    <option value="Event">Event</option>
                                    <option value="System">System</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <textarea 
                                    className="form-control bg-dark text-white border-secondary" 
                                    rows="3" 
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Post Announcement</button>
                        </form>
                    </div>
                )}

                <div className="announcement-card-wrapper">
                    {announcements.length === 0 && (
                        <div className="text-center text-secondary py-4">
                            No announcements yet.
                        </div>
                    )}

                    {announcements.map((item) => (
                        <div key={item.id} className="announcement-item position-relative group">
                            <div className="announcement-date">
                                <FaCalendarAlt className="me-2" /> {formatDate(item.date)}
                            </div>
                            <div className="announcement-content">
                                <div className="d-flex align-items-center gap-3 mb-2">
                                    <span className={`badge-category category-${item.category.toLowerCase()}`}>
                                        {item.category}
                                    </span>
                                    <h4 className="announcement-title mb-0">{item.title}</h4>
                                </div>
                                <p className="announcement-desc">{item.description}</p>
                            </div>
                            <div className="announcement-action d-flex align-items-center gap-2">
                                {isAdmin && (
                                    <button 
                                        className="btn-icon bg-danger bg-opacity-10 text-danger border-danger border-opacity-25"
                                        onClick={() => handleDelete(item.id)}
                                        title="Delete Announcement"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                )}
                                <button className="btn-icon">
                                    <FaChevronRight />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Announcements;
