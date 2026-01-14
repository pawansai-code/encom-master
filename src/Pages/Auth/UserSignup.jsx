import { useState } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { googleLoginUser, selectUserError, selectUserStatus, signupUser } from '../../State/slices/userSlice';
import AuthLayout from './AuthLayout';
import GoogleAuthButton from './GoogleAuthButton';

const UserSignup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const status = useSelector(selectUserStatus);
    const error = useSelector(selectUserError);

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const isLoading = status === 'loading';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        
        const resultAction = await dispatch(signupUser({ 
            email: formData.email, 
            password: formData.password, 
            name: formData.username 
        }));

        if (signupUser.fulfilled.match(resultAction)) {
            // Navigate to dashboard after successful signup
            // Or navigate to verify email if you implement email verification
            navigate('/dashboard');
        }
    };

    const handleGoogleSignup = async () => {
        const resultAction = await dispatch(googleLoginUser());
        if (googleLoginUser.fulfilled.match(resultAction)) {
            navigate('/dashboard');
        }
    };

    return (
        <AuthLayout 
            title="Create Account" 
            subtitle="Join the Eduverse for free."
        >
            <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                
                <div className="form-group">
                    <label className="form-label">Username</label>
                    <div className="input-wrapper">
                        <FaUser className="input-icon" />
                        <input 
                            type="text" 
                            name="username"
                            className="form-input" 
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div className="input-wrapper">
                        <FaEnvelope className="input-icon" />
                        <input 
                            type="email" 
                            name="email"
                            className="form-input" 
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="input-wrapper">
                        <FaLock className="input-icon" />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password"
                            className="form-input" 
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required 
                            style={{ paddingRight: '40px' }}
                        />
                         <button 
                            type="button"
                            className="position-absolute end-0 top-50 translate-middle-y bg-transparent border-0 text-secondary me-2"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ zIndex: 10, cursor: 'pointer', color: '#ccc' }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>
                
                 <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <div className="input-wrapper">
                        <FaLock className="input-icon" />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="confirmPassword"
                            className="form-input" 
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required 
                            style={{ paddingRight: '40px' }}
                        />
                    </div>
                </div>

                <button type="submit" className="auth-btn" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>

                <div className="auth-divider">
                    <span>OR</span>
                </div>

                <GoogleAuthButton text="Sign up with Google" onClick={handleGoogleSignup} />

                <div className="auth-footer">
                    Already have an account? 
                    <Link to="/auth/login" className="auth-link">Log In</Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default UserSignup;
