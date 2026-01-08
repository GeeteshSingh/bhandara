import { useState, useEffect } from 'react';
import { Layout } from './components/common/Layout';
import { MapComponent } from './components/map/MapComponent';
import { BhandaraList } from './components/bhandara/BhandaraList';
import { AddBhandaraForm } from './components/bhandara/AddBhandaraForm';
import { BhandaraDetails } from './components/bhandara/BhandaraDetails';
import type { BhandaraEvent } from './types';
import { BhandaraService } from './services/store';
import { AuthProvider, useAuth } from './context/AuthContext';

function BhandaraApp() {
  const [bhandaras, setBhandaras] = useState<BhandaraEvent[]>([]);
  const [isListOpen, setIsListOpen] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<BhandaraEvent | null>(null);
  const { user, signInWithGoogle, logout } = useAuth();

  const fetchBhandaras = async () => {
    const data = await BhandaraService.getBhandaras();
    setBhandaras(data);
  };

  useEffect(() => {
    fetchBhandaras();
  }, []);

  const handleAddClick = () => {
    if (user) {
      setIsAddModalOpen(true);
    } else {
      signInWithGoogle();
    }
  };

  return (
    <Layout>
      <div style={{ height: '100%', width: '100%', position: 'relative', display: 'flex' }}>

        {/* Auth Button - Absolute Top Right */}
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1100 }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user.photoURL && <img src={user.photoURL} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid white' }} />}
              <button
                onClick={logout}
                style={{ padding: '8px 12px', borderRadius: '20px', border: 'none', background: 'var(--color-surface)', color: 'var(--color-text-main)', cursor: 'pointer', boxShadow: 'var(--shadow-md)', fontWeight: 'bold' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: 'var(--color-primary)', color: 'white', cursor: 'pointer', boxShadow: 'var(--shadow-md)', fontWeight: 'bold' }}
            >
              Login to Add
            </button>
          )}
        </div>

        {/* List View (Sidebar) */}
        <BhandaraList
          events={bhandaras}
          isOpen={isListOpen}
          onClose={() => setIsListOpen(false)}
          onSelect={(event) => {
            setSelectedEvent(event);
            if (window.innerWidth < 768) setIsListOpen(false);
          }}
        />

        {/* List Toggle Button */}
        {!isListOpen && (
          <button
            onClick={() => setIsListOpen(true)}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              zIndex: 1000,
              padding: '10px 15px',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-main)',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-md)',
              fontWeight: 'bold'
            }}
          >
            📋 List
          </button>
        )}

        {/* Map Area */}
        <div style={{ flex: 1, position: 'relative' }}>
          <MapComponent
            bhandaras={bhandaras}
            onSelectEvent={setSelectedEvent}
          />
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddClick}
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            boxShadow: 'var(--shadow-lg)',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            cursor: 'pointer'
          }}
          aria-label="Add Bhandara"
          title={user ? "Add Bhandara" : "Login to Add"}
        >
          {user ? '+' : '🔒'}
        </button>

        {/* Modals & Panels */}
        {isAddModalOpen && (
          <AddBhandaraForm
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={fetchBhandaras}
          />
        )}

        {selectedEvent && (
          <BhandaraDetails
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BhandaraApp />
    </AuthProvider>
  );
}
