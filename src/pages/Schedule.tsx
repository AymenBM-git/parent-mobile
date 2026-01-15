import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, User } from 'lucide-react';
import { apiFetch } from '../lib/api';

const Schedule = () => {
    const { studentId } = useParams();
    const [schedules, setSchedules] = useState<any[]>([]);
    const [activeDay, setActiveDay] = useState(new Date().toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase());
    const [loading, setLoading] = useState(true);

    const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

    useEffect(() => {
        apiFetch(`/api/mobile/student/${studentId}/schedule`)
            .then(res => res.json())
            .then(data => {
                setSchedules(data);
                setLoading(false);
            });
    }, [studentId]);

    const dailySchedule = schedules.filter(s => s.day?.toLowerCase() === activeDay).sort((a, b) => a.start.localeCompare(b.start));

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Emploi du temps</h2>

            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
                {days.map(day => (
                    <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className="glass"
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '1rem',
                            border: activeDay === day ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                            background: activeDay === day ? 'rgba(99, 102, 241, 0.2)' : 'var(--glass)',
                            color: activeDay === day ? 'var(--primary)' : 'var(--text)',
                            whiteSpace: 'nowrap',
                            textTransform: 'capitalize',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {loading ? (
                <p>Chargement...</p>
            ) : dailySchedule.length === 0 ? (
                <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Pas de cours {activeDay}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {dailySchedule.map(item => (
                        <div key={item.id} className="glass" style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{
                                padding: '1rem',
                                background: 'rgba(99, 102, 241, 0.1)',
                                borderRadius: '1.5rem 0 0 1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minWidth: '5rem',
                                borderRight: '1px solid var(--glass-border)'
                            }}>
                                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{item.start}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.duration} min</span>
                            </div>
                            <div style={{ padding: '1rem', flex: 1 }}>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.subject?.name}</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                                        <MapPin size={14} /> <span>{item.room?.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                                        <User size={14} /> <span>{item.teacher?.name}</span>
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

export default Schedule;
