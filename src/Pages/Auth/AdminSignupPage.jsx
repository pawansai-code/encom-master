import { useState } from 'react';
import { GiNinjaHead } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectUserError, selectUserStatus, signupAdmin } from '../../State/slices/userSlice';
import './Auth.css';
import AuthLayout from './AuthLayout';

const AdminSignupPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        adminKey: ''
    });
    const [localError, setLocalError] = useState('');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = useSelector(selectUserStatus);
    const error = useSelector(selectUserError);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (formData.password !== formData.confirmPassword) {
            setLocalError("Passwords do not match, young grasshopper.");
            return;
        }

        const result = await dispatch(signupAdmin({ 
            email: formData.email, 
            password: formData.password,
            username: formData.username,
            adminKey: formData.adminKey
        }));

        if (signupAdmin.fulfilled.match(result)) {
            navigate('/admin/dashboard');
        }
    };

    return (
        <AuthLayout title="Sensei Initiation" subtitle="Only the chosen may lead.">
            <div className="text-center mb-4">
                 <GiNinjaHead size={50} color="#e74c3c" />
            </div>
            
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" style={{color: '#ff6b6b'}}>Sensei Name</label>
                    <input
                        type="text"
                        name="username"
                        className="form-input"
                        placeholder="Master Splinter"
                        value={formData.username}
                        onChange={handleChange}
                        style={{borderColor: '#ff4757'}}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" style={{color: '#ff6b6b'}}>Admin Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-input"
                        placeholder="sensei@eduverse.com"
                        value={formData.email}
                        onChange={handleChange}
                        style={{borderColor: '#ff4757'}}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" style={{color: '#ff6b6b'}}>Secure Password</label>
                    <input
                        type="password"
                        name="password"
                        className="form-input"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        style={{borderColor: '#ff4757'}}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" style={{color: '#ff6b6b'}}>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        className="form-input"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={{borderColor: '#ff4757'}}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" style={{color: '#ff6b6b'}}>Sensei Key</label>
                    <input
                        type="password"
                        name="adminKey"
                        className="form-input"
                        placeholder="Secret Key Required"
                        value={formData.adminKey}
                        onChange={handleChange}
                        style={{borderColor: '#ff4757'}}
                        required
                    />
                </div>

                {(error || localError) && (
                    <div className="text-danger small text-center">
                        {localError || error}
                    </div>
                )}

                <button 
                    type="submit" 
                    className="auth-btn"
                    disabled={status === 'loading'}
                    style={{background: '#e74c3c'}}
                >
                    {status === 'loading' ? 'Verifying Power...' : 'Claim Command'}
                </button>
            </form>

            <div className="auth-links text-center">
                <span>
                    Already a Sensei? <Link to="/admin/login" className="auth-link" style={{color: '#ff6b6b'}}>Enter Portal</Link>
                </span>
            </div>
        </AuthLayout>
    );
};

export default AdminSignupPage;
