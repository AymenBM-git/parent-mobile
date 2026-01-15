import { useEffect, useState } from 'react';
import { Bell, Calendar, Info } from 'lucide-react';
import { apiFetch } from '../lib/api';

const Events = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const parent = JSON.parse(localStorage.getItem('parent') || '{}');

    useEffect(() => {
        Promise.all([
            apiFetch(`/api/mobile/events`).then(res => res.json()),
            apiFetch(`/api/mobile/parent/notifications?parentId=${parent.id}`).then(res => res.json())
        ]).then(([eventsData, notifsData]) => {
            if (Array.isArray(eventsData)) {
                setEvents(eventsData);
            } else {
                console.error("Events data is not an array:", eventsData);
                setEvents([]);
            }

            if (Array.isArray(notifsData)) {
                setNotifications(notifsData);
            } else {
                console.error("Notifications data is not an array:", notifsData);
                setNotifications([]);
            }
            setLoading(false);
        }).catch(err => {
            console.error("Failed to fetch events or notifications:", err);
            setLoading(false);
        });
    }, [parent.id]);

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Événements & Alertes</h2>

            <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={20} className="color-primary" /> Événements à venir
                </h3>
                {loading ? (
                    <p>Chargement...</p>
                ) : events.length === 0 ? (
                    <div className="glass" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Aucun événement prévu.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {events.map(event => (
                            <div key={event.id} className="glass" style={{ padding: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <h4 style={{ fontSize: '1.1rem' }}>{event.name}</h4>
                                    <span className="badge badge-event">{new Date(event.dateEvent).toLocaleDateString()}</span>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{event.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Bell size={20} className="color-secondary" /> Toutes vos notifications
                </h3>
                {loading ? (
                    <p>Chargement...</p>
                ) : notifications.length === 0 ? (
                    <div className="glass" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Aucune notification.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {notifications.map(notif => (
                            <div key={notif.id} className="glass" style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
                                <div style={{
                                    padding: '0.5rem',
                                    borderRadius: '0.75rem',
                                    background: notif.type === 'absence' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                    color: notif.type === 'absence' ? 'var(--accent)' : 'var(--primary)'
                                }}>
                                    <Info size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <h4 style={{ fontSize: '0.9rem' }}>{notif.title}</h4>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(notif.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{notif.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Events;
