import { useState } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { googleLoginUser, loginUser, logoutUser, selectUserStatus, signupUser } from '../../State/slices/userSlice';
import AuthLayout from './AuthLayout';
import GoogleAuthButton from './GoogleAuthButton';

const AdminLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const status = useSelector(selectUserStatus);
    
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '', 
        password: '',
        rememberMe: false
    });
    const [authError, setAuthError] = useState(null);
    const [needsSetup, setNeedsSetup] = useState(false); // Track if user needs to be created

    const isLoading = status === 'loading';
    const ADMIN_EMAIL = "eduverseofficial17@gmail.com";

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (authError) setAuthError(null);
        if (needsSetup) setNeedsSetup(false);
    };

    const attemptLogin = async () => {
        const resultAction = await dispatch(loginUser({ email: formData.email, password: formData.password }));
        if (loginUser.fulfilled.match(resultAction)) {
            const user = resultAction.payload;
            if (user.email === ADMIN_EMAIL) {
                navigate('/admin/dashboard');
            } else {
                await dispatch(logoutUser());
                setAuthError("Access Denied: unauthorized account.");
            }
        } else {
            // Login Failed
            const rawError = resultAction.payload || 'Authentication failed.';
            setAuthError(rawError); // Show the real error to the user

            // If error is "Invalid email or password", it could mean missing account OR wrong password.
            // We'll offer both options in the UI (Setup or Retry).
            if (rawError === 'Invalid email or password.') {
                 // For the specific admin email, if it fails, it might be that it's not registered yet or wrong password.
                 // Given the constraint, we can still offer setup if it's the right email.
                 if (formData.email === ADMIN_EMAIL) {
                    setNeedsSetup(true);
                 }
            }
        }
    };

    const handleGoogleLogin = async () => {
        setAuthError(null);
        setNeedsSetup(false);

        const resultAction = await dispatch(googleLoginUser());
        
        if (googleLoginUser.fulfilled.match(resultAction)) {
            const user = resultAction.payload;
            // Strict Admin Email Check
            if (user.email === ADMIN_EMAIL) {
                navigate('/admin/dashboard');
            } else {
                await dispatch(logoutUser());
                setAuthError(`Access Denied: ${user.email} is not authorized. Please use ${ADMIN_EMAIL}.`);
            }
        } else {
             const rawError = resultAction.payload || 'Google Sign-in failed.';
             setAuthError(rawError);
        }
    };

    const handleSetup = async () => {
        // Create the admin user
        const resultAction = await dispatch(signupUser({ 
            email: formData.email, 
            password: formData.password, 
            name: "Admin" 
        }));
        
        if (signupUser.fulfilled.match(resultAction)) {
            // Success!
            setAuthError(null);
            navigate('/admin/dashboard');
        } else {
            // Setup Failed (e.g. "Email already in use")
            const errorMsg = resultAction.payload || "Setup failed.";
            setAuthError(`Setup Failed: ${errorMsg}`);
            
            // If it failed because it already exists, hide the setup button so they focus on login
            if (errorMsg.includes('already registered')) {
                setNeedsSetup(false); 
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAuthError(null);
        setNeedsSetup(false);

        if (formData.email !== ADMIN_EMAIL) {
            setAuthError(`Access Denied: Only ${ADMIN_EMAIL} is authorized.`);
            return;
        }

        await attemptLogin();
    };

    return (
        <AuthLayout 
            title="Admin Login" 
            subtitle="Access the Eduverse control center."
            isAdmin={true}
        >
            <form onSubmit={handleSubmit}>
                {authError && (
                    <div className="alert alert-danger text-center" role="alert">
                        <strong>{authError}</strong>
                        
                        {/* Only show Initialize button if we suspect account is missing (or generic error where user might want to try) */}
                        {/* If error is specifically "Invalid email or password", it could mean EITHER. */}
                        {needsSetup && formData.email === ADMIN_EMAIL && (
                            <div className="mt-2 pt-2 border-top border-danger">
                                <small className="d-block mb-2 text-dark">
                                    Is this the <strong>first time</strong> you are setting up the admin?
                                </small>
                                <button 
                                    type="button" 
                                    className="btn btn-sm btn-danger fw-bold w-100 mb-2"
                                    onClick={handleSetup}
                                >
                                    Create Admin Account Now
                                </button>
                                <div className="text-muted small" style={{fontSize: '0.8rem'}}>
                                    (Only works if account doesn't exist yet)
                                </div>
                            </div>
                        )}

                       {/* If it might be a forgotten password */}
                       {!needsSetup && (
                           <div className="mt-2">
                               <Link to="/auth/admin/forgot-password" className="small text-danger fw-bold">
                                   Reset Password?
                               </Link>
                           </div>
                       )}
                    </div>
                )}
                
                {/* ... existing fields ... matches previous file */}
                <div className="form-group">
                    <label className="form-label">Admin Email</label>
                    <div className="input-wrapper">
                        <FaEnvelope className="input-icon" />
                        <input 
                            type="email" 
                            name="email"
                            className="form-input" 
                            placeholder="eduverseofficial17@gmail.com"
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
                            placeholder="Enter admin password"
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
                     <Link to="/auth/admin/forgot-password" className="forgot-password">Forgot Password?</Link>
                </div>

                <button type="submit" className="auth-btn" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Login to Dashboard'}
                </button>
                
                <div className="auth-divider">
                    <span>OR</span>
                </div>

                <GoogleAuthButton text="Sign in as Admin with Google" onClick={handleGoogleLogin} />

                 <div className="text-center mt-3">
                     <Link to="/auth/login" className="text-secondary small text-decoration-none">Back to User Login</Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default AdminLogin;
