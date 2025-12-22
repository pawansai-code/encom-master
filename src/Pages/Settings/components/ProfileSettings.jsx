
import { useEffect, useRef, useState } from 'react';
import { FaBan, FaCamera, FaCheck, FaCheckCircle, FaHistory, FaShieldAlt, FaSpinner, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserProfile, updateProfile } from '../../../State/slices/userSlice';

const ProfileSettings = () => {
    const dispatch = useDispatch();
    const userProfile = useSelector((state) => state.user.profile);
    
    // Default safe values
    const defaultUser = {
        name: '',
        username: '',
        email: '',
        bio: '',
        avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        isFrozen: false,
        emailVerified: false
    };

    // Helper to map Redux user structure to Form structure
    const mapUserToForm = (u) => {
        if (!u) return defaultUser;
        return {
            name: u.name || '',
            // Check top level, then data.username, then fallback to name, then empty string
            username: u.username || u.data?.username || u.name || '',
            email: u.email || '',
            bio: u.bio || u.data?.bio || '',
            isFrozen: u.isFrozen || u.data?.isFrozen || false,
            emailVerified: u.emailVerified || false
        };
    };

    // Local state for editing
    const [formData, setFormData] = useState(mapUserToForm(userProfile));
    const [photoFile, setPhotoFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(
        userProfile?.photoURL || userProfile?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    );
    const [isAdmin, setIsAdmin] = useState(false);
    const [message, setMessage] = useState('');
    const fileInputRef = useRef(null);
    const status = useSelector((state) => state.user.status);

    // Sync local state when redux state changes
    useEffect(() => {
        if (userProfile) {
            setFormData(mapUserToForm(userProfile));
            setPreviewUrl(userProfile.photoURL || userProfile.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png');
        }
    }, [userProfile]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        try {
            await dispatch(saveUserProfile({ 
                ...formData, 
                photoFile 
            })).unwrap();
            
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
            setPhotoFile(null); // Reset file after successful upload
        } catch (err) {
            setMessage('Failed to update profile.');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const toggleFreeze = () => {
        // In a real app, this would be an admin action
        dispatch(updateProfile({ isFrozen: !formData.isFrozen }));
    };

    return (
        <div className="settings-content-wrapper">
            {/* Hidden File Input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                accept="image/*"
            />
            <div className="settings-section-header d-flex justify-content-between align-items-center">
                <div>
                    <h3 className="fw-bold text-white mb-1">Profile Settings</h3>
                    <p className="text-secondary mb-0">Update your public profile information</p>
                </div>
                {/* Admin Toggle for Demo */}
                <div className="form-check form-switch">
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="adminToggle" 
                        checked={isAdmin} 
                        onChange={(e) => setIsAdmin(e.target.checked)} 
                    />
                    <label className="form-check-label text-warning small" htmlFor="adminToggle">Admin View</label>
                </div>
            </div>

            <div className="p-4">
                {message && (
                    <div className="alert alert-success d-flex align-items-center mb-4">
                        <FaCheckCircle className="me-2" /> {message}
                    </div>
                )}
                
                {formData.isFrozen && (
                    <div className="alert alert-danger d-flex align-items-center mb-4">
                        <FaBan className="me-2" />
                        <div>
                            <strong>Profile Locked.</strong> Your profile edits have been frozen by an administrator.
                        </div>
                    </div>
                )}

                {/* Avatar Section */}
                <div className="d-flex align-items-center gap-4 mb-5">
                    <div className="position-relative">
                        <img 
                            src={previewUrl} 
                            alt="Profile" 
                            className="rounded-circle border border-3 border-secondary"
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <button 
                            className="position-absolute bottom-0 end-0 btn btn-sm btn-primary rounded-circle p-2"
                            style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => fileInputRef.current.click()}
                        >
                            <FaCamera size={12} />
                        </button>
                    </div>
                    <div>
                        <h5 className="text-white mb-1">Profile Picture</h5>
                        <p className="text-secondary small mb-0">Recommended 400x400px. JPG, PNG or GIF.</p>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="settings-form-group">
                            <label className="form-label text-secondary small">Display Name</label>
                            <input 
                                type="text" 
                                name="name"
                                className="settings-input" 
                                value={formData.name}
                                onChange={handleChange}
                                disabled={formData.isFrozen}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="settings-form-group">
                            <label className="form-label text-secondary small">Username / Handle</label>
                            <div className="input-group">
                                <span className="input-group-text bg-transparent border-secondary text-secondary">@</span>
                                <input 
                                    type="text" 
                                    name="username"
                                    className="settings-input border-start-0 ps-0" 
                                    value={(formData.username || '').replace('@', '')}
                                    onChange={handleChange}
                                    disabled={formData.isFrozen}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="settings-form-group">
                            <label className="form-label text-secondary small">Email Address</label>
                            <div className="d-flex gap-2">
                                <input 
                                    type="email" 
                                    className="settings-input" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    name="email"
                                    disabled={formData.isFrozen}
                                />
                                {formData.emailVerified ? (
                                    <span className="d-flex align-items-center px-3 rounded bg-success bg-opacity-10 text-success border border-success border-opacity-25">
                                        <FaCheckCircle className="me-2" /> Verified
                                    </span>
                                ) : (
                                    <button className="btn btn-warning btn-sm text-nowrap">Verify Now</button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="settings-form-group">
                            <label className="form-label text-secondary small">Bio</label>
                            <textarea 
                                className="settings-input" 
                                rows="4" 
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                disabled={formData.isFrozen}
                                maxLength={200}
                            />
                            <div className="text-end text-secondary small mt-1">
                                {formData.bio.length}/200
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-4 pt-4 border-top border-secondary border-opacity-25">
                    <button 
                        className="btn btn-primary px-4" 
                        disabled={formData.isFrozen || status === 'loading'}
                        onClick={handleSave}
                    >
                        {status === 'loading' ? <><FaSpinner className="animate-spin me-2" /> Saving...</> : 'Save Changes'}
                    </button>
                </div>

                {/* Admin Controls Section */}
                {isAdmin && (
                    <div className="mt-5 p-4 rounded bg-dark border border-warning border-opacity-25">
                        <h6 className="text-warning text-uppercase fw-bold small mb-3">
                            <FaShieldAlt className="me-2" /> Admin Controls
                        </h6>
                        <div className="d-flex flex-wrap gap-3">
                            <button className="btn btn-sm btn-outline-success">
                                <FaCheck className="me-1" /> Approve Changes
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                                <FaTimes className="me-1" /> Reject Changes
                            </button>
                            <button className="btn btn-sm btn-outline-secondary">
                                <FaHistory className="me-1" /> Revert to Previous
                            </button>
                            <button 
                                className={`btn btn-sm ${formData.isFrozen ? 'btn-danger' : 'btn-outline-danger'}`}
                                onClick={toggleFreeze}
                            >
                                <FaBan className="me-1" /> {formData.isFrozen ? 'Unfreeze Edits' : 'Freeze Edits'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileSettings;
