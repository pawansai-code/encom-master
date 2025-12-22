import { useEffect, useState } from 'react';
import { FaCheck, FaServer, FaTicketAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, updateTicketStatus } from '../../../State/slices/supportSlice';

const SupportLogs = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('tickets'); // tickets, logs
    const { tickets } = useSelector((state) => state.support);

    // Mock logs for now (Logs system usually requires backend streaming, keeping mock for UI unless requested)
    const [logs] = useState([
        { id: 1, type: 'error', msg: 'DB Connection Timeout', time: '10:00 AM' },
        { id: 2, type: 'info', msg: 'Daily backup successful', time: '02:00 AM' },
        { id: 3, type: 'warn', msg: 'High memory usage detected (85%)', time: 'Yesterday' },
    ]);

    useEffect(() => {
        dispatch(fetchTickets());
    }, [dispatch]);

    const handleResolve = (id) => {
        dispatch(updateTicketStatus({ id, status: 'closed' }));
    };

    return (
        <div className="admin-view">
            <header className="view-header mb-4">
                <h2 className="view-title">Support & System Logs</h2>
                <div className="view-actions">
                    <button 
                        className={`btn btn-sm ${activeTab === 'tickets' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('tickets')}
                    >
                        <FaTicketAlt /> Support Tickets
                    </button>
                    <button 
                        className={`btn btn-sm ${activeTab === 'logs' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('logs')}
                    >
                        <FaServer /> Audit & Error Logs
                    </button>
                </div>
            </header>

            {activeTab === 'tickets' && (
                <div className="admin-card p-0 overflow-hidden">
                    <table className="table table-dark table-hover mb-0">
                        <thead>
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">User</th>
                                <th className="p-3">Subject</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map(ticket => (
                                <tr key={ticket.id}>
                                    <td className="p-3 text-muted">{ticket.id.substring(0,6)}...</td>
                                    <td className="p-3 fw-bold">{ticket.name || ticket.email}</td>
                                    <td className="p-3">{ticket.subject}</td>
                                    <td className="p-3">{ticket.date ? new Date(ticket.date).toLocaleDateString() : '-'}</td>
                                    <td className="p-3">
                                        <span className={`badge bg-${ticket.status === 'open' ? 'danger' : (ticket.status === 'pending' ? 'warning' : 'success')}`}>
                                            {ticket.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-3 text-end">
                                        {ticket.status !== 'closed' && (
                                            <button className="btn btn-sm btn-success" onClick={() => handleResolve(ticket.id)}>
                                                <FaCheck /> Mark Closed
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'logs' && (
                <div className="admin-card">
                    <h5 className="text-white mb-3">System Audit Log</h5>
                    <div className="console-logs" style={{ height: '400px' }}>
                        {logs.map(log => (
                            <div key={log.id} className="log-entry d-flex gap-2">
                                <span className="log-time">[{log.time}]</span>
                                <span className={`text-${log.type === 'error' ? 'danger' : (log.type === 'warn' ? 'warning' : 'success')}`}>
                                    {log.type.toUpperCase()}:
                                </span>
                                <span>{log.msg}</span>
                            </div>
                        ))}
                        {/* Fake plenty of logs */}
                        <div className="log-entry text-muted">... Previous logs archived ...</div>
                    </div>
                    <div className="mt-3 text-end">
                        <button className="btn btn-outline-secondary btn-sm">Export Logs (CSV)</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportLogs;
