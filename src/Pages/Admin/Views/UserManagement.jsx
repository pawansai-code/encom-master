import { useState } from 'react';
import { FaBan, FaEye, FaKey, FaSearch, FaUnlock, FaUserCheck, FaUserSlash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { banUser, restoreUser, selectAllUsers, suspendUser } from '../../../State/slices/adminSlice';

const UserManagement = () => {
    const dispatch = useDispatch();
    const users = useSelector(selectAllUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, active, banned, suspended
    const [selectedUser, setSelectedUser] = useState(null);

    // Initial Filter
    const filteredUsers = users.filter(user => {
        const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchFilter = filter === 'all' || user.status === filter;
        return matchSearch && matchFilter;
    });

    const handleAction = (id, action) => {
        if (action === 'ban') dispatch(banUser(id));
        if (action === 'suspend') dispatch(suspendUser(id));
        if (action === 'restore') dispatch(restoreUser(id));
    };

    return (
        <div className="admin-content-view animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">User Management</h3>
                <div className="d-flex gap-2">
                    <div className="search-box position-relative">
                        <FaSearch className="position-absolute ms-3 mt-3 text-secondary border-0" style={{top: '-4px'}} />
                        <input 
                            type="text" 
                            className="form-control bg-dark text-white border-secondary ps-5 rounded-pill"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{minWidth: '250px'}}
                        />
                    </div>
                    <select 
                        className="form-select bg-dark text-white border-secondary rounded-pill w-auto"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="banned">Banned</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="admin-card p-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-dark table-hover mb-0 align-middle">
                        <thead className="bg-black bg-opacity-25">
                            <tr>
                                <th className="p-3 ps-4">User</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Reports</th>
                                <th className="p-3">Joined</th>
                                <th className="p-3 text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="p-3 ps-4">
                                        <div className="d-flex align-items-center gap-3">
                                            <img src={user.avatar} className="rounded-circle bg-secondary" width="40" height="40" alt="" />
                                            <div>
                                                <div className="fw-bold text-white">{user.name}</div>
                                                <div className="small text-muted">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3"><span className="badge bg-secondary bg-opacity-25 text-secondary border border-secondary border-opacity-25">{user.role}</span></td>
                                    <td className="p-3">
                                        <span className={`badge rounded-pill ${
                                            user.status === 'active' ? 'bg-success bg-opacity-10 text-success' :
                                            user.status === 'banned' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-warning bg-opacity-10 text-warning'
                                        }`}>
                                            {user.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-3 text-danger fw-bold">{user.reports > 0 ? user.reports : '-'}</td>
                                    <td className="p-3 text-muted small">{user.joinDate}</td>
                                    <td className="p-3 text-end pe-4">
                                        <div className="d-flex justify-content-end gap-2">
                                            <button className="btn btn-sm btn-outline-info rounded-circle p-2" title="View Profile" onClick={() => setSelectedUser(user)}>
                                                <FaEye />
                                            </button>
                                            {user.status !== 'banned' && (
                                                <button className="btn btn-sm btn-outline-danger rounded-circle p-2" title="Ban User" onClick={() => handleAction(user.id, 'ban')}>
                                                    <FaBan />
                                                </button>
                                            )}
                                            {user.status === 'active' && (
                                                <button className="btn btn-sm btn-outline-warning rounded-circle p-2" title="Suspend User" onClick={() => handleAction(user.id, 'suspend')}>
                                                    <FaUserSlash />
                                                </button>
                                            )}
                                            {user.status !== 'active' && (
                                                <button className="btn btn-sm btn-outline-success rounded-circle p-2" title="Restore User" onClick={() => handleAction(user.id, 'restore')}>
                                                    <FaUserCheck />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Profile Modal Stub (In a real app, this would be a full modal overlay) */}
            {selectedUser && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{background: 'rgba(0,0,0,0.8)', zIndex: 1000}}>
                    <div className="admin-card p-4" style={{width: '500px', maxWidth: '90%'}}>
                        <div className="d-flex justify-content-between mb-4">
                            <h4 className="fw-bold">User Profile</h4>
                            <button className="btn-close btn-close-white" onClick={() => setSelectedUser(null)}></button>
                        </div>
                        <div className="text-center mb-4">
                            <img src={selectedUser.avatar} className="rounded-circle mb-3 border border-3 border-dark" width="100" />
                            <h3 className="fw-bold">{selectedUser.name}</h3>
                            <p className="text-muted">{selectedUser.email}</p>
                            <div className="d-flex justify-content-center gap-2 mt-3">
                                <button className="btn btn-sm btn-outline-warning"><FaKey /> Reset Password</button>
                                <button className="btn btn-sm btn-outline-danger"><FaUnlock /> Force Logout</button>
                            </div>
                        </div>
                        <h5 className="border-bottom border-secondary border-opacity-25 pb-2 mb-3">Recent Activity</h5>
                        <div className="d-flex flex-column gap-2">
                            {selectedUser.activityLog.map(log => (
                                <div key={log.id} className="d-flex justify-content-between p-2 rounded bg-white bg-opacity-5 small text-muted">
                                    <span>{log.action}</span>
                                    <span>{log.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
