import { useFormContext } from 'react-hook-form';
import type { TripFormData } from '../CreateTripForm';

type DetailsStepProps = {
  onBack: () => void;
};

export default function DetailsStep({ onBack }: DetailsStepProps) {
  const { register, formState: { errors } } = useFormContext<TripFormData>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Detalles del viaje</h2>
        <p className="mt-1 text-sm text-gray-500">
          Completa la información sobre asientos, precio y otros detalles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available seats */}
        <div>
          <label htmlFor="available-seats" className="block text-sm font-medium text-gray-700 mb-1">
            Asientos disponibles
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              id="available-seats"
              min="1"
              max="10"
              {...register('available_seats', { 
                valueAsNumber: true,
                required: 'Debes indicar cuántos asientos ofreces'
              })}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="1"
            />
          </div>
          {errors.available_seats && (
            <p className="mt-1 text-sm text-red-600">{errors.available_seats.message}</p>
          )}
        </div>

        {/* Price per seat */}
        <div>
          <label htmlFor="price-per-seat" className="block text-sm font-medium text-gray-700 mb-1">
            Precio por asiento (USD)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="price-per-seat"
              min="0"
              step="0.01"
              {...register('price_per_seat', { 
                valueAsNumber: true,
                required: 'Debes indicar un precio por asiento'
              })}
              className="block w-full pl-7 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              aria-describedby="price-currency"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm" id="price-currency">
                USD
              </span>
            </div>
          </div>
          {errors.price_per_seat && (
            <p className="mt-1 text-sm text-red-600">{errors.price_per_seat.message}</p>
          )}
        </div>
      </div>

      {/* Vehicle details */}
      <div>
        <label htmlFor="vehicle-details" className="block text-sm font-medium text-gray-700 mb-1">
          Detalles del vehículo (opcional)
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="vehicle-details"
            {...register('vehicle_details')}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Toyota Corolla 2019, color blanco"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notas adicionales (opcional)
        </label>
        <div className="mt-1">
          <textarea
            id="notes"
            rows={3}
            {...register('notes')}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Información adicional para los pasajeros"
          />
        </div>
      </div>

      {/* Trip summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800">Resumen del viaje</h3>
        <p className="mt-1 text-sm text-blue-700">
          Al publicar este viaje, aceptas los términos y condiciones de Dale. 
          Recuerda que los pasajeros podrán ver la información de tu viaje y solicitar reservas.
        </p>
      </div>
    </div>
  );
}
