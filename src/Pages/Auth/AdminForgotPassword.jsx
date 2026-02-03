import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const AdminForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        if (email !== 'eduverseofficial17@gmail.com') {
             setMessage({ 
                type: 'error', 
                text: "This form is restricted to the Administrator account (eduverseofficial17@gmail.com)."
            });
            setIsLoading(false);
            return;
        }

        const auth = getAuth();
        
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage({ 
                type: 'success', 
                text: `Recovery instructions sent to ${email}. Check your inbox.` 
            });
        } catch (error) {
            console.error("Password reset error:", error);
            let errorMsg = "Failed to send reset email. Please text again.";
            if (error.code === 'auth/user-not-found') errorMsg = "No admin account found with this email.";
            if (error.code === 'auth/invalid-email') errorMsg = "Invalid email address.";
            
            setMessage({ 
                type: 'error', 
                text: errorMsg
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout 
            title="Admin Recovery" 
            subtitle="Reset your administrative access credentials."
            isAdmin={true}
        >
            {message.type === 'success' ? (
                <div className="text-center">
                    <div className="auth-alert success mb-4">
                        {message.text}
                    </div>
                    <Link to="/auth/admin/login" className="auth-btn" style={{display: 'inline-block', textDecoration: 'none'}}>
                        Back to Admin Login
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {message.type === 'error' && (
                        <div className="alert alert-danger text-center mb-3">
                            {message.text}
                        </div>
                    )}

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
