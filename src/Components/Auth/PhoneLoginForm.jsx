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

    const setupRecaptcha = () => {
        // Mock Recaptcha
        window.recaptchaVerifier = {
             clear: () => {}
        };
    };

    const handleSendOtp = async (e) => {
        if(e) e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            // Mock OTP Sending
             setConfirmationResult({
                confirm: async (code) => {
                    if (code === '123456') {
                        return {
                            user: {
                                uid: 'mock-phone-uid',
                                phoneNumber: phoneNumber,
                                photoURL: null
                            }
                        }
                    } else {
                        throw new Error("Invalid Code");
                    }
                }
            });
            setShowOtpInput(true);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to send SMS.');
            setLoading(false);
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
                email: 'phone-user@eduverse.com', // Phone auth email is often null
                name: 'Mobile Ninja',
                photoURL: user.photoURL,
                phoneNumber: user.phoneNumber
            }));

            navigate('/dashboard');
        } catch (err) {
            setError('Invalid Code. Please try again (Use 123456).');
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
