import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, FileText, ChevronDown, ChevronUp, BookOpen, ChevronLeft } from 'lucide-react';
import { apiFetch } from '../lib/api';

const Planning = () => {
    const { studentId } = useParams();
    const [planings, setPlanings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    useEffect(() => {
        apiFetch(`/api/mobile/student/${studentId}/planning`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPlanings(data);
                }
                setLoading(false);
            });
    }, [studentId]);

    const subjects = Array.from(new Set(planings.map(p => p.teacher?.subject?.name).filter(Boolean)));
    const filteredPlanings = selectedSubject
        ? planings.filter(p => p.teacher?.subject?.name === selectedSubject)
        : [];

    if (loading) return <p>Chargement...</p>;

    if (!selectedSubject) {
        return (
            <div>
                <h2 style={{ marginBottom: '1.5rem' }}>Planning annuel</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Sélectionnez une matière pour voir le planning :</p>

                {subjects.length === 0 ? (
                    <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Aucune matière disponible.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        {subjects.map((subject: any) => (
                            <div
                                key={subject}
                                onClick={() => setSelectedSubject(subject)}
                                className="glass"
                                style={{
                                    padding: '1.5rem 1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }}
                            >
                                <div style={{ color: 'var(--primary)' }}>
                                    <BookOpen size={32} />
                                </div>
                                <span style={{ fontSize: '1rem', fontWeight: 600 }}>{subject}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => setSelectedSubject(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--text)', padding: '0.5rem', marginLeft: '-0.5rem' }}
                >
                    <ChevronLeft size={24} />
                </button>
                <h2 style={{ margin: 0 }}>{selectedSubject}</h2>
            </div>

            {filteredPlanings.length === 0 ? (
                <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Aucun planning disponible pour cette matière.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredPlanings.map(planing => (
                        <div key={planing.id} className="glass" style={{ overflow: 'hidden' }}>
                            <div
                                onClick={() => setExpandedId(expandedId === planing.id ? null : planing.id)}
                                style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <div>
                                    <h4 style={{ fontSize: '1.1rem' }}>{planing.name}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{planing.type}</p>
                                </div>
                                {expandedId === planing.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>

                            {expandedId === planing.id && (
                                <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{planing.description}</p>

                                    <h5 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>Ressources disponibles :</h5>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {planing.ressouces && planing.ressouces.length > 0 ? (
                                            planing.ressouces.map((res: any) => (
                                                <div key={res.id} className="glass" style={{ padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <FileText size={18} className="color-primary" />
                                                        <span style={{ fontSize: '0.875rem' }}>{res.name}</span>
                                                    </div>
                                                    <button style={{ background: 'none', border: 'none', color: 'var(--primary)' }}>
                                                        <Download size={18} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Aucune ressource pour votre classe.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Planning;
