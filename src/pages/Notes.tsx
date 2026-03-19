import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import { apiFetch } from '../lib/api';

const Notes = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [notesBySubject, setNotesBySubject] = useState<Record<string, any[]>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        apiFetch(`/api/mobile/parent/notes?studentId=${studentId}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.error("Error fetching notes:", data.error);
                } else {
                    setNotesBySubject(data);
                }
            })
            .catch(err => console.error("Failed to fetch notes:", err))
            .finally(() => setIsLoading(false));
    }, [studentId]);

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'var(--glass)',
                        border: 'none',
                        padding: '0.75rem',
                        borderRadius: '1rem',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Notes & Résultats</h2>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Chargement des notes...
                </div>
            ) : Object.keys(notesBySubject).length === 0 ? (
                <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <BookOpen size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>Aucune note enregistrée pour le moment.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {Object.entries(notesBySubject).map(([subject, notes]) => (
                        <div key={subject} className="glass" style={{ overflow: 'hidden' }}>
                            <div style={{
                                padding: '1rem',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                background: 'rgba(255,255,255,0.02)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <div style={{
                                    padding: '0.5rem',
                                    borderRadius: '0.75rem',
                                    background: 'rgba(249, 115, 22, 0.1)',
                                    color: '#f97316'
                                }}>
                                    <BookOpen size={18} />
                                </div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{subject}</h3>
                            </div>
                            <div style={{ padding: '0.5rem' }}>
                                {notes.map((n, idx) => (
                                    <div
                                        key={n.id}
                                        style={{
                                            padding: '1rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            borderBottom: idx === notes.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)'
                                        }}
                                    >
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{n.type}</span>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.4rem', borderRadius: '0.4rem' }}>{n.period}</span>
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {new Date(n.date).toLocaleDateString()} • {n.as}
                                            </div>
                                        </div>

                                        <div style={{ textAlign: 'right' }}>
                                            {n.isAbsent ? (
                                                <div style={{
                                                    color: '#f43f5e',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem'
                                                }}>
                                                    <AlertCircle size={14} />
                                                    Absent
                                                </div>
                                            ) : (
                                                <div style={{
                                                    fontSize: '1.25rem',
                                                    fontWeight: 700,
                                                    color: n.note >= 10 ? '#22c55e' : '#f43f5e'
                                                }}>
                                                    {n.note}<span style={{ fontSize: '0.8rem', opacity: 0.6 }}>/20</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notes;
