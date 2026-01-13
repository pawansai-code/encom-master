import { useState } from 'react';
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const AdminForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate password reset email for admin
        setTimeout(() => {
            setIsLoading(false);
            setIsSent(true);
        }, 1500);
    };

    return (
        <AuthLayout 
            title="Admin Recovery" 
            subtitle="Reset your administrative access credentials."
            isAdmin={true}
        >
            {isSent ? (
                <div className="text-center">
                    <div className="auth-alert success mb-4">
                        Recovery instructions sent to <strong>{email}</strong>.
                    </div>
                    <Link to="/auth/admin/login" className="auth-btn" style={{display: 'inline-block', textDecoration: 'none'}}>
                        Back to Admin Login
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Admin Email</label>
                        <div className="input-wrapper">
                            <FaEnvelope className="input-icon" />
                            <input 
                                type="email" 
                                className="form-input" 
                                placeholder="admin@eduverse.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-btn" disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Send Recovery Link'}
                    </button>

                    <div className="auth-footer">
                        <Link to="/auth/admin/login" className="auth-link d-inline-flex align-items-center gap-2">
                             <FaArrowLeft size={12}/> Back to Admin Login
                        </Link>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
};

export default AdminForgotPassword;
