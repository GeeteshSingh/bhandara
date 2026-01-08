import React, { useState } from 'react';
import { BhandaraService } from '../../services/store';

interface VoteControlProps {
    bhandaraId: string;
    verifiedCount: number;
    notThereCount: number;
    compact?: boolean;
}

export const VoteControl: React.FC<VoteControlProps> = ({ bhandaraId, verifiedCount, notThereCount, compact }) => {
    const [votes, setVotes] = useState({ verified: verifiedCount, notThere: notThereCount });
    const [userVote, setUserVote] = useState<'verified' | 'notThere' | null>(null);

    const handleVerify = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (userVote === 'verified') return; // Prevent double vote

        // Optimistic update
        setVotes(prev => ({ ...prev, verified: prev.verified + 1 }));
        setUserVote('verified');

        await BhandaraService.verifyBhandara(bhandaraId);
    };

    const handleReport = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (userVote === 'notThere') return;

        setVotes(prev => ({ ...prev, notThere: prev.notThere + 1 }));
        setUserVote('notThere');

        await BhandaraService.reportBhandara(bhandaraId);
    };

    return (
        <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
            <button
                onClick={handleVerify}
                disabled={userVote !== null}
                style={{
                    backgroundColor: userVote === 'verified' ? 'var(--color-success)' : 'rgba(0,255,0,0.1)',
                    color: userVote === 'verified' ? 'white' : 'var(--color-success)',
                    border: '1px solid var(--color-success)',
                    borderRadius: 'var(--radius-sm)',
                    padding: compact ? '2px 6px' : '4px 8px',
                    fontSize: '0.8rem',
                    cursor: userVote === null ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}
            >
                ✅ {votes.verified} {compact ? '' : 'Confirm'}
            </button>

            <button
                onClick={handleReport}
                disabled={userVote !== null}
                style={{
                    backgroundColor: userVote === 'notThere' ? 'var(--color-danger)' : 'rgba(255,0,0,0.1)',
                    color: userVote === 'notThere' ? 'white' : 'var(--color-danger)',
                    border: '1px solid var(--color-danger)',
                    borderRadius: 'var(--radius-sm)',
                    padding: compact ? '2px 6px' : '4px 8px',
                    fontSize: '0.8rem',
                    cursor: userVote === null ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}
            >
                ❌ {votes.notThere} {compact ? '' : 'Fake/Gone'}
            </button>
        </div>
    );
};
