import { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import type { TripFormData } from '../CreateTripForm';

type OriginStepProps = {
  onNext: () => void;
};

export default function OriginStep({ onNext }: OriginStepProps) {
  const { register, setValue, watch, formState: { errors } } = useFormContext<TripFormData>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const origin = watch('origin');
  
  // Mock location suggestions - in a real app, these would come from a geocoding API
  const locationSuggestions = [
    { id: 1, name: 'Caracas, Distrito Capital' },
    { id: 2, name: 'Maracaibo, Zulia' },
    { id: 3, name: 'Valencia, Carabobo' },
    { id: 4, name: 'Barquisimeto, Lara' },
    { id: 5, name: 'Maracay, Aragua' },
    { id: 6, name: 'Aeropuerto Internacional Simón Bolívar, Vargas' },
  ];

  const handleSelectLocation = (location: string) => {
    setValue('origin', location);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">¿Desde qué ciudad sales?</h2>
        <p className="mt-1 text-sm text-gray-500">
          Selecciona la ciudad de origen de tu viaje
        </p>
      </div>

      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
 placeholder="Busca una ciudad"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => {
              // Small delay to allow clicking on suggestions
              setTimeout(() => setIsDropdownOpen(false), 200);
            }}
          />
        </div>

        {/* Location suggestions */}
        {isDropdownOpen && (
          <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {locationSuggestions
                .filter(loc => 
                  loc.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((location) => (
                  <li key={location.id}>
                    <button
                      type="button"
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center"
                      onClick={() => handleSelectLocation(location.name)}
                    >
                      <svg className="h-5 w-5 text-gray-400 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>{location.name}</span>
                      <span className="ml-auto">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      <input type="hidden" {...register('origin')} />
      {errors.origin && (
        <p className="mt-1 text-sm text-red-600">{errors.origin.message}</p>
      )}
      
      <div className="mt-6">
        <button
          type="button"
          onClick={onNext}
          disabled={!origin}
          className={`w-full py-3 px-4 ${origin ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'} text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          Continuar
        </button>
        {!origin && (
          <p className="mt-2 text-sm text-center text-amber-600">Selecciona una ciudad de origen para continuar</p>
        )}
      </div>
    </div>
  );
}
