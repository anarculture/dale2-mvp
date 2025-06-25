import React, { useState, useEffect, useRef } from 'react';

const venezuelanCities = [
  'Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay', 'Ciudad Guayana', 
  'Barcelona', 'Maturín', 'Cumaná', 'Petare', 'Turmero', 'Mérida', 'Ciudad Bolívar', 
  'Barinas', 'Los Teques', 'Punto Fijo', 'La Guaira', 'Santa Teresa del Tuy', 
  'El Vigía', 'San Cristóbal', 'San Felipe del Rey', 'Puerto la Cruz', 'Cabimas', 
  'Guatire', 'San Diego', 'Porlamar', 'Cúa', 'Guarenas', 'San Fernando de Apure', 
  'Tucupita', 'Los Guayos', 'Upata', 'Ocumare del Tuy', 'Puerto Cabello', 'Guacara', 
  'El Tigre', 'Machiques', 'El Limón', 'Naguanagua'
];

interface CityAutocompleteInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const CityAutocompleteInput: React.FC<CityAutocompleteInputProps> = ({ placeholder, value, onChange }) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentInputValue = event.target.value;
    setInputValue(currentInputValue);
    onChange(currentInputValue); // Propagate change to parent

    if (currentInputValue.length > 0) {
      const filteredSuggestions = venezuelanCities.filter(city =>
        city.toLowerCase().includes(currentInputValue.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange(suggestion); // Propagate change to parent
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle clicks outside the autocomplete input to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex-1" ref={inputRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => inputValue.length > 0 && suggestions.length > 0 && setShowSuggestions(true)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityAutocompleteInput;
