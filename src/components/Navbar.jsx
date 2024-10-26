import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('tokenExpiration');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-center">
                <NavLink to="/" className="logo">
                    Property Manager
                </NavLink>
                <div className="nav-links">
                    <NavLink to="/my-bookings" className="nav-link">
                        My Bookings
                    </NavLink>
                    <NavLink to="/" className="nav-link">
                        Properties
                    </NavLink>
                    {role === 'admin' && (
                        <>
                            <NavLink to="/admin/bookings" className="nav-link">
                                Edit Bookings
                            </NavLink>
                            <NavLink to="/admin" className="nav-link">
                                Edit Properties
                            </NavLink>
                        </>
                    )}

                    <button onClick={handleLogout} className="green-button">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
