import { FaBan, FaCheckCircle, FaExclamationTriangle, FaFlag, FaTrashAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { banUser, deleteReport, resolveReport, selectAllReports } from '../../../State/slices/adminSlice';

const CommunityModeration = () => {
    const dispatch = useDispatch();
    const reports = useSelector(selectAllReports);

    const handleBanAndResolve = (userId, reportId) => {
        if(window.confirm(`Are you sure you want to BAN ${userId} and resolve this report?`)) {
            dispatch(banUser(userId));
            dispatch(resolveReport(reportId));
        }
    };

    return (
        <div className="admin-content-view animate-fade-in">
            <h3 className="fw-bold mb-4">Community Moderation</h3>

            <div className="row">
                <div className="col-lg-8">
                     <h5 className="mb-3 text-secondary text-uppercase small fw-bold ls-1">Flagged Content Queue</h5>
                     
                     <div className="d-flex flex-column gap-3">
                        {reports.length === 0 && (
                            <div className="text-center p-5 text-muted bg-white bg-opacity-5 rounded">
                                <FaCheckCircle size={40} className="mb-3 text-success opacity-50" />
                                <p>All clear! No pending reports.</p>
                            </div>
                        )}

                        {reports.map(report => (
                            <div key={report.id} className={`admin-card p-3 border-start border-4 ${report.status === 'resolved' ? 'border-success opacity-50' : 'border-danger'}`}>
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="d-flex gap-3">
                                        <div className="p-2 bg-danger bg-opacity-10 text-danger rounded h-100">
                                            <FaFlag />
                                        </div>
                                        <div>
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <h6 className="fw-bold mb-0 text-white">Report against <span className="text-info">@{report.reportedUser}</span></h6>
                                                {report.status === 'resolved' && <span className="badge bg-success">Resolved</span>}
                                            </div>
                                            <p className="small text-muted mb-1">Reason: <span className="text-white">{report.reason}</span></p>
                                            <code className="d-block p-2 bg-black bg-opacity-30 rounded small text-secondary mb-2">
                                                Context: {report.context}
                                            </code>
                                            <div className="small text-secondary">Reported by: @{report.reporter}</div>
                                        </div>
                                    </div>

                                    {report.status !== 'resolved' && (
                                        <div className="d-flex gap-2">
                                            <button 
                                                className="btn btn-sm btn-outline-success" 
                                                title="Resolve (Ignore)"
                                                onClick={() => dispatch(resolveReport(report.id))}
                                            >
                                                <FaCheckCircle /> Resolve
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-danger" 
                                                title="Ban User"
                                                onClick={() => handleBanAndResolve(report.reportedUser, report.id)}
                                            >
                                                <FaBan /> BOOM
                                            </button>
                                        </div>
                                    )}
                                    {report.status === 'resolved' && (
                                        <button className="btn btn-sm btn-link text-secondary" onClick={() => dispatch(deleteReport(report.id))}><FaTrashAlt /></button>
                                    )}
                                </div>
                            </div>
                        ))}
                     </div>
                </div>

                <div className="col-lg-4">
                    <div className="admin-card bg-warning bg-opacity-10 border-warning border-opacity-25">
                        <div className="d-flex align-items-center gap-3 mb-3">
                             <FaExclamationTriangle className="text-warning fs-3" />
                             <h5 className="fw-bold mb-0">Moderation Status</h5>
                        </div>
                        <div className="d-flex justify-content-between mb-2 small">
                             <span>Pending Reports</span>
                             <span className="fw-bold">{reports.filter(r => r.status === 'pending').length}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2 small">
                             <span>Avg Response Time</span>
                             <span className="fw-bold">12m</span>
                        </div>
                        <hr className="border-warning opacity-25" />
                        <button className="btn btn-warning w-100 fw-bold text-dark">View Moderation Logs</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityModeration;
