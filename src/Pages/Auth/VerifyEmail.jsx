import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const inputsRef = useRef([]);

    const handleChange = (index, value) => {
        if (value.length > 1) return; // Only allow one char
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto move to next input
        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
        const newCode = [...code];
        pastedData.forEach((char, index) => {
            if (index < 6) newCode[index] = char;
        });
        setCode(newCode);
        if (pastedData.length === 6) {
           inputsRef.current[5].focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const verificationCode = code.join('');
        if (verificationCode.length !== 6) {
            alert("Please enter the full 6-digit code.");
            return;
        }

        setIsLoading(true);
        // Simulate Verification
        setTimeout(() => {
            setIsLoading(false);
            navigate('/dashboard'); // or login
        }, 1500);
    };

    return (
        <AuthLayout 
            title="Verify Your Email" 
            subtitle="We sent a verification code to your email. Enter the code below."
        >
            <form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-between gap-2 mb-4" onPaste={handlePaste}>
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => inputsRef.current[index] = el}
                            type="text"
                            maxLength="1"
                            className="form-input text-center p-0"
                            style={{ width: '45px', height: '55px', fontSize: '1.5rem', caretColor: '#ff2e63' }}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                        />
                    ))}
                </div>

                <div className="text-center mb-4">
                     <p className="small text-secondary">
                        Didn't receive the email? <span className="text-primary cursor-pointer fw-bold" style={{cursor: 'pointer'}}>Resend</span>
                     </p>
                </div>

                <button type="submit" className="auth-btn" disabled={isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify Email'}
                </button>
            </form>
        </AuthLayout>
    );
};

export default VerifyEmail;
