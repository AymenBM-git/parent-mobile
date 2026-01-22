import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronRight, LogOut, Sun, Moon } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useTheme } from '../lib/ThemeContext';

const Dashboard = () => {
    const { theme, toggleTheme } = useTheme();
    const [children, setChildren] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const parent = JSON.parse(localStorage.getItem('parent') || '{}');

    useEffect(() => {
        apiFetch(`/api/mobile/parent/children?parentId=${parent.id}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setChildren(data);
                } else {
                    console.error("Children data is not an array:", data);
                    setChildren([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch children:", err);
                setChildren([]);
                setLoading(false);
            });
    }, [parent.id]);

    const handleLogout = () => {
        localStorage.removeItem('parent');
        navigate('/login');
    };

    return (
        <div style={{ padding: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem' }}>Bonjour, {parent.name} 👋</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Bienvenue dans votre espace</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={toggleTheme} className="glass" style={{ padding: '0.75rem', borderRadius: '1rem', border: 'none', color: 'var(--text)', display: 'flex', alignItems: 'center' }}>
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={handleLogout} className="glass" style={{ padding: '0.75rem', borderRadius: '1rem', border: 'none', color: 'var(--accent)' }}>
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <h3 style={{ marginBottom: '1rem' }}>Mes enfants</h3>

            {loading ? (
                <p>Chargement...</p>
            ) : children.length === 0 ? (
                <p>Aucun enfant rattaché à ce compte.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {children.map(child => (
                        <div
                            key={child.id}
                            onClick={() => navigate(`/home/${child.id}`)}
                            className="glass"
                            style={{
                                padding: '1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            <div style={{
                                width: '3.5rem',
                                height: '3.5rem',
                                borderRadius: '1rem',
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <User size={32} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '1.1rem' }}>{child.firstName} {child.lastName}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{child.classe?.name || 'Sans classe'}</p>
                            </div>
                            <ChevronRight size={24} style={{ color: 'var(--text-muted)' }} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
