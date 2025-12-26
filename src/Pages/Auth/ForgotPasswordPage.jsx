import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import AuthLayout from './AuthLayout';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            // Mock Password Reset
            // await new Promise(resolve => setTimeout(resolve, 1000));
            setMessage('Recovery scroll sent! Check your inbox.');
        } catch (err) {
            setError('Failed to send scroll. ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Lost Secrets?" subtitle="We will help you recover your path.">
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

                {message && <div className="text-success small text-center">{message}</div>}
                {error && <div className="text-danger small text-center">{error}</div>}

                <button 
                    type="submit" 
                    className="auth-btn"
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Send Recovery Scroll'}
                </button>
            </form>

            <div className="auth-links text-center">
                <Link to="/login" className="auth-link">Back to Dojo</Link>
            </div>
        </AuthLayout>
    );
};

export default ForgotPasswordPage;
