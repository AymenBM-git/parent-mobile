import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const parent = localStorage.getItem('parent');
    return parent ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
