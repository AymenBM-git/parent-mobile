import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, CheckCircle } from 'lucide-react';
import { apiFetch } from '../lib/api';

const Payments = () => {
    const { studentId } = useParams();
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch(`/api/mobile/student/${studentId}/payments`)
            .then(res => res.json())
            .then(data => {
                setPayments(data);
                setLoading(false);
            });
    }, [studentId]);

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Paiements</h2>

            {loading ? (
                <p>Chargement...</p>
            ) : payments.length === 0 ? (
                <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Aucun historique de paiement.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {payments.map(payment => (
                        <div key={payment.id} className="glass" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{
                                    width: '3rem',
                                    height: '3rem',
                                    borderRadius: '1rem',
                                    background: 'rgba(34, 197, 94, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#22c55e'
                                }}>
                                    <CheckCircle size={24} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1rem' }}>{payment.as}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        <Calendar size={14} /> <span>{new Date(payment.paymentDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>{payment.amount} TND</span>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{payment.type}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Payments;
