
import { useState } from 'react';
import { FaDatabase, FaDownload, FaEye, FaPlug, FaShieldAlt, FaTrashAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { updatePrivacy } from '../../../State/slices/userSlice';

const PrivacySettings = () => {
    const dispatch = useDispatch();
    const settings = useSelector((state) => state.user.privacy);
    const [isAdmin, setIsAdmin] = useState(false);
    
    // We can dispatch updates directly on toggle
    const handleToggle = (key) => {
        dispatch(updatePrivacy({ [key]: !settings[key] }));
    };

    const handleRetentionChange = (e) => {
        dispatch(updatePrivacy({ retentionPeriod: e.target.value }));
    };

    return (
        <div className="settings-content-wrapper">
             <div className="settings-section-header d-flex justify-content-between align-items-center">
                <div>
                    <h3 className="fw-bold text-white mb-1">Data & Privacy</h3>
                    <p className="text-secondary mb-0">Control how your data is collected and used</p>
                </div>
                {/* Admin Toggle */}
                <div className="form-check form-switch">
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="adminTogglePrivacy" 
                        checked={isAdmin} 
                        onChange={(e) => setIsAdmin(e.target.checked)} 
                    />
                    <label className="form-check-label text-warning small" htmlFor="adminTogglePrivacy">Admin View</label>
                </div>
            </div>

            <div className="p-4">
                {/* Privacy Options */}
                <div className="settings-card mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-2 rounded bg-primary bg-opacity-10 text-primary">
                                <FaEye size={20} />
                            </div>
                            <div>
                                <h6 className="text-white mb-0">Search Visibility</h6>
                                <p className="text-secondary small mb-0">Allow others to find your profile by email or phone</p>
                            </div>
                        </div>
                        <input 
                            type="checkbox" 
                            className="toggle-switch" 
                            checked={settings.searchVisibility} 
                            onChange={() => handleToggle('searchVisibility')}
                        />
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-2 rounded bg-purple bg-opacity-10 text-white" style={{background: 'rgba(157, 78, 221, 0.1)'}}>
                                <FaDatabase size={20} />
                            </div>
                            <div>
                                <h6 className="text-white mb-0">Data Sharing</h6>
                                <p className="text-secondary small mb-0">Share usage data with partners for better improvements</p>
                            </div>
                        </div>
                        <input 
                            type="checkbox" 
                            className="toggle-switch" 
                            checked={settings.shareDataPartners} 
                            onChange={() => handleToggle('shareDataPartners')}
                        />
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-2 rounded bg-success bg-opacity-10 text-success">
                                <FaPlug size={20} />
                            </div>
                            <div>
                                <h6 className="text-white mb-0">Manage Connected Apps</h6>
                                <p className="text-secondary small mb-0">Review 3rd party applications with access to your account</p>
                            </div>
                        </div>
                        <button className="btn btn-sm btn-outline-light">Manage</button>
                    </div>
                </div>

                {/* Data Management */}
                <h5 className="text-white mb-3 mt-5">Data Management</h5>
                <div className="settings-card">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                         <div className="d-flex align-items-center gap-3">
                            <div className="p-2 rounded bg-info bg-opacity-10 text-info">
                                <FaDownload size={20} />
                            </div>
                            <div>
                                <h6 className="text-white mb-0">Download Your Data</h6>
                                <p className="text-secondary small mb-0">Get a copy of your data (GDPR Compliant)</p>
                            </div>
                        </div>
                        <button className="btn btn-sm btn-outline-light">Request Archive</button>
                    </div>

                    <div className="danger-zone p-3 rounded">
                         <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-2 rounded bg-danger bg-opacity-10 text-danger">
                                    <FaTrashAlt size={20} />
                                </div>
                                <div>
                                    <h6 className="text-danger mb-0">Delete Account</h6>
                                    <p className="text-danger text-opacity-75 small mb-0">Permanently remove your account and all data</p>
                                </div>
                            </div>
                            <button className="btn btn-sm btn-danger">Delete Account</button>
                        </div>
                    </div>
                </div>

                {/* Admin View */}
                 {isAdmin && (
                    <div className="mt-5 p-4 rounded bg-dark border border-warning border-opacity-25">
                        <h6 className="text-warning text-uppercase fw-bold small mb-3">
                            <FaShieldAlt className="me-2" /> Admin Controls
                        </h6>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="p-3 bg-black bg-opacity-25 rounded border border-secondary border-opacity-25">
                                    <label className="text-secondary small d-block mb-2">Data Retention Policy</label>
                                    <select 
                                        className="form-select form-select-sm bg-dark text-light border-secondary"
                                        value={settings.retentionPeriod}
                                        onChange={handleRetentionChange}
                                    >
                                        <option value="6_months">6 Months</option>
                                        <option value="1_year">1 Year</option>
                                        <option value="indefinite">Indefinite</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="p-3 bg-black bg-opacity-25 rounded border border-secondary border-opacity-25">
                                    <label className="text-secondary small d-block mb-2">User Data History</label>
                                    <button className="btn btn-sm btn-outline-info w-100">View Access Log</button>
                                </div>
                            </div>
                             <div className="col-12">
                                <div className="p-3 bg-black bg-opacity-25 rounded border border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                                    <span className="text-light small">Delete Requests Pending: <strong>0</strong></span>
                                    <button className="btn btn-sm btn-outline-light" disabled>Fulfill Requests</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrivacySettings;
