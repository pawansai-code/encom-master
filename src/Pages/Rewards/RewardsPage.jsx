import { FaCoins, FaGift, FaStar } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import HomeNavbar from '../../Components/Homepage/HomeNavbar';

const RewardsPage = () => {
    const { profile } = useSelector((state) => state.user);
    const coins = profile?.data?.coins || 0;

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white' }}>
            <HomeNavbar />
            <div className="container py-5 mt-5">
                <div className="text-center mb-5 fade-in-up">
                    <h1 className="display-4 fw-bold">
                        <span className="text-warning">Rewards</span> Center <FaGift />
                    </h1>
                    <p className="lead text-secondary">Redeem your hard-earned coins for amazing rewards!</p>
                </div>
                
                {/* Balance Card */}
                <div className="row justify-content-center mb-5">
                    <div className="col-md-6 col-lg-4">
                       <div className="card bg-dark border-warning p-4 text-center shadow-lg" style={{ borderRadius: '20px' }}>
                           <h3 className="text-light opacity-75">Your Balance</h3>
                           <h2 className="display-3 fw-bold text-warning my-3">
                                <FaCoins className="me-2" /> {coins}
                           </h2>
                           <p className="mb-0 text-secondary">EduCoins Available</p>
                       </div>
                    </div>
                </div>

                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                    <div className="text-center">
                         <FaStar size={50} className="text-secondary mb-3" />
                         <h3 className="text-secondary">No rewards available yet.</h3>
                         <p className="text-secondary opacity-75">Keep learning to unlock items!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardsPage;
