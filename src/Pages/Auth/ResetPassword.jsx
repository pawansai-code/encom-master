import { useState } from 'react';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false); // Toggle for both fields for simplicity, or separate if stricter UX needed
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        setIsLoading(true);
        // Simulate Reset
        setTimeout(() => {
            setIsLoading(false);
            navigate('/auth/login');
        }, 1500);
    };

    return (
        <AuthLayout 
            title="Reset Password" 
            subtitle="Please type something you'll remember."
        >
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">New Password</label>
                    <div className="input-wrapper">
                        <FaLock className="input-icon" />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password"
                            className="form-input" 
                            placeholder="Must be 8 characters at least"
                            value={formData.password}
                            onChange={handleChange}
                            required 
                        />
                         <button 
                            type="button"
                            className="position-absolute end-0 top-50 translate-middle-y bg-transparent border-0 text-secondary me-2"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ zIndex: 10, cursor: 'pointer', color: '#ccc' }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <div className="input-wrapper">
                        <FaLock className="input-icon" />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="confirmPassword"
                            className="form-input" 
                            placeholder="Confirm your new password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                </div>

                <button type="submit" className="auth-btn" disabled={isLoading}>
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </AuthLayout>
    );
};

export default ResetPassword;
