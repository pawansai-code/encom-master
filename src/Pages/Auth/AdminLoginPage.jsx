import { useState } from 'react';
import { GiNinjaHead } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectUserError, selectUserStatus, verifyAdmin } from '../../State/slices/userSlice';
import './Auth.css';
import AuthLayout from './AuthLayout';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [adminKey, setAdminKey] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = useSelector(selectUserStatus);
    const authError = useSelector(selectUserError);
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        
        // Dispatch verifyAdmin which checks Firebase Auth + Firestore Key
        const result = await dispatch(verifyAdmin({ email, password, adminKey }));
        
        if (verifyAdmin.fulfilled.match(result)) {
            navigate('/admin/dashboard'); 
        }
    };

    return (
        <AuthLayout title="Sensei Portal" subtitle="Restricted Access. Masters Only.">
            <div className="text-center mb-4">
                 <GiNinjaHead size={50} color="#e74c3c" />
            </div>
            
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" style={{color: '#ff6b6b'}}>Admin Email</label>
                    <input
                        type="email"
                        className="form-input"
                        placeholder="sensei@eduverse.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{borderColor: '#ff4757'}}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" style={{color: '#ff6b6b'}}>Admin Password</label>
                    <input
                        type="password"
                        className="form-input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{borderColor: '#ff4757'}}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" style={{color: '#ff6b6b'}}>Sensei Key</label>
                    <input
                        type="password"
                        className="form-input"
                        placeholder="Key required"
                        value={adminKey}
                        onChange={(e) => setAdminKey(e.target.value)}
                        style={{borderColor: '#ff4757'}}
                        required
                    />
                </div>

                {(authError || localError) && (
                    <div className="text-danger small text-center">{localError || authError}</div>
                )}

                <button 
                    type="submit" 
                    className="auth-btn"
                    disabled={status === 'loading'}
                    style={{background: '#e74c3c'}}
                >
                    {status === 'loading' ? 'Verifying Credentials...' : 'Access Command Center'}
                </button>
            </form>


            <div className="auth-links text-center">
                <span>
                    New Sensei? <Link to="/auth/admin/signup" className="auth-link" style={{color: '#ff6b6b'}}>Initiate</Link>
                </span>
            </div>
        </AuthLayout>
    );
};

export default AdminLoginPage;
