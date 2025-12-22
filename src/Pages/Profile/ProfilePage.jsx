import { FaEnvelope, FaGithub, FaLinkedin, FaTwitter, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from '../../Components/Homepage/HomeNavbar';
import '../Dashboard/styles/Dashboard.css'; // Reuse dashboard container styles
import './styles/Profile.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const profile = useSelector((state) => state.user.profile);

    return (
        <div className="dashboard-container">
            <HomeNavbar />
            
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/* Profile Card */}
                        <div className="stat-card p-0 overflow-hidden">
                            {/* Header / Banner */}
                            <div className="profile-header">
                                <div className="avatar-wrapper">
                                    <img src={profile.avatar} alt="Profile" className="profile-avatar" />
                                </div>
                                <h2 className="fw-bold mb-1">{profile.name}</h2>
                                <p className="text-secondary mb-3">{profile.role}</p>
                                
                                <div className="d-flex justify-content-center gap-3 mb-3">
                                    {profile.socials.twitter && <a href={`https://${profile.socials.twitter}`} className="text-light opacity-75 hover-opacity-100"><FaTwitter /></a>}
                                    {profile.socials.github && <a href={`https://${profile.socials.github}`} className="text-light opacity-75 hover-opacity-100"><FaGithub /></a>}
                                    {profile.socials.linkedin && <a href={`https://${profile.socials.linkedin}`} className="text-light opacity-75 hover-opacity-100"><FaLinkedin /></a>}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 p-md-5">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="fw-bold mb-0">Personal Information</h4>
                                    <button 
                                        className="btn btn-outline-light rounded-pill px-4"
                                        onClick={() => navigate('/settings')}
                                    >
                                        <FaUser className="me-2" /> Edit Profile
                                    </button>
                                </div>

                                <form>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <label className="form-label text-secondary small">Full Name</label>
                                            <input 
                                                type="text" 
                                                className="form-control bg-transparent text-light border-0 p-0" 
                                                value={profile.name}
                                                disabled
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-secondary small">Email</label>
                                            <div className="d-flex align-items-center gap-2">
                                                <FaEnvelope className="text-secondary" />
                                                <input 
                                                    type="email" 
                                                    className="form-control bg-transparent text-light border-0 p-0" 
                                                    value={profile.email}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label text-secondary small">Bio</label>
                                            <textarea 
                                                className="form-control bg-transparent text-light border-0 p-0" 
                                                rows="3"
                                                value={profile.bio}
                                                disabled
                                            ></textarea>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
