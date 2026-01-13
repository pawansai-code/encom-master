import { useState } from 'react';
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate password reset email
        setTimeout(() => {
            setIsLoading(false);
            setIsSent(true);
        }, 1500);
    };

    return (
        <AuthLayout 
            title="Forgot Password?" 
            subtitle="Don't worry! It happens. Please enter the email associated with your account."
        >
            {isSent ? (
                <div className="text-center">
                    <div className="auth-alert success mb-4">
                        We have sent a confirmation email to <strong>{email}</strong>. Please check your email.
                    </div>
                    <Link to="/auth/login" className="auth-btn" style={{display: 'inline-block', textDecoration: 'none'}}>
                        Back to Login
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div className="input-wrapper">
                            <FaEnvelope className="input-icon" />
                            <input 
                                type="email" 
                                className="form-input" 
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-btn" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <div className="auth-footer">
                        <Link to="/auth/login" className="auth-link d-inline-flex align-items-center gap-2">
                             <FaArrowLeft size={12}/> Back to Login
                        </Link>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
