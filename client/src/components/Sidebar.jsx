import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Calendar, Users, LogOut, Scale } from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const isAdmin = user?.role === 'admin';

    return (
        <div className="sidebar">
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'var(--secondary-color)',
                    borderRadius: '12px',
                    marginBottom: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <Scale size={32} color="white" />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f8fafc', lineHeight: '1.4' }}>
                    المرقاب
                    <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'normal', color: '#94a3b8', marginTop: '4px' }}>
                        للمحاماة والاستشارات القانونية
                    </span>
                </h2>
            </div>

            <nav style={{ flex: 1 }}>
                <NavLink to={isAdmin ? "/admin" : "/client"} end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    لوحة التحكم
                </NavLink>

                {isAdmin && (
                    <NavLink to="/admin/lawyers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Users size={20} />
                        المحامين
                    </NavLink>
                )}

                <NavLink to={isAdmin ? "/admin/cases" : "/client/cases"} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Briefcase size={20} />
                    القضايا
                </NavLink>

                <NavLink to={isAdmin ? "/admin/sessions" : "/client/sessions"} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Calendar size={20} />
                    الجلسات
                </NavLink>
            </nav>

            <div style={{ marginTop: 'auto', borderTop: '1px solid #334155', paddingTop: '1rem' }}>
                <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                    {user?.name} ({isAdmin ? 'مدير' : 'محامي'})
                </div>
                <button
                    onClick={logout}
                    className="nav-link"
                    style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}
                >
                    <LogOut size={20} />
                    تسجيل خروج
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
