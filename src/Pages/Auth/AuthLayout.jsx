import { GiNinjaHead } from 'react-icons/gi';
import NinjaMascot from '../../Components/Auth/NinjaMascot';
import './Auth.css';


const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="auth-page">
            {/* Background elements */}
            <div className="auth-bg-shape shape-1"></div>
            <div className="auth-bg-shape shape-2"></div>

            <div className="auth-container">
                {/* Left Side: Form Content */}
                <div className="auth-left">
                    <div className="auth-logo-container">
                        <div className="auth-brand-text">
                            EDU<span>verse</span>
                        </div>
                        <GiNinjaHead className="auth-brand-icon" />
                    </div>
                    <div className="auth-header">
                        <h1 className="auth-title">{title}</h1>
                        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
                    </div>
                    
                    {children}
                </div>

                {/* Right Side: Ninja Visuals */}
                <div className="auth-right">
                    <div className="ninja-stage">
                        <NinjaMascot />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
