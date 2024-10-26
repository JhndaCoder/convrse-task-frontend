import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (token && allowedRoles.includes(role)) {
      setIsAuthorized(true);
    } else if (!token) {
      setIsAuthorized(false);
    } else {
      setIsAuthorized(false);
    }
    setIsLoading(false);
  }, [role, token, allowedRoles]);

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthorized) {
    return token ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
