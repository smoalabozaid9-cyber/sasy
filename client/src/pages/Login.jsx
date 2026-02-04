import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Scale } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    // Debugging API URL
    console.log('Current API URL:', import.meta.env.VITE_API_URL);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            const role = result.data.role;
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/client');
            }
        } else {
            let msg = result.message;
            if (msg === 'Login failed' && !email.includes('@')) msg = 'تأكد من كتابة الإيميل بشكل صحيح';
            if (msg.includes('Network Error')) msg = 'خطأ في الاتصال بالسيرفر. تأكد من تشغيل السيرفر ومن المتغيرات البيئية.';
            setError(msg);
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
                        <Scale size={28} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>المرقاب</h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>للمحاماة والاستشارات القانونية</p>
                </div>

                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#334155', fontSize: '1.1rem' }}>تسجيل الدخول للنظام</h2>
                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
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
                        دخول
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    ليس لديك حساب؟ <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>إنشاء حساب جديد</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
