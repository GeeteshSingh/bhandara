import React, { useState, useEffect } from 'react';
import type { Comment } from '../../types';

interface CommentSectionProps {
    bhandaraId: string;
}

// Mock comments for now since we don't have a backend returning them yet
const MOCK_COMMENTS: Comment[] = [
    { id: 'c1', bhandaraId: '1', userId: 'u1', userName: 'Rohan', text: 'Food is delicious!', timestamp: Date.now() - 3600000 },
    { id: 'c2', bhandaraId: '1', userId: 'u2', userName: 'Amit', text: 'Crowd is increasing.', timestamp: Date.now() - 1800000 }
];

export const CommentSection: React.FC<CommentSectionProps> = ({ bhandaraId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        // Stimulate fetching
        setComments(MOCK_COMMENTS.filter(c => c.bhandaraId === '1')); // Just showing mock data for demo
    }, [bhandaraId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: Date.now().toString(),
            bhandaraId,
            userId: 'me',
            userName: 'You',
            text: newComment,
            timestamp: Date.now()
        };

        setComments(prev => [comment, ...prev]);
        setNewComment('');
    };

    return (
        <div style={{ marginTop: 'var(--spacing-md)' }}>
            <h4 style={{ marginBottom: '10px', color: 'var(--color-text-muted)' }}>Comments</h4>

            <form onSubmit={handleSubmit} style={{ marginBottom: '15px', display: 'flex', gap: '5px' }}>
                <input
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid #333',
                        background: '#222',
                        color: 'white'
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '8px 12px',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 'bold'
                    }}
                >
                    Post
                </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {comments.map(comment => (
                    <div key={comment.id} style={{
                        padding: '8px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: 'var(--radius-sm)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{comment.userName}</span>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                                {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#ddd' }}>{comment.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
