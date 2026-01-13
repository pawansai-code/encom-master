
import { useState } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import GoogleAuthButton from './GoogleAuthButton';

const UserLogin = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            navigate('/dashboard'); // Redirect to dashboard after login
        }, 1500);
    };

    return (
        <AuthLayout 
            title="Welcome Back" 
            subtitle="Please enter your details to sign in."
        >
            <form onSubmit={handleSubmit}>
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
                            placeholder="Enter your password"
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

                <div className="form-options">
                    <label className="remember-me">
                        <input 
                            type="checkbox" 
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            hidden 
                        />
                        <span className="checkbox-custom"></span>
                        Remember me
                    </label>
                    <Link to="/auth/forgot-password" class="forgot-password">Forgot Password?</Link>
                </div>

                <button type="submit" className="auth-btn" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>

                <div className="auth-divider">
                    <span>OR</span>
                </div>

                <GoogleAuthButton text="Sign in with Google" onClick={() => alert("Google Auth implementation coming soon!")} />

                <div className="auth-footer">
                    Don't have an account? 
                    <Link to="/auth/signup" className="auth-link">Sign up</Link>
                </div>
                
                <div className="text-center mt-3">
                     <Link to="/auth/admin/login" className="text-secondary small text-decoration-none">Admin Login</Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default UserLogin;
