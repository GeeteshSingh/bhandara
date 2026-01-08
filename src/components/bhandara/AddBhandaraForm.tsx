import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { BhandaraService } from '../../services/store';
import { AddressAutocomplete } from '../common/AddressAutocomplete';

// Sub-component for map click handling
const LocationMarker = ({ position, setPosition }: { position: { lat: number, lng: number } | null, setPosition: (lat: number, lng: number) => void }) => {
    useMapEvents({
        click(e) {
            setPosition(e.latlng.lat, e.latlng.lng);
        },
    });

    return position ? <Marker position={[position.lat, position.lng]} /> : null;
};

interface AddBhandaraFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const AddBhandaraForm: React.FC<AddBhandaraFormProps> = ({ onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        address: '',
        lat: 0,
        lng: 0,
        city: 'Ujjain' as 'Ujjain' | 'Indore',
        type: 'bhandara' as const
    });

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                // Reverse geocoding
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();

                setFormData(prev => ({
                    ...prev,
                    lat: latitude,
                    lng: longitude,
                    address: data.display_name || `${latitude}, ${longitude}`
                }));
            } catch (error) {
                console.error("Error fetching address:", error);
                // Still set coords even if address fails
                setFormData(prev => ({
                    ...prev,
                    lat: latitude,
                    lng: longitude,
                    address: `${latitude}, ${longitude}`
                }));
            } finally {
                setLoading(false);
            }
        }, (error) => {
            console.error("Error getting location:", error);
            setLoading(false);
            alert('Unable to retrieve your location');
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // For MVP, we mock the logic of getting lat/lng from address or map click
            // Ideally this would come from a map pin selector props
            await BhandaraService.addBhandara({
                ...formData,
                lat: formData.lat || 23.17, // Fallback if 0
                lng: formData.lng || 75.78, // Fallback if 0
                createdBy: 'user_123',
                status: 'active'
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to add", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: 'var(--spacing-md)'
        }}>
            <div style={{
                backgroundColor: 'var(--color-surface)',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--radius-lg)',
                width: '100%',
                maxWidth: '500px',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'none',
                        color: 'var(--color-text-muted)',
                        fontSize: '1.5rem',
                        cursor: 'pointer'
                    }}
                >
                    &times;
                </button>

                <h2 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--color-primary)' }}>Add New Bhandara</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', color: 'var(--color-text-muted)' }}>Title</label>
                        <input
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid #333', background: '#222', color: 'white' }}
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', color: 'var(--color-text-muted)' }}>Description</label>
                        <textarea
                            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid #333', background: '#222', color: 'white', minHeight: '80px' }}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', color: 'var(--color-text-muted)' }}>City</label>
                        <select
                            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid #333', background: '#222', color: 'white' }}
                            value={formData.city}
                            onChange={e => setFormData({ ...formData, city: e.target.value as any })}
                        >
                            <option value="Ujjain">Ujjain</option>
                            <option value="Indore">Indore</option>
                        </select>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                            <label style={{ color: 'var(--color-text-muted)' }}>Address / Landmark</label>
                            <button
                                type="button"
                                onClick={handleUseCurrentLocation}
                                style={{
                                    fontSize: '12px',
                                    color: 'var(--color-primary)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                📍 Use my location
                            </button>
                        </div>
                        <AddressAutocomplete
                            defaultValue={formData.address}
                            onSelect={(address, lat, lon) => {
                                setFormData({
                                    ...formData,
                                    address: address,
                                    lat: lat,
                                    lng: lon
                                });
                            }}
                        />
                    </div>

                    <div style={{ height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid #444' }}>
                        <MapContainer
                            center={[formData.lat || 23.17, formData.lng || 75.78]}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                            />
                            <LocationMarker
                                position={formData.lat ? { lat: formData.lat, lng: formData.lng } : null}
                                setPosition={(lat, lng) => setFormData(prev => ({ ...prev, lat, lng }))}
                            />
                        </MapContainer>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '10px',
                            padding: '12px',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 'bold',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Adding...' : 'Post Bhandara'}
                    </button>
                </form>
            </div>
        </div>
    );
};
