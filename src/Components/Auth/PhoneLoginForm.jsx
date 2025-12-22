import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from 'firebase/auth';
import { useState } from 'react';
import { FaArrowLeft, FaCheck, FaPhone } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../State/slices/userSlice';

const PhoneLoginForm = ({ onBack }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth();

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    handleSendOtp();
                }
            });
        }
    };

    const handleSendOtp = async (e) => {
        if(e) e.preventDefault();
        setError('');
        setLoading(true);
        
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;

        try {
            // Format phone number logic could go here (e.g. ensure +CountryCode)
            // For now assuming user types full formatted number
            const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            window.confirmationResult = confirmation;
            setConfirmationResult(confirmation);
            setShowOtpInput(true);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to send SMS. invalid format? (Use +1...)');
            setLoading(false);
            if(window.recaptchaVerifier) window.recaptchaVerifier.clear();
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await confirmationResult.confirm(otp);
            const user = result.user;
            
            dispatch(setUser({
                uid: user.uid,
                email: user.providerData[0]?.email || 'phone user', // Phone auth email is often null
                name: user.displayName || 'Mobile Ninja',
                photoURL: user.photoURL,
                phoneNumber: user.phoneNumber
            }));

            navigate('/dashboard');
        } catch (err) {
            setError('Invalid Code. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="phone-login-form">
            <button className="auth-link mb-3 border-0 bg-transparent p-0 d-flex align-items-center gap-2" onClick={onBack}>
                <FaArrowLeft /> Back to Email
            </button>
            
            <h2 className="auth-title mb-1" style={{fontSize: '1.5rem'}}>Phone Access</h2>
            <p className="auth-subtitle mb-4">Enter your number to receive a ninja scroll (SMS).</p>

            {!showOtpInput ? (
                <form onSubmit={handleSendOtp} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Mobile Number</label>
                        <input
                            type="tel"
                            className="form-input"
                            placeholder="+1 234 567 8900"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="text-danger small">{error}</div>}
                    <div id="recaptcha-container"></div>
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Code'} <FaPhone className="ms-2" />
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Verification Code</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="text-danger small">{error}</div>}
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify & Enter'} <FaCheck className="ms-2" />
                    </button>
                </form>
            )}
        </div>
    );
};

export default PhoneLoginForm;
