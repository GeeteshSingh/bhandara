import { useState, useEffect, useRef } from 'react';

interface AddressSuggestion {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

interface AddressAutocompleteProps {
  onSelect: (address: string, lat: number, lon: number) => void;
  defaultValue?: string;
}

export const AddressAutocomplete = ({ onSelect, defaultValue = '' }: AddressAutocompleteProps) => {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  const fetchSuggestions = async (searchText: string) => {
    if (!searchText || searchText.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      // Nominatim requires a User-Agent
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&limit=5&addressdetails=1`,
        {
            headers: {
                "Accept-Language": "en-US,en;q=0.5" 
            }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce
    if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
        fetchSuggestions(value);
    }, 500);
  };

  const handleSelect = (suggestion: AddressSuggestion) => {
    setQuery(suggestion.display_name);
    setSuggestions([]);
    onSelect(suggestion.display_name, parseFloat(suggestion.lat), parseFloat(suggestion.lon));
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for an address..."
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid #333',
          background: '#222',
          color: 'white'
        }}
      />
      {loading && (
        <div style={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            color: '#aaa',
            fontSize: '12px'
        }}>
            Loading...
        </div>
      )}
      
      {suggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#2a2a2a',
          border: '1px solid #444',
          borderRadius: '0 0 var(--radius-sm) var(--radius-sm)',
          maxHeight: '200px',
          overflowY: 'auto',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}>
          {suggestions.map((item) => (
            <li
              key={item.place_id}
              onClick={() => handleSelect(item)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                borderBottom: '1px solid #333',
                fontSize: '14px',
                color: '#ddd'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a3a3a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
