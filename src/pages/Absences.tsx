import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { apiFetch } from '../lib/api';

const Absences = () => {
    const { studentId } = useParams();
    const [absences, setAbsences] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch(`/api/mobile/student/${studentId}/absences`)
            .then(res => res.json())
            .then(data => {
                setAbsences(data);
                setLoading(false);
            });
    }, [studentId]);

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Absences</h2>

            {loading ? (
                <p>Chargement...</p>
            ) : absences.length === 0 ? (
                <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Aucune absence enregistrée. 🎉
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {absences.map(absence => (
                        <div key={absence.id} className="glass" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '3rem',
                                height: '3rem',
                                borderRadius: '1rem',
                                background: 'rgba(244, 63, 94, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--accent)'
                            }}>
                                <AlertCircle size={24} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '1rem' }}>Absent(e)</h4>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        <Calendar size={14} /> <span>{new Date(absence.dateAbsence).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        <Clock size={14} /> <span>{absence.hour}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Absences;
