import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Trash2 } from 'lucide-react';

const Lawyers = () => {
    const [lawyers, setLawyers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    useEffect(() => {
        fetchLawyers();
    }, []);

    const fetchLawyers = async () => {
        try {
            const { data } = await api.get('/lawyers');
            setLawyers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
            try {
                await api.delete(`/lawyers/${id}`);
                fetchLawyers();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/lawyers', formData);
            setShowModal(false);
            setFormData({ name: '', email: '', password: '' });
            fetchLawyers();
        } catch (error) {
            alert('Error creating lawyer');
        }
    };

    return (
        <div className="main-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b' }}>إدارة المحامين</h1>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    إضافة محامي
                </button>
            </div>

            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>الاسم</th>
                            <th>البريد الإلكتروني</th>
                            <th>تاريخ الانضمام</th>
                            <th>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lawyers.map(lawyer => (
                            <tr key={lawyer._id}>
                                <td>{lawyer.name}</td>
                                <td>{lawyer.email}</td>
                                <td>{new Date(lawyer.createdAt).toLocaleDateString('ar-EG')}</td>
                                <td>
                                    <button onClick={() => handleDelete(lawyer._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div className="card" style={{ width: '400px' }}>
                        <h3 style={{ marginBottom: '1rem' }}>إضافة محامي جديد</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                className="input-field"
                                placeholder="الاسم"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <input
                                className="input-field"
                                placeholder="البريد الإلكتروني"
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <input
                                className="input-field"
                                placeholder="كلمة المرور"
                                type="password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
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

export default Lawyers;
