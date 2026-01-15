import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { apiFetch } from '../lib/api';

const Tafs = () => {
    const { studentId } = useParams();
    const [tafs, setTafs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch(`/api/mobile/student/${studentId}/tafs`)
            .then(res => res.json())
            .then(data => {
                setTafs(data);
                setLoading(false);
            });
    }, [studentId]);

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>TAF / Devoirs</h2>

            {loading ? (
                <p>Chargement...</p>
            ) : tafs.length === 0 ? (
                <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Aucun devoir assigné.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {tafs.map(taf => (
                        <div key={taf.id} className="glass" style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <span className="badge badge-taf" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{taf.type}</span>
                                    <h4 style={{ fontSize: '1.1rem' }}>{taf.subject?.name}</h4>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                        <Calendar size={14} /> <span>{new Date(taf.dateTaf).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{taf.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tafs;
