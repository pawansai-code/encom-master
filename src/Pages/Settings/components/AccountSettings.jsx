
import { useState } from 'react';
import { FaCheckDouble, FaKey, FaLaptop, FaLock, FaMobileAlt, FaShieldAlt, FaUserSlash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { terminateAllOtherSessions, terminateSession, toggleTwoFactor } from '../../../State/slices/userSlice';

const AccountSettings = () => {
    const dispatch = useDispatch();
    const account = useSelector((state) => state.user.account);
    const [isAdmin, setIsAdmin] = useState(false);

    return (
        <div className="settings-content-wrapper">
            <div className="settings-section-header d-flex justify-content-between align-items-center">
                <div>
                    <h3 className="fw-bold text-white mb-1">Account & Security</h3>
                    <p className="text-secondary mb-0">Manage your password and security preferences</p>
                </div>
                {/* Admin Toggle */}
                <div className="form-check form-switch">
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="adminToggleAccount" 
                        checked={isAdmin} 
                        onChange={(e) => setIsAdmin(e.target.checked)} 
                    />
                    <label className="form-check-label text-warning small" htmlFor="adminToggleAccount">Admin View</label>
                </div>
            </div>

            <div className="p-4">
                {/* Password & Email */}
                <div className="settings-card mb-4">
                    <h5 className="text-white mb-4">Login Details</h5>
                    <div className="row g-4">
                        <div className="col-md-6">
                            <label className="text-secondary small mb-2">Email Address</label>
                            <div className="d-flex gap-2">
                                <input type="email" value="ninja@eduverse.com" className="settings-input" disabled />
                                <button className="btn btn-outline-light">Change</button>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="text-secondary small mb-2">Password</label>
                            <div className="d-flex gap-2">
                                <input type="password" value="********" className="settings-input" disabled />
                                <button className="btn btn-outline-light">Change</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2FA Section */}
                <div className="settings-card mb-4">
                     <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-2 rounded bg-warning bg-opacity-10 text-warning">
                                <FaShieldAlt size={20} />
                            </div>
                            <div>
                                <h6 className="text-white mb-0">Two-Factor Authentication (2FA)</h6>
                                <p className="text-secondary small mb-0">Add an extra layer of security to your account</p>
                            </div>
                        </div>
                        <input 
                            type="checkbox" 
                            className="toggle-switch" 
                            checked={account.twoFactor} 
                            onChange={() => dispatch(toggleTwoFactor())}
                        />
                    </div>
                </div>

                {/* Login History / Sessions */}
                <h5 className="text-white mb-3 mt-5">Active Sessions</h5>
                <div className="settings-card">
                    {account.sessions.map(session => (
                        <div key={session.id} className="d-flex justify-content-between align-items-center py-3 border-bottom border-secondary border-opacity-10 last-no-border">
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-2 rounded bg-secondary bg-opacity-10 text-white">
                                    {session.device.toLowerCase().includes('phone') ? <FaMobileAlt /> : <FaLaptop />}
                                </div>
                                <div>
                                    <h6 className="text-white mb-1">{session.device}</h6>
                                    <p className="text-secondary small mb-0">
                                        {session.location} • {session.ip} • <span className={session.active ? 'text-success' : 'text-secondary'}>{session.lastActive}</span>
                                    </p>
                                </div>
                            </div>
                            {session.active ? (
                                <span className="badge bg-success bg-opacity-25 text-success">Current Session</span>
                            ) : (
                                <button 
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => dispatch(terminateSession(session.id))}
                                >
                                    Revoke
                                </button>
                            )}
                        </div>
                    ))}
                    <div className="mt-3 pt-2 text-end">
                         <button 
                            className="btn btn-outline-light btn-sm"
                            onClick={() => dispatch(terminateAllOtherSessions())}
                         >
                            Log Out of All Devices
                        </button>
                    </div>
                </div>

                {/* Admin View */}
                 {isAdmin && (
                    <div className="mt-5 p-4 rounded bg-dark border border-warning border-opacity-25">
                        <h6 className="text-warning text-uppercase fw-bold small mb-3">
                            <FaShieldAlt className="me-2" /> Admin Controls
                        </h6>
                        <div className="d-flex flex-wrap gap-3">
                            <button className="btn btn-sm btn-danger">
                                <FaKey className="me-1" /> Force Password Reset
                            </button>
                            <button className="btn btn-sm btn-warning text-dark">
                                <FaLock className="me-1" /> Lock Account
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                                <FaUserSlash className="me-1" /> Suspend User
                            </button>
                             <button className="btn btn-sm btn-success">
                                <FaCheckDouble className="me-1" /> Approve Security Changes
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountSettings;
