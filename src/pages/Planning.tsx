import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { apiFetch } from '../lib/api';

const Planning = () => {
    const { studentId } = useParams();
    const [planings, setPlanings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    useEffect(() => {
        apiFetch(`/api/mobile/student/${studentId}/planning`)
            .then(res => res.json())
            .then(data => {
                setPlanings(data);
                setLoading(false);
            });
    }, [studentId]);

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Planning annuel</h2>

            {loading ? (
                <p>Chargement...</p>
            ) : planings.length === 0 ? (
                <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Aucun planning disponible.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {planings.map(planing => (
                        <div key={planing.id} className="glass" style={{ overflow: 'hidden' }}>
                            <div
                                onClick={() => setExpandedId(expandedId === planing.id ? null : planing.id)}
                                style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <div>
                                    <h4 style={{ fontSize: '1.1rem' }}>{planing.name}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{planing.teacher?.subject?.name} • {planing.type}</p>
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
