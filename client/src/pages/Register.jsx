import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(name, email, password);
        if (result.success) {
            // First user is Admin, others are Lawyers.
            // We can redirect based on role if we checked it, but let's go to root which redirects based on role.
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f1f5f9' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', borderTop: '4px solid var(--primary-color)' }}>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '56px',
                        height: '56px',
                        backgroundColor: 'var(--primary-color)',
                        borderRadius: '12px',
                        marginBottom: '1rem'
                    }}>
                        <UserPlus size={28} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>إنشاء حساب جديد</h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>انضم لمنصة المرقاب</p>
                </div>

                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>الاسم الكامل</label>
                        <input
                            type="text"
                            className="input-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>البريد الإلكتروني</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>كلمة المرور</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        تسجيل حساب
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    لديك حساب بالفعل؟ <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>تسجيل الدخول</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
