import { useState, useEffect, useRef } from 'react';
import { venezuelanCities } from '../data/cities';

interface AutocompleteInputProps {
  value: string;
  onValueChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ value, onValueChange, id, placeholder, className, required }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onValueChange(inputValue);

    if (inputValue.length > 0) {
      const filteredSuggestions = venezuelanCities.filter(city =>
        city.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      // Show all cities when input is empty
      setSuggestions(venezuelanCities);
    }
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onValueChange(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        type="text"
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={className || 'w-full p-3 border border-gray-300 rounded-md text-gray-800'}
        onFocus={() => {
          // Show all cities when input is focused
          setSuggestions(venezuelanCities);
          setShowSuggestions(true);
        }}
        required={required}
      />
      {showSuggestions && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-3 cursor-pointer hover:bg-gray-100 text-gray-800"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
