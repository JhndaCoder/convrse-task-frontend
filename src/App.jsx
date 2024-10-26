import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PropertyListing from './pages/PropertyListing';
import PropertyDetails from './pages/PropertyDetails';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import MyBookings from './pages/Mybookings';
import EditBookings from './pages/EditBookings';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />

        {/* Customer and Admin Accessible Routes */}
        <Route element={<ProtectedRoute allowedRoles={['customer', 'admin']} />}>
          <Route path="/" element={<PropertyListing />} />
          <Route path="/:id" element={<PropertyDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>

        {/* Admin-Only Route */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path='/admin/bookings' element={<EditBookings />} />
        </Route>

        {/* Wildcard Route for Unknown Paths */}
        <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
