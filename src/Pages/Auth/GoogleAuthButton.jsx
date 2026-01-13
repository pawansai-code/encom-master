import { FaGoogle } from 'react-icons/fa';

const GoogleAuthButton = ({ text = "Continue with Google", onClick }) => {
    return (
        <button 
            type="button" 
            className="google-auth-btn"
            onClick={onClick}
        >
            <FaGoogle className="google-icon" />
            <span>{text}</span>
        </button>
    );
};

export default GoogleAuthButton;
