import { Navigate } from 'react-router';

const ProtectedRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // 1. Si pas de token, on redirige vers le login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. Si un rôle spécifique est requis (ex: admin) et que l'utilisateur ne l'a pas
    if (allowedRole && user?.role !== allowedRole) {
        // On le renvoie vers son dashboard par défaut
        return <Navigate to="/voterDashboard" replace />;
    }

    // 3. Si tout est bon, on affiche la page
    return children;
};

export default ProtectedRoute;