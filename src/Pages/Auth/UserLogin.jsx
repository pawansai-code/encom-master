
import { useState } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { googleLoginUser, loginUser, selectUserError, selectUserStatus } from '../../State/slices/userSlice';
import AuthLayout from './AuthLayout';
import GoogleAuthButton from './GoogleAuthButton';

const UserLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const status = useSelector(selectUserStatus);
    const error = useSelector(selectUserError);
    
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const isLoading = status === 'loading';

    // Redirect if login successful
    // Note: You might want to handle this in a parent component or a protected route wrapper, 
    // but for now, we'll do it here if the status changes to succeeded.
    // However, since we might already be logged in, it's good to check.
    // Better relies on the centralized Auth check, but let's add a simple check here.
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(loginUser({ email: formData.email, password: formData.password }));
        if (loginUser.fulfilled.match(resultAction)) {
            navigate('/dashboard');
        }
    };

    const handleGoogleLogin = async () => {
        const resultAction = await dispatch(googleLoginUser());
        if (googleLoginUser.fulfilled.match(resultAction)) {
            navigate('/dashboard');
        }
    };

    return (
        <AuthLayout 
            title="Welcome Back" 
            subtitle="Please enter your details to sign in."
        >
            <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                
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

                <GoogleAuthButton text="Sign in with Google" onClick={handleGoogleLogin} />

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
