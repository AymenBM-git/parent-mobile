import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bell, BookOpen, AlertCircle, Calendar, CreditCard, ClipboardList } from 'lucide-react';
import { apiFetch } from '../lib/api';

const Home = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [student, setStudent] = useState<any>(null);
    const parent = JSON.parse(localStorage.getItem('parent') || '{}');

    useEffect(() => {
        // Fetch notifications
        apiFetch(`/api/mobile/parent/notifications?parentId=${parent.id}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setNotifications(data);
                } else {
                    console.error("Notifications data is not an array:", data);
                    setNotifications([]);
                }
            })
            .catch(err => {
                console.error("Failed to fetch notifications:", err);
                setNotifications([]);
            });

        // Fetch student info
        apiFetch(`/api/mobile/parent/children?parentId=${parent.id}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const current = data.find((s: any) => s.id === Number(studentId));
                    setStudent(current);
                }
            });
    }, [studentId, parent.id]);

    const quickLinks = [
        { icon: Calendar, label: 'Emploi', path: `/schedule/${studentId}`, color: '#6366f1' },
        { icon: BookOpen, label: 'TAF/Devoirs', path: `/tafs/${studentId}`, color: '#a855f7' },
        { icon: AlertCircle, label: 'Absences', path: `/absences/${studentId}`, color: '#f43f5e' },
        { icon: ClipboardList, label: 'Planning', path: `/planning/${studentId}`, color: '#22c55e' },
        { icon: CreditCard, label: 'Paiements', path: `/payments/${studentId}`, color: '#eab308' },
    ];

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    background: 'var(--glass)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {student?.photo ? (
                        <img src={student.photo} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{student?.firstName?.charAt(0)}</span>
                    )}
                </div>
                <div>
                    <h2 style={{ fontSize: '1.25rem' }}>{student?.firstName} {student?.lastName}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{student?.classe?.name}</p>
                </div>
            </div>

            <section style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>Actions rapides</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    {quickLinks.map((link) => (
                        <div
                            key={link.label}
                            onClick={() => navigate(link.path)}
                            className="glass"
                            style={{
                                padding: '1rem 0.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                textAlign: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{ color: link.color }}>
                                <link.icon size={24} />
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{link.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>Notifications récentes</h3>
                    <button onClick={() => navigate('/events')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600 }}>Voir tout</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {notifications.slice(0, 3).map((notif) => (
                        <div key={notif.id} className="glass" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div className={`badge badge-${notif.type}`} style={{ padding: '0.5rem', borderRadius: '0.75rem' }}>
                                {notif.type === 'absence' && <AlertCircle size={18} />}
                                {notif.type === 'taf' && <BookOpen size={18} />}
                                {notif.type === 'event' && <Bell size={18} />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <h4 style={{ fontSize: '0.9rem' }}>{notif.title}</h4>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(notif.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{notif.message}</p>
                            </div>
                        </div>
                    ))}
                    {notifications.length === 0 && (
                        <div className="glass" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Aucune notification récente
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
