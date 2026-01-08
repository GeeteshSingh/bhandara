import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { BhandaraEvent } from '../../types';

import { VoteControl } from '../bhandara/VoteControl';

// Fix for default marker icon in Vite/Webpack
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
    bhandaras?: BhandaraEvent[]; // Pass bhandaras from parent instead of fetching internally
    onLocationSelect?: (lat: number, lng: number) => void;
    onSelectEvent?: (event: BhandaraEvent) => void;
}

const UJJAIN_COORDS: [number, number] = [23.1765, 75.7885];

function LocationMarker() {
    const [position, setPosition] = useState<L.LatLng | null>(null);
    const map = useMap();

    useEffect(() => {
        map.locate().on("locationfound", function (e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        });
    }, [map]);

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    );
}

export const MapComponent: React.FC<MapProps> = ({ bhandaras = [], onSelectEvent }) => {
    // bhandaras are now passed as props for better state management

    return (
        <div style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <MapContainer center={UJJAIN_COORDS} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Current Location */}
                <LocationMarker />

                {/* Bhandara Locations */}
                {bhandaras.map(event => (
                    <Marker key={event.id} position={[event.lat, event.lng]}>
                        <Popup>
                            <div style={{ minWidth: '150px' }}>
                                <h3 style={{ margin: '0 0 5px 0', color: 'var(--color-primary)' }}>{event.title}</h3>
                                <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}>{event.description}</p>
                                <VoteControl
                                    bhandaraId={event.id}
                                    verifiedCount={event.verifiedCount}
                                    notThereCount={event.notThereCount}
                                    compact={true}
                                />
                                <button
                                    onClick={() => onSelectEvent?.(event)}
                                    style={{
                                        marginTop: '10px',
                                        width: '100%',
                                        padding: '5px',
                                        backgroundColor: 'var(--color-surface)',
                                        color: 'var(--color-primary)',
                                        border: '1px solid var(--color-primary)',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    View Details & Comments
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};
