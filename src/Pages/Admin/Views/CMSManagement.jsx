import { useEffect, useState } from 'react';
import { FaBullhorn, FaEdit, FaPlus, FaQuestionCircle, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addAnnouncement, deleteAnnouncement, fetchAnnouncements, selectAnnouncementStatus, selectAnnouncements } from '../../../State/slices/announcementSlice';

const CMSManagement = () => {
    const dispatch = useDispatch();
    const announcements = useSelector(selectAnnouncements);
    const status = useSelector(selectAnnouncementStatus);
    
    const [activeTab, setActiveTab] = useState('announcements'); // announcements, blog, faq
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', type: 'info' });
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAnnouncements());
        }
    }, [status, dispatch]);

    const handleAddAnnouncement = async (e) => {
        e.preventDefault();
        await dispatch(addAnnouncement(newAnnouncement));
        setNewAnnouncement({ title: '', content: '', type: 'info' });
        setIsAdding(false);
    };

    const handleDelete = (id) => {
        if(window.confirm('Are you sure you want to delete this announcement?')) {
            dispatch(deleteAnnouncement(id));
        }
    };

    return (
        <div className="admin-view">
            <header className="view-header mb-4">
                <h2 className="view-title">Content Management System</h2>
                <div className="view-actions">
                    <button 
                        className={`btn btn-sm ${activeTab === 'announcements' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('announcements')}
                    >
                        <FaBullhorn /> Announcements
                    </button>
                    <button 
                        className={`btn btn-sm ${activeTab === 'blog' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('blog')}
                    >
                        <FaEdit /> Blogs
                    </button>
                    <button 
                        className={`btn btn-sm ${activeTab === 'faq' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('faq')}
                    >
                        <FaQuestionCircle /> FAQs
                    </button>
                </div>
            </header>

            {activeTab === 'announcements' && (
                <div className="cms-section">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="text-white">Active Announcements</h4>
                        <button className="btn btn-success btn-sm" onClick={() => setIsAdding(!isAdding)}>
                            <FaPlus /> New Announcement
                        </button>
                    </div>

                    {isAdding && (
                        <div className="admin-card mb-4 border-success">
                            <form onSubmit={handleAddAnnouncement}>
                                <div className="mb-3">
                                    <label className="form-label text-muted">Title</label>
                                    <input 
                                        type="text" 
                                        className="form-control bg-dark text-white border-secondary"
                                        value={newAnnouncement.title}
                                        onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted">Content</label>
                                    <textarea 
                                        className="form-control bg-dark text-white border-secondary"
                                        rows="3"
                                        value={newAnnouncement.content}
                                        onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted">Type</label>
                                    <select 
                                        className="form-select bg-dark text-white border-secondary"
                                        value={newAnnouncement.type}
                                        onChange={(e) => setNewAnnouncement({...newAnnouncement, type: e.target.value})}
                                    >
                                        <option value="info">Info</option>
                                        <option value="alert">Alert</option>
                                        <option value="success">Success</option>
                                    </select>
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-success">Publish</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="announcements-list">
                        {announcements.map((item) => (
                            <div key={item.id} className="admin-card mb-3 d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <span className={`badge bg-${item.type === 'alert' ? 'danger' : (item.type === 'success' ? 'success' : 'info')}`}>
                                            {item.type.toUpperCase()}
                                        </span>
                                        <h5 className="mb-0 text-white">{item.title}</h5>
                                    </div>
                                    <p className="text-muted mb-0 small">{item.content}</p>
                                    <small className="text-secondary">{new Date(item.date).toLocaleDateString()}</small>
                                </div>
                                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(item.id)}>
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                        {announcements.length === 0 && <p className="text-muted text-center">No announcements found.</p>}
                    </div>
                </div>
            )}

            {activeTab === 'blog' && (
                <div className="text-center py-5">
                    <FaEdit size={40} className="text-muted mb-3" />
                    <h4 className="text-muted">Blog Manager Coming Soon</h4>
                    <p className="text-secondary">This module is currently under development.</p>
                </div>
            )}

            {activeTab === 'faq' && (
                <div className="text-center py-5">
                    <FaQuestionCircle size={40} className="text-muted mb-3" />
                    <h4 className="text-muted">FAQ Editor Coming Soon</h4>
                    <p className="text-secondary">This module is currently under development.</p>
                </div>
            )}
        </div>
    );
};

export default CMSManagement;
