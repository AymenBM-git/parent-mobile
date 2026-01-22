import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, Sun, Moon } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useTheme } from '../lib/ThemeContext';

const Login = () => {
    const { theme, toggleTheme } = useTheme();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await apiFetch('/api/mobile/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('parent', JSON.stringify(data));
                navigate('/dashboard');
            } else {
                setError(data.error || 'Erreur de connexion');
            }
        } catch (err) {
            setError('Impossible de se connecter au serveur');
        }
    };

    return (
        <div style={{ padding: '2rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <button onClick={toggleTheme} className="glass" style={{ padding: '0.75rem', borderRadius: '1rem', border: 'none', color: 'var(--text)', display: 'flex', alignItems: 'center' }}>
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '0.5rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Leaders Mobile</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Espace Parents</p>

                {error && <div style={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Utilisateur"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem 0.875rem 3rem',
                                borderRadius: '1rem',
                                border: '1px solid var(--border)',
                                background: 'var(--glass)',
                                color: 'var(--text)',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem 0.875rem 3rem',
                                borderRadius: '1rem',
                                border: '1px solid var(--border)',
                                background: 'var(--glass)',
                                color: 'var(--text)',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Se connecter <LogIn size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
