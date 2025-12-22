import { FaPaperPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Auth.css';
import AuthLayout from './AuthLayout';

const VerifyEmailPage = () => {
    return (
        <AuthLayout title="Verify Your Scroll" subtitle="Completion of training requires verification.">
            <div className="d-flex flex-column align-items-center text-center p-4">
                <div className="mb-4 text-warning" style={{ fontSize: '3rem' }}>
                    <FaPaperPlane />
                </div>
                
                <p className="text-light mb-4">
                    We have sent a digital scroll to your email address. 
                    Please open it and click the verification seal to activate your full ninja status.
                </p>

                <p className="small text-secondary mb-4">
                    Cannot find the scroll? Check your spam folder or wait a few moments.
                </p>

                <button className="auth-btn mb-3">
                    Resend Verification Scroll
                </button>
                
                <Link to="/auth/login" className="auth-link">
                    Return to Login
                </Link>
            </div>
        </AuthLayout>
    );
};

export default VerifyEmailPage;
