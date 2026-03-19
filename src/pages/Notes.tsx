import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import { apiFetch } from '../lib/api';

const Notes = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [notesBySubject, setNotesBySubject] = useState<Record<string, any[]>>({});
    const [isLoading, setIsLoading] = useState(true);
    
    // Filter states
    const [subjects, setSubjects] = useState<any[]>([]);
    const [periods, setPeriods] = useState<string[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [selectedPeriod, setSelectedPeriod] = useState<string>('');
    const [currentAS, setCurrentAS] = useState<string>('');

    // Fetch filters on mount
    useEffect(() => {
        apiFetch(`/api/mobile/parent/notes/filters?studentId=${studentId}`)
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setSubjects(data.subjects || []);
                    setPeriods(data.periods || []);
                    setCurrentAS(data.currentAS || '');
                    
                    if (data.periods?.length > 0) {
                        setSelectedPeriod(data.periods[0]);
                    }
                } else {
                    console.error("Erreur filtres:", data.error);
                }
            })
            .catch(err => {
                console.error("Error fetching filters:", err);
            });
    }, [studentId]);

    // Fetch notes when filters change
    useEffect(() => {
        if (!selectedSubject && !selectedPeriod && !currentAS) return;

        setIsLoading(true);
        const params = new URLSearchParams({
            studentId: studentId || '',
            subjectId: selectedSubject,
            period: selectedPeriod,
            as: currentAS
        });

        apiFetch(`/api/mobile/parent/notes?${params.toString()}`)
            .then(res => {
                if (!res.ok) throw new Error("Erreur serveur " + res.status);
                return res.json();
            })
            .then(data => {
                if (data.error) {
                    console.error("Error fetching notes:", data.error);
                } else {
                    setNotesBySubject(data);
                }
            })
            .catch(err => {
                console.error("Failed to fetch notes:", err);
                // Silence alert for now to avoid spamming during filter changes
            })
            .finally(() => setIsLoading(false));
    }, [studentId, selectedSubject, selectedPeriod, currentAS]);

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ 
                        background: 'var(--glass)', 
                        border: 'none', 
                        padding: '0.75rem', 
                        borderRadius: '1rem',
                        color: 'var(--text)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>Notes & Résultats</h2>
            </div>

            {/* Filters Section */}
            <div className="glass" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>Matière</label>
                    <select 
                        value={selectedSubject} 
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        style={{ 
                            background: 'var(--glass)', 
                            border: '1px solid var(--glass-border)', 
                            borderRadius: '0.75rem', 
                            padding: '0.75rem', 
                            color: 'var(--text)',
                            outline: 'none',
                            WebkitAppearance: 'none'
                        }}
                    >
                        <option value="" style={{ background: 'var(--background)', color: 'var(--text)' }}>Toutes les matières</option>
                        {subjects.map(s => (
                            <option key={s.id} value={s.id} style={{ background: 'var(--background)', color: 'var(--text)' }}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>Période</label>
                        <select 
                            value={selectedPeriod} 
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            style={{ 
                                background: 'var(--glass)', 
                                border: '1px solid var(--glass-border)', 
                                borderRadius: '0.75rem', 
                                padding: '0.75rem', 
                                color: 'var(--text)',
                                outline: 'none',
                                width: '100%',
                                WebkitAppearance: 'none'
                            }}
                        >
                            <option value="" style={{ background: 'var(--background)', color: 'var(--text)' }}>Toutes</option>
                            {periods.map(p => (
                                <option key={p} value={p} style={{ background: 'var(--background)', color: 'var(--text)' }}>{p}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>Année Scolaire</label>
                        <div style={{ 
                            background: 'var(--glass)', 
                            border: '1px solid var(--glass-border)', 
                            borderRadius: '0.75rem', 
                            padding: '0.75rem', 
                            color: 'var(--text-muted)',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                        }}>
                            {currentAS || '---'}
                        </div>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Chargement des notes...
                </div>
            ) : Object.keys(notesBySubject).length === 0 ? (
                <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <BookOpen size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>Aucune note trouvée pour ces critères.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {Object.entries(notesBySubject).map(([subject, notes]) => (
                        <div key={subject} className="glass" style={{ marginBottom: '1rem' }}>
                            <div style={{ 
                                padding: '1rem', 
                                borderBottom: '1px solid var(--glass-border)', 
                                background: 'var(--glass)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                borderTopLeftRadius: '1.5rem',
                                borderTopRightRadius: '1.5rem'
                            }}>
                                <div style={{ 
                                    padding: '0.5rem', 
                                    borderRadius: '0.75rem', 
                                    background: 'rgba(249, 115, 22, 0.1)', 
                                    color: '#f97316' 
                                }}>
                                    <BookOpen size={18} />
                                </div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>{subject}</h3>
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
                                            borderBottom: idx === notes.length - 1 ? 'none' : '1px solid var(--glass-border)'
                                        }}
                                    >
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>{n.type}</span>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--glass)', padding: '0.1rem 0.4rem', borderRadius: '0.4rem', border: '1px solid var(--glass-border)' }}>{n.period}</span>
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {new Date(n.date).toLocaleDateString()}
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
                                                    {n.note}<span style={{ fontSize: '0.8rem', opacity: 0.6, color: 'var(--text-muted)' }}>/20</span>
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
