import { FaArrowLeft, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ninjaImg from '../../assets/ninja_404.jpg'; // Verify path
import './NotFound.css';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="error-code" data-text="404">404</h1>
                
                <img src={ninjaImg} alt="Confused Ninja" className="ninja-404-img" />
                
                <h2 className="error-message">Page Not Found</h2>
                <p className="error-explanation">
                    Oops! The page you are looking for has vanished into the shadows. 
                    It seems our ninja scouts couldn't locate this path in the Eduverse.
                </p>

                <div className="not-found-actions">
                    <button className="action-btn btn-primary-home" onClick={() => navigate('/')}>
                        <FaHome /> Go to Home
                    </button>
                    <button className="action-btn btn-secondary-back" onClick={() => navigate(-1)}>
                        <FaArrowLeft /> Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
