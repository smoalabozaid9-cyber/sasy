import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Sidebar from './components/Sidebar';
import { useAuth } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import LawyerDashboard from './pages/LawyerDashboard';
import Lawyers from './pages/Lawyers';
import Cases from './pages/Cases';
import Sessions from './pages/Sessions';

const Layout = () => (
    <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
            <Outlet />
        </div>
    </div>
);

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />; // Or unauthorized page
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Admin Routes */}
                <Route path="/admin" element={
                    <PrivateRoute allowedRoles={['admin']}>
                        <Layout />
                    </PrivateRoute>
                }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="lawyers" element={<Lawyers />} />
                    <Route path="cases" element={<Cases />} />
                    <Route path="sessions" element={<Sessions />} />
                </Route>

                {/* Lawyer Routes */}
                <Route path="/client" element={
                    <PrivateRoute allowedRoles={['lawyer']}>
                        <Layout />
                    </PrivateRoute>
                }>
                    <Route index element={<LawyerDashboard />} />
                    <Route path="cases" element={<Cases />} />
                    <Route path="sessions" element={<Sessions />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
