import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import SocialButtons from '../../Components/Auth/SocialButtons';
import { selectUserError, selectUserStatus, signupUser } from '../../State/slices/userSlice';
import './Auth.css';
import AuthLayout from './AuthLayout';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
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

        const result = await dispatch(signupUser({ 
            email: formData.email, 
            password: formData.password,
            username: formData.username
        }));

        if (signupUser.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };

    return (
        <AuthLayout title="Ninja Initiation" subtitle="Begin your journey to mastery.">
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Ninja Name</label>
                    <input
                        type="text"
                        name="username"
                        className="form-input"
                        placeholder="Master Splinter"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Email Scroll</label>
                    <input
                        type="email"
                        name="email"
                        className="form-input"
                        placeholder="you@eduverse.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Create Secret Key</label>
                    <input
                        type="password"
                        name="password"
                        className="form-input"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Confirm Secret Key</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        className="form-input"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
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
                >
                    {status === 'loading' ? 'Forging Identity...' : 'Join the Ranks'}
                </button>
            </form>

            <div className="auth-links text-center">
                <span>
                    Already a Ninja? <Link to="/login" className="auth-link">Enter Dojo</Link>
                </span>
            </div>

            <SocialButtons onPhoneClick={() => {
                // Navigate to login with phone mode active? 
                // Alternatively, just redirect to login since phone auth manages both login/signup usually
                window.location.href = '/login'; 
            }} />
        </AuthLayout>
    );
};

export default SignupPage;
