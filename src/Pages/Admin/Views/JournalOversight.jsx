import { useEffect } from 'react';
import { FaEye, FaFlag, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlaggedEntries } from '../../../State/slices/journalSlice'; // Ideally add deleteFlaggedEntry too

const JournalOversight = () => {
    const dispatch = useDispatch();
    const flaggedEntries = useSelector(state => state.journal.flaggedEntries);

    useEffect(() => {
        dispatch(fetchFlaggedEntries());
    }, [dispatch]);

    const handleDelete = (id) => {
        if(window.confirm('Delete this journal entry?')) {
            // dispatch(deleteEntry(id)); // Needs logic to delete from USER and ADMIN nodes. 
            // For now, let's assume visual removal or implement admin delete later.
            console.log("Delete not fully implemented for dual-node yet");
        }
    };

    return (
        <div className="admin-view">
           <header className="view-header mb-4">
                <h2 className="view-title">Journal Oversight</h2>
                <div className="text-muted small">Monitor flagged entries and ensure community safety.</div>
            </header>

            <div className="alert alert-warning d-flex align-items-center gap-2">
                <FaFlag /> 
                <span><strong>Attention:</strong> {flaggedEntries.length} entries have been flagged by the AI safety filter.</span>
            </div>

            {flaggedEntries.length === 0 && (
                <div className="text-center py-5 text-muted">
                    No flagged content. The community is safe!
                </div>
            )}

            <div className="row">
                {flaggedEntries.map(entry => (
                    <div key={entry.id} className="col-md-6 mb-4">
                        <div className="admin-card border-danger h-100">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h5 className="mb-1 text-white">{entry.userName || 'Unknown User'}</h5>
                                    <small className="text-muted">{entry.date}</small>
                                </div>
                                <span className="badge bg-danger">Flagged</span>
                            </div>
                            <div className="bg-dark p-3 rounded mb-3 text-light" style={{minHeight: '80px'}}>
                                "{entry.content}"
                            </div>
                            <div className="d-flex justify-content-end gap-2">
                                <button className="btn btn-sm btn-outline-info">
                                    <FaEye /> View Full
                                </button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(entry.id)}>
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JournalOversight;
