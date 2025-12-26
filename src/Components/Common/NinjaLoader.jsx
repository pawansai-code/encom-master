import { GiNinjaStar } from 'react-icons/gi';
import './NinjaLoader.css';

const NinjaLoader = ({ size = 60, color = "#00d4ff" }) => {
    return (
        <div className="ninja-loader-container">
            <div className="ninja-blade-wrapper">
                <GiNinjaStar className="ninja-blade-icon" style={{ fontSize: size, color: color }} />
            </div>
            <p className="ninja-loading-text">Sneaking In….</p>
        </div>
    );
};

export default NinjaLoader;
