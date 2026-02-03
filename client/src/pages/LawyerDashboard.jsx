import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Briefcase, Calendar, CheckSquare } from 'lucide-react';

const LawyerDashboard = () => {
    const [myCases, setMyCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const { data } = await api.get('/cases');
                setMyCases(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchCases();
    }, []);

    return (
        <div className="main-content">
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1e293b' }}>مكتب المحامي</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '50%', color: '#1e40af' }}>
                        <Briefcase size={32} />
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>قضاياي</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{myCases.length}</p>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: '#fae8ff', borderRadius: '50%', color: '#86198f' }}>
                        <Calendar size={32} />
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>جلسات هذا الأسبوع</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>0</p>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>آخر القضايا</h3>
                {loading ? <p>جاري التحميل...</p> : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'right' }}>رقم القضية</th>
                                <th style={{ textAlign: 'right' }}>الموكل</th>
                                <th style={{ textAlign: 'right' }}>الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myCases.slice(0, 5).map(c => (
                                <tr key={c._id}>
                                    <td>{c.caseNumber}</td>
                                    <td>{c.clientName}</td>
                                    <td>
                                        <span className={`badge ${c.status === 'ongoing' ? 'badge-green' : 'badge-blue'}`}>
                                            {c.status === 'ongoing' ? 'جارية' : c.status === 'new' ? 'جديدة' : 'منتهية'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {myCases.length === 0 && <tr><td colSpan="3">لا توجد قضايا مسجلة</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default LawyerDashboard;
