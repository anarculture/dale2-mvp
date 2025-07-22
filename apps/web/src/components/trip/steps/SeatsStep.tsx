import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Minus, Plus, Users } from 'lucide-react';
import type { TripFormData } from '../CreateTripForm';

type SeatsStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export default function SeatsStep({ onNext, onBack }: SeatsStepProps) {
  const { setValue, watch, formState: { errors } } = useFormContext<TripFormData>();
  const availableSeats = watch('available_seats');
  
  // Handle seat count changes
  const decreaseSeats = () => {
    if (availableSeats > 1) {
      setValue('available_seats', availableSeats - 1, { shouldValidate: true });
    }
  };

  const increaseSeats = () => {
    if (availableSeats < 8) {
      setValue('available_seats', availableSeats + 1, { shouldValidate: true });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">
        ¿Cuántos pasajeros de Dale podrás llevar contigo?
      </h2>

      <div className="flex items-center justify-center w-full mb-12">
        <button
          type="button"
          onClick={decreaseSeats}
          disabled={availableSeats <= 1}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Disminuir número de asientos"
        >
          <Minus size={24} />
        </button>
        
        <div className="mx-8 text-center">
          <span className="text-7xl font-bold block">{availableSeats}</span>
        </div>
        
        <button
          type="button"
          onClick={increaseSeats}
          disabled={availableSeats >= 8}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Aumentar número de asientos"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Passenger options */}
      <div className="w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Opciones de pasajeros</h3>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <label className="flex items-start">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              onChange={(e) => {
                // This could be used to set a preference in the form data
                // For now it's just visual
              }}
            />
            <div className="ml-3">
              <span className="block font-medium">
                Máx. {Math.max(1, availableSeats - 1)} atrás
              </span>
              <span className="text-sm text-gray-500">
                Piensa en la comodidad: deja libre el asiento de en medio
              </span>
            </div>
            <div className="ml-auto">
              <Users size={24} className="text-gray-400" />
            </div>
          </label>
        </div>
      </div>

      <div className="w-full mt-8 space-y-3">
        <button
          type="button"
          onClick={onNext}
          disabled={!availableSeats || availableSeats < 1}
          className={`w-full py-3 px-4 ${availableSeats && availableSeats >= 1 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'} text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          Continuar
        </button>
        
        {errors.available_seats && (
          <p className="text-sm text-center text-red-600">{errors.available_seats.message}</p>
        )}
        
        <button
          type="button"
          onClick={onBack}
          className="w-full mt-3 py-3 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Atrás
        </button>
      </div>
    </div>
  );
}
