import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users, Briefcase, Calendar, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ cases: 0, lawyers: 0, sessions: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [casesRes, lawyersRes, sessionsRes] = await Promise.all([
                    api.get('/cases'),
                    api.get('/lawyers'),
                    api.get('/sessions')
                ]);

                // Filter for upcoming sessions (date >= now)
                const now = new Date();
                const upcoming = sessionsRes.data.filter(s => new Date(s.sessionDate) >= now).length;

                setStats({
                    cases: casesRes.data.length,
                    lawyers: lawyersRes.data.length,
                    sessions: upcoming
                });
            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="main-content">
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1e293b' }}>لوحة التحكم (المدير)</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: '#e0f2fe', borderRadius: '50%', color: '#0284c7' }}>
                        <Users size={32} />
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>المحامين</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.lawyers}</p>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: '#dcfce7', borderRadius: '50%', color: '#16a34a' }}>
                        <Briefcase size={32} />
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>القضايا النشطة</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.cases}</p>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: '#fef9c3', borderRadius: '50%', color: '#ca8a04' }}>
                        <Calendar size={32} />
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>الجلسات القادمة</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.sessions}</p>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={20} color="#e11d48" />
                    تنبيهات النظام
                </h3>
                <p style={{ color: '#64748b' }}>لا توجد تنبيهات جديدة.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
