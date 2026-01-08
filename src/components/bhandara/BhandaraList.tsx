import React from 'react';
import type { BhandaraEvent } from '../../types';
import { VoteControl } from './VoteControl';

interface BhandaraListProps {
    events: BhandaraEvent[];
    onSelect: (event: BhandaraEvent) => void;
    isOpen: boolean;
    onClose: () => void;
}

export const BhandaraList: React.FC<BhandaraListProps> = ({ events, onSelect, isOpen, onClose }) => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '100%',
            maxWidth: '350px',
            backgroundColor: 'var(--color-surface)',
            boxShadow: 'var(--shadow-lg)',
            transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform var(--transition-normal)',
            zIndex: 1100,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{
                padding: 'var(--spacing-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>Nearby Bhandaras</h2>
                <button onClick={onClose} style={{ background: 'none', color: 'var(--color-text-muted)', fontSize: '1.5rem' }}>&times;</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-md)' }}>
                {events.map(event => (
                    <div
                        key={event.id}
                        onClick={() => onSelect(event)}
                        style={{
                            padding: 'var(--spacing-md)',
                            marginBottom: 'var(--spacing-md)',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            transition: 'background var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                    >
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{event.title}</h3>
                        <p style={{ margin: '0 0 10px 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{event.address}</p>

                        <VoteControl
                            bhandaraId={event.id}
                            verifiedCount={event.verifiedCount}
                            notThereCount={event.notThereCount}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
