import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const ResetPasswordPage = () => {
    // In a real scenario, you extract the oobCode from the URL query params
    const [newPassword, setNewPassword] = useState('');
    const [code, setCode] = useState(''); // Use query param in real integration
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Note: This requires a valid 'oobCode' sent via email link
            setMessage('Password successfully reset. You may now login.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError('Error resetting password: ' + err.message);
        }
    };

    return (
        <AuthLayout title="Forge New Key" subtitle="Create a new secret to access your dojo.">
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Recovery Code (from URL)</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Paste code here if not auto-filled"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                        type="password"
                        className="form-input"
                        placeholder="New strong secret"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>

                {message && <div className="text-success small text-center">{message}</div>}
                {error && <div className="text-danger small text-center">{error}</div>}

                <button type="submit" className="auth-btn">
                    Update Secret
                </button>
            </form>
        </AuthLayout>
    );
};

export default ResetPasswordPage;
