import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-bg)' }}>
            {/* Header */}
            <header style={{
                height: '60px',
                padding: '0 var(--spacing-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--color-surface)',
                backgroundColor: 'var(--color-bg)',
                zIndex: 1000
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                        🥘 Bhandara Finder
                    </h1>
                </div>
            </header>

            {/* Content Area */}
            <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                {children}
            </main>
        </div>
    );
};
