import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';

const Sessions = () => {
    const [cases, setCases] = useState([]);
    const [sessions, setSessions] = useState([]); // In a real app, this would be paginated or fetched per case/date
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        caseId: '',
        sessionDate: '',
        court: '',
        outcome: '',
        nextSessionDate: ''
    });

    useEffect(() => {
        fetchCases();
        // For MVP, we might filtering sessions by case or showing upcoming. 
        // Implementing a "fetch all upcoming sessions" endpoint would be better, but for now let's just show the UI for adding.
    }, []);

    const fetchCases = async () => {
        try {
            const { data } = await api.get('/cases');
            setCases(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCaseChange = async (caseId) => {
        setFormData({ ...formData, caseId });
        if (caseId) {
            try {
                const { data } = await api.get(`/sessions/case/${caseId}`);
                setSessions(data);
            } catch (error) {
                console.error(error);
            }
        } else {
            setSessions([]);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/sessions', formData);
            setShowModal(false);
            handleCaseChange(formData.caseId); // Refresh list
            setFormData({
                caseId: formData.caseId, // Keep case selected
                sessionDate: '',
                court: '',
                outcome: '',
                nextSessionDate: ''
            });
        } catch (error) {
            alert('Error creating session');
        }
    };

    return (
        <div className="main-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b' }}>إدارة الجلسات</h1>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    جلسة جديدة
                </button>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>اختر قضية لعرض جلساتها:</label>
                <select className="input-field" onChange={(e) => handleCaseChange(e.target.value)}>
                    <option value="">-- اختر القضية --</option>
                    {cases.map(c => (
                        <option key={c._id} value={c._id}>{c.caseNumber} - {c.clientName}</option>
                    ))}
                </select>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>سجل الجلسات</h3>
                {sessions.length === 0 ? (
                    <p style={{ color: '#64748b' }}>لا توجد جلسات لهذه القضية أو لم يتم اختيار قضية.</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>تاريخ الجلسة</th>
                                <th>المحكمة</th>
                                <th>القرار / النتيجة</th>
                                <th>الموعد القادم</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map(s => (
                                <tr key={s._id}>
                                    <td>{new Date(s.sessionDate).toLocaleDateString('ar-EG')}</td>
                                    <td>{s.court}</td>
                                    <td>{s.outcome || '-'}</td>
                                    <td>{s.nextSessionDate ? new Date(s.nextSessionDate).toLocaleDateString('ar-EG') : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div className="card" style={{ width: '500px' }}>
                        <h3 style={{ marginBottom: '1rem' }}>تسجيل جلسة جديدة</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>القضية</label>
                                <select className="input-field" value={formData.caseId} onChange={e => setFormData({ ...formData, caseId: e.target.value })} required>
                                    <option value="">اختر القضية</option>
                                    {cases.map(c => <option key={c._id} value={c._id}>{c.caseNumber} - {c.clientName}</option>)}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>تاريخ الجلسة</label>
                                    <input type="date" className="input-field" value={formData.sessionDate} onChange={e => setFormData({ ...formData, sessionDate: e.target.value })} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>المحكمة</label>
                                    <input className="input-field" value={formData.court} onChange={e => setFormData({ ...formData, court: e.target.value })} required />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>القرار / النتيجة</label>
                                <textarea className="input-field" rows="2" value={formData.outcome} onChange={e => setFormData({ ...formData, outcome: e.target.value })}></textarea>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>تاريخ الجلسة القادمة (اختياري)</label>
                                <input type="date" className="input-field" value={formData.nextSessionDate} onChange={e => setFormData({ ...formData, nextSessionDate: e.target.value })} />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>حفظ</button>
                                <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ flex: 1, border: '1px solid #ccc' }}>إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sessions;
