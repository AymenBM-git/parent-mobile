import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Users, Globe } from 'lucide-react';
import { apiFetch } from '../lib/api';

const Chat = () => {
    const { studentId } = useParams();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'classe' | 'general'>('classe');
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const parent = JSON.parse(localStorage.getItem('parent') || '{}');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        // Fetch student info to get classId
        apiFetch(`/api/mobile/parent/children?parentId=${parent.id}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const current = data.find((s: any) => s.id === Number(studentId));
                    setStudent(current);
                }
            });
    }, [studentId, parent.id]);

    const fetchMessages = async () => {
        if (!student) return;
        setLoading(true);
        try {
            const classIdParam = activeTab === 'classe' ? `&classId=${student.classId}` : '';
            const res = await apiFetch(`/api/mobile/chat?studentId=${studentId}${classIdParam}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setMessages(data);
            }
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        } finally {
            setLoading(false);
            setTimeout(scrollToBottom, 100);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [student, activeTab]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !student) return;

        const messageToSend = newMessage;
        setNewMessage('');

        try {
            const res = await apiFetch('/api/mobile/chat', {
                method: 'POST',
                body: JSON.stringify({
                    studentId: Number(studentId),
                    sendTo: activeTab === 'classe' ? student.classId : null,
                    message: messageToSend
                })
            });
            const data = await res.json();
            setMessages(prev => [...prev, data]);
            setTimeout(scrollToBottom, 50);
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', gap: '1rem' }}>
            <div className="glass" style={{ display: 'flex', padding: '0.5rem', borderRadius: '1.5rem', gap: '0.5rem' }}>
                <button
                    onClick={() => setActiveTab('classe')}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '1rem',
                        border: 'none',
                        background: activeTab === 'classe' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'classe' ? 'white' : 'var(--text)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        transition: 'all 0.3s'
                    }}
                >
                    <Users size={18} />
                    Ma Classe
                </button>
                <button
                    onClick={() => setActiveTab('general')}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '1rem',
                        border: 'none',
                        background: activeTab === 'general' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'general' ? 'white' : 'var(--text)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        transition: 'all 0.3s'
                    }}
                >
                    <Globe size={18} />
                    Général
                </button>
            </div>

            <div className="glass" style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderRadius: '1.5rem' }}>
                {messages.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                        Aucun message pour le moment.
                    </div>
                )}
                {messages.map((msg) => {
                    const isMe = msg.studentId === Number(studentId);
                    return (
                        <div key={msg.id} style={{
                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem'
                        }}>
                            {!isMe && (
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                                    {msg.student ? `${msg.student.firstName} ${msg.student.lastName}` : "Administration"}
                                </span>
                            )}
                            <div style={{
                                padding: '0.75rem 1rem',
                                borderRadius: isMe ? '1.25rem 1.25rem 0 1.25rem' : '1.25rem 1.25rem 1.25rem 0',
                                background: isMe ? 'var(--primary)' : 'var(--glass)',
                                color: isMe ? 'white' : 'var(--text)',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                wordBreak: 'break-word'
                            }}>
                                {msg.message}
                            </div>
                            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', alignSelf: isMe ? 'flex-end' : 'flex-start' }}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    className="glass"
                    style={{
                        flex: 1,
                        padding: '1rem',
                        border: 'none',
                        borderRadius: '1.5rem',
                        outline: 'none',
                        color: 'var(--text)'
                    }}
                />
                <button
                    type="submit"
                    className="glass"
                    style={{
                        width: '3.5rem',
                        height: '3.5rem',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'var(--primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default Chat;
