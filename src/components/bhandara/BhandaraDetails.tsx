import React from 'react';
import type { BhandaraEvent } from '../../types';
import { VoteControl } from './VoteControl';
import { CommentSection } from '../common/CommentSection';

interface BhandaraDetailsProps {
    event: BhandaraEvent;
    onClose: () => void;
}

export const BhandaraDetails: React.FC<BhandaraDetailsProps> = ({ event, onClose }) => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '100%',
            maxWidth: '400px',
            backgroundColor: 'var(--color-surface)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1200,
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div style={{
                padding: 'var(--spacing-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <button onClick={onClose} style={{ background: 'none', color: 'var(--color-primary)', fontSize: '1rem', fontWeight: 'bold' }}>
                    ← Back
                </button>
                <div style={{ display: 'flex', gap: '5px' }}>
                    {/* Share button could go here */}
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-md)' }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '5px', color: 'var(--color-primary)' }}>{event.title}</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '15px' }}>{event.address}, {event.city}</p>

                <div style={{ padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                    <p style={{ fontSize: '1rem', lineHeight: '1.5' }}>{event.description}</p>
                    <div style={{ marginTop: '15px' }}>
                        <VoteControl
                            bhandaraId={event.id}
                            verifiedCount={event.verifiedCount}
                            notThereCount={event.notThereCount}
                        />
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                    <CommentSection bhandaraId={event.id} />
                </div>
            </div>
        </div>
    );
};
