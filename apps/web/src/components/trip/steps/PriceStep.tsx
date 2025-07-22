import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Minus, Plus, DollarSign } from 'lucide-react';
import type { TripFormData } from '../CreateTripForm';

type PriceStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export default function PriceStep({ onNext, onBack }: PriceStepProps) {
  const { setValue, watch, formState: { errors } } = useFormContext<TripFormData>();
  const pricePerSeat = watch('price_per_seat');
  
  // Calculate suggested price range (this could be based on distance, etc.)
  const [suggestedMin, setSuggestedMin] = useState(5);
  const [suggestedMax, setSuggestedMax] = useState(15);
  
  // Format price for display
  const formattedPrice = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(pricePerSeat);
  
  // Handle price changes
  const decreasePrice = () => {
    if (pricePerSeat > 1) {
      setValue('price_per_seat', Math.round(pricePerSeat - 1), { shouldValidate: true });
    }
  };

  const increasePrice = () => {
    if (pricePerSeat < 100) {
      setValue('price_per_seat', Math.round(pricePerSeat + 1), { shouldValidate: true });
    }
  };
  
  // Check if price is within suggested range
  const isPriceOptimal = pricePerSeat >= suggestedMin && pricePerSeat <= suggestedMax;

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">
        Fija tu precio por asiento
      </h2>

      <div className="flex items-center justify-center w-full mb-8">
        <button
          type="button"
          onClick={decreasePrice}
          disabled={pricePerSeat <= 1}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Disminuir precio"
        >
          <Minus size={24} />
        </button>
        
        <div className="mx-8 text-center">
          <span className="text-7xl font-bold text-green-500 flex items-center justify-center">
            <span className="text-5xl mr-1">$</span>{pricePerSeat}
          </span>
        </div>
        
        <button
          type="button"
          onClick={increasePrice}
          disabled={pricePerSeat >= 100}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Aumentar precio"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Suggested price range */}
      <div className="w-full max-w-md mb-6">
        <div className="bg-green-100 text-green-800 rounded-md py-1 px-3 text-center text-sm">
          Precio sugerido: ${suggestedMin} - ${suggestedMax}
        </div>
        
        {isPriceOptimal ? (
          <p className="text-center text-sm text-green-600 mt-2">
            ¡Es el precio perfecto para este viaje! Conseguirás pasajeros en muy poco tiempo.
          </p>
        ) : pricePerSeat < suggestedMin ? (
          <p className="text-center text-sm text-amber-600 mt-2">
            Este precio es bajo para la ruta. Puedes aumentarlo y seguir consiguiendo pasajeros.
          </p>
        ) : (
          <p className="text-center text-sm text-amber-600 mt-2">
            Este precio es alto para la ruta. Podrías conseguir más pasajeros si lo reduces.
          </p>
        )}
      </div>

      <div className="w-full mt-8 space-y-3">
        <button
          type="button"
          onClick={onNext}
          disabled={!pricePerSeat || pricePerSeat < 1}
          className={`w-full py-3 px-4 ${pricePerSeat && pricePerSeat >= 1 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'} text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          Continuar
        </button>
        
        {errors.price_per_seat && (
          <p className="text-sm text-center text-red-600">{errors.price_per_seat.message}</p>
        )}
        
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Atrás
        </button>
      </div>
    </div>
  );
}
