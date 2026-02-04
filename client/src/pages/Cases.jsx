import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Search, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Cases = () => {
    const { user } = useAuth();
    const [cases, setCases] = useState([]);
    const [lawyers, setLawyers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        caseNumber: '',
        clientName: '',
        caseType: '',
        court: '',
        status: 'new',
        assignedLawyer: '',
        notes: ''
    });

    useEffect(() => {
        fetchCases();
        if (user?.role === 'admin') {
            fetchLawyers();
        }
    }, [user]);

    const fetchCases = async () => {
        try {
            const { data } = await api.get('/cases');
            setCases(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchLawyers = async () => {
        try {
            const { data } = await api.get('/lawyers');
            setLawyers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (caseData) => {
        setEditingId(caseData._id);
        setFormData({
            caseNumber: caseData.caseNumber,
            clientName: caseData.clientName,
            caseType: caseData.caseType,
            court: caseData.court,
            status: caseData.status,
            assignedLawyer: caseData.assignedLawyer?._id || caseData.assignedLawyer || '',
            notes: caseData.notes || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذه القضية؟')) {
            try {
                await api.delete(`/cases/${id}`);
                fetchCases();
            } catch (error) {
                alert('خطأ في الحذف');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/cases/${editingId}`, formData);
            } else {
                await api.post('/cases', formData);
            }
            setShowModal(false);
            resetForm();
            fetchCases();
        } catch (error) {
            alert(editingId ? 'خطأ في التعديل' : 'خطأ في الإضافة');
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            caseNumber: '',
            clientName: '',
            caseType: '',
            court: '',
            status: 'new',
            assignedLawyer: '',
            notes: ''
        });
    };

    const filteredCases = cases.filter(c =>
        c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="main-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b' }}>إدارة القضايا</h1>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    قضية جديدة
                </button>
            </div>

            <div className="card">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', right: '10px', top: '12px', color: '#94a3b8' }} />
                        <input
                            className="input-field"
                            placeholder="بحث باسم الموكل أو رقم القضية..."
                            style={{ paddingRight: '2.5rem', marginBottom: 0 }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>رقم القضية</th>
                            <th>الموكل</th>
                            <th>المحكمة</th>
                            <th>النوع</th>
                            <th>الحالة</th>
                            {user?.role === 'admin' && <th>المحامي المسؤول</th>}
                            <th>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCases.map(c => (
                            <tr key={c._id}>
                                <td>{c.caseNumber}</td>
                                <td>{c.clientName}</td>
                                <td>{c.court}</td>
                                <td>{c.caseType}</td>
                                <td>
                                    <span className={`badge ${c.status === 'ongoing' ? 'badge-green' : c.status === 'new' ? 'badge-blue' : 'badge-yellow'}`}>
                                        {c.status === 'ongoing' ? 'جارية' : c.status === 'new' ? 'جديدة' : 'منتهية'}
                                    </span>
                                </td>
                                {user?.role === 'admin' && <td>{c.assignedLawyer?.name || 'غير معين'}</td>}
                                <td style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleEdit(c)}
                                        className="btn"
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc' }}
                                    >
                                        تعديل / تفاصيل
                                    </button>
                                    {user?.role === 'admin' && (
                                        <button
                                            onClick={() => handleDelete(c._id)}
                                            className="btn"
                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', border: '1px solid #fee2e2', color: '#ef4444', backgroundColor: '#fff1f2' }}
                                        >
                                            حذف
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ marginBottom: '1rem' }}>{editingId ? 'تعديل بيانات القضية' : 'إضافة قضية جديدة'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input className="input-field" placeholder="رقم القضية" value={formData.caseNumber} onChange={e => setFormData({ ...formData, caseNumber: e.target.value })} required />
                                <input className="input-field" placeholder="اسم الموكل" value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input className="input-field" placeholder="نوع القضية" value={formData.caseType} onChange={e => setFormData({ ...formData, caseType: e.target.value })} required />
                                <input className="input-field" placeholder="المحكمة" value={formData.court} onChange={e => setFormData({ ...formData, court: e.target.value })} required />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>الحالة</label>
                                <select className="input-field" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                    <option value="new">جديدة</option>
                                    <option value="ongoing">جارية</option>
                                    <option value="finished">منتهية</option>
                                </select>
                            </div>

                            {user?.role === 'admin' && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>المحامي المسؤول</label>
                                    <select className="input-field" value={formData.assignedLawyer} onChange={e => setFormData({ ...formData, assignedLawyer: e.target.value })}>
                                        <option value="">اختر المحامي المسؤول</option>
                                        {lawyers.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
                                    </select>
                                </div>
                            )}

                            <textarea className="input-field" placeholder="ملاحظات..." rows="3" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}></textarea>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingId ? 'تحديث' : 'حفظ'}</button>
                                <button type="button" className="btn" onClick={() => { setShowModal(false); resetForm(); }} style={{ flex: 1, border: '1px solid #ccc' }}>إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Cases;
