import { FaChartLine, FaCog, FaUsers, FaUserShield } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import HomeNavbar from '../../Components/Homepage/HomeNavbar';
import { logoutUser, selectUser } from '../../State/slices/userSlice';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/auth/admin/login');
    };

    if (!user || user.role !== 'admin') {
         return (
             <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
                 <div className="text-center">
                     <h1>Access Denied</h1>
                     <p>You do not have permission to view this page.</p>
                     <Link to="/auth/admin/login" className="btn btn-primary">Go to Admin Login</Link>
                 </div>
             </div>
         );
    }

    return (
        <div className="admin-dashboard bg-light min-vh-100">
            <HomeNavbar />
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h1 className="fw-bold text-dark mb-1">Admin Dashboard</h1>
                        <p className="text-secondary mb-0">Welcome, {user.data?.name || "Admin"}</p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm p-4 h-100">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="p-3 bg-primary bg-opacity-10 rounded-circle text-primary">
                                    <FaUsers size={24} />
                                </div>
                                <h5 className="mb-0 fw-bold">Total Users</h5>
                            </div>
                            <h2 className="fw-bold mb-0">1,234</h2>
                            <small className="text-success">+5% from last month</small>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm p-4 h-100">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="p-3 bg-success bg-opacity-10 rounded-circle text-success">
                                    <FaChartLine size={24} />
                                </div>
                                <h5 className="mb-0 fw-bold">Active Sessions</h5>
                            </div>
                            <h2 className="fw-bold mb-0">85</h2>
                            <small className="text-muted">Currently active</small>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm p-4 h-100">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="p-3 bg-warning bg-opacity-10 rounded-circle text-warning">
                                    <FaUserShield size={24} />
                                </div>
                                <h5 className="mb-0 fw-bold">System Status</h5>
                            </div>
                            <h2 className="fw-bold mb-0 text-success">Healthy</h2>
                            <small className="text-muted">All systems operational</small>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <h4 className="fw-bold mb-4">Quick Actions</h4>
                <div className="row g-4">
                    <div className="col-md-3">
                        <Link to="#" className="text-decoration-none">
                            <div className="card border-0 shadow-sm p-4 h-100 hover-card text-center">
                                <FaUsers size={32} className="text-primary mb-3 mx-auto" />
                                <h6 className="fw-bold text-dark">Manage Users</h6>
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-3">
                         <Link to="#" className="text-decoration-none">
                            <div className="card border-0 shadow-sm p-4 h-100 hover-card text-center">
                                <FaCog size={32} className="text-secondary mb-3 mx-auto" />
                                <h6 className="fw-bold text-dark">Settings</h6>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
