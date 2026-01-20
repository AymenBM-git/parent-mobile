import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Home, Calendar, BookOpen, Bell, Menu } from 'lucide-react';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { studentId: urlStudentId } = useParams();
    const [lastStudentId, setLastStudentId] = useState(localStorage.getItem('lastStudentId'));

    useEffect(() => {
        if (urlStudentId) {
            localStorage.setItem('lastStudentId', urlStudentId);
            setLastStudentId(urlStudentId);
        }
    }, [urlStudentId]);

    const effectiveStudentId = urlStudentId || lastStudentId;

    const navItems = [
        { icon: Home, label: 'Accueil', path: effectiveStudentId ? `/home/${effectiveStudentId}` : '/dashboard' },
        { icon: Calendar, label: 'Emploi', path: effectiveStudentId ? `/schedule/${effectiveStudentId}` : '/dashboard' },
        { icon: BookOpen, label: 'TAF', path: effectiveStudentId ? `/tafs/${effectiveStudentId}` : '/dashboard' },
        { icon: Bell, label: 'Alertes', path: '/events' },
    ];

    if (location.pathname === '/dashboard') {
        return <main style={{ paddingBottom: '5rem' }}><Outlet /></main>;
    }

    return (
        <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--background)' }}>
            <header className="glass" style={{ margin: '1rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                <h2 style={{ fontSize: '1.25rem' }}>Leaders App</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text)' }}>
                        <Menu size={24} />
                    </button>
                </div>
            </header>

            <main style={{ flex: 1, padding: '0 1rem', paddingBottom: '8rem', overflowY: 'auto' }}>
                <Outlet />
            </main>

            <nav className="glass" style={{
                position: 'fixed',
                bottom: '1rem',
                left: '1rem',
                right: '1rem',
                padding: '0.75rem',
                display: 'flex',
                justifyContent: 'space-around',
                borderRadius: '2rem',
                zIndex: 100
            }}>
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: location.pathname.includes(item.path.split('/')[1]) ? 'var(--primary)' : 'var(--text-muted)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem',
                            transition: 'all 0.3s'
                        }}
                    >
                        <item.icon size={24} />
                        <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Layout;
