import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiFetch } from '../lib/api';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Les nouveaux mots de passe ne correspondent pas.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        setLoading(true);
        try {
            const res = await apiFetch('/api/mobile/parent/password', {
                method: 'POST',
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/dashboard'), 2000);
            } else {
                setError(data.error || "Une erreur est survenue.");
            }
        } catch (err) {
            console.error("Failed to update password:", err);
            setError("Erreur de connexion au serveur.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ background: 'none', border: 'none', color: 'var(--text)', padding: '0.5rem' }}
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 style={{ fontSize: '1.5rem' }}>Changer le mot de passe</h1>
            </header>

            {success ? (
                <div className="glass" style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                    <CheckCircle2 size={48} color="#22c55e" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ marginBottom: '0.5rem' }}>Succès !</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Votre mot de passe a été mis à jour. Redirection...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Ancien mot de passe</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input 
                                type="password" 
                                required
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 3rem',
                                    borderRadius: '1rem',
                                    border: '1px solid var(--border)',
                                    background: 'var(--input-bg)',
                                    color: 'var(--text)',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Nouveau mot de passe</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input 
                                type="password" 
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 3rem',
                                    borderRadius: '1rem',
                                    border: '1px solid var(--border)',
                                    background: 'var(--input-bg)',
                                    color: 'var(--text)',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Confirmer le nouveau mot de passe</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input 
                                type="password" 
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 3rem',
                                    borderRadius: '1rem',
                                    border: '1px solid var(--border)',
                                    background: 'var(--input-bg)',
                                    color: 'var(--text)',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.875rem' }}>
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            padding: '1rem',
                            borderRadius: '1rem',
                            border: 'none',
                            background: 'var(--primary)',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            marginTop: '0.5rem',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading && <Loader2 size={20} className="animate-spin" />}
                        Mettre à jour le mot de passe
                    </button>
                </form>
            )}
        </div>
    );
};

export default ChangePassword;
