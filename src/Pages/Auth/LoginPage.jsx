import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import PhoneLoginForm from '../../Components/Auth/PhoneLoginForm';
import SocialButtons from '../../Components/Auth/SocialButtons';
import { loginUser, selectUserError, selectUserStatus } from '../../State/slices/userSlice';
import './Auth.css';
import AuthLayout from './AuthLayout';

const LoginPage = () => {
    const [usePhoneLogin, setUsePhoneLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = useSelector(selectUserStatus);
    const error = useSelector(selectUserError);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(loginUser({ email, password }));
        if (loginUser.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };

    if (usePhoneLogin) {
        return (
            <AuthLayout title="" subtitle="">
                <PhoneLoginForm onBack={() => setUsePhoneLogin(false)} />
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Ninja Login" subtitle="Welcome back, shadow warrior.">
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Scroll</label>
                    <input
                        type="email"
                        id="email"
                        className="form-input"
                        placeholder="ninja@eduverse.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="password">Secret Key</label>
                    <input
                        type="password"
                        id="password"
                        className="form-input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <div className="text-danger small text-center">{error}</div>}

                <button 
                    type="submit" 
                    className="auth-btn"
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? 'Deciphering...' : 'Enter Dojo'}
                </button>
            </form>

            <div className="auth-links">
                <span>
                    New here? <Link to="/auth/signup" className="auth-link">Join the Clan</Link>
                </span>
                <Link to="/auth/forgot-password" className="auth-link">Lost Secrets?</Link>
            </div>
            
            {/* Social Login Section */}
            <SocialButtons onPhoneClick={() => setUsePhoneLogin(true)} />

            <div className="text-center mt-3">
                 <Link to="/auth/admin" className="text-secondary small text-decoration-none">Admin Portal</Link>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
