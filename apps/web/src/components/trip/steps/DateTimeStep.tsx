import { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import type { TripFormData } from '../CreateTripForm';

type DateTimeStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export default function DateTimeStep({ onNext, onBack }: DateTimeStepProps) {
  const { register, setValue, watch, formState: { errors } } = useFormContext<TripFormData>();
  
  // Get the current date and time in the format required by the date and time inputs
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  const formattedTime = today.toTimeString().slice(0, 5);
  
  // State to track the selected date and time separately
  const [selectedDate, setSelectedDate] = useState(formattedDate);
  const [selectedTime, setSelectedTime] = useState(formattedTime);
  
  // State for custom time picker
  const [showHourPicker, setShowHourPicker] = useState(false);
  const [showMinutePicker, setShowMinutePicker] = useState(false);
  const [hour, setHour] = useState(today.getHours());
  const [minute, setMinute] = useState(today.getMinutes());
  
  // Ref for the time picker dropdown
  const timePickerRef = useRef<HTMLDivElement>(null);
  
  // Generate hours and minutes arrays
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  
  // Watch the departure_datetime field
  const currentDateTime = watch('departure_datetime');
  
  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    updateDateTime(newDate, selectedTime);
  };
  
  // Handle hour selection
  const handleHourSelect = (h: number) => {
    setHour(h);
    setShowHourPicker(false);
    setShowMinutePicker(true); // Show minute picker after selecting hour
    
    // Format the new time
    const newTime = `${h.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    setSelectedTime(newTime);
    updateDateTime(selectedDate, newTime);
  };
  
  // Handle minute selection
  const handleMinuteSelect = (m: number) => {
    setMinute(m);
    setShowMinutePicker(false);
    
    // Format the new time
    const newTime = `${hour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    setSelectedTime(newTime);
    updateDateTime(selectedDate, newTime);
  };
  
  // Close time picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setShowHourPicker(false);
        setShowMinutePicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Update the combined datetime field
  const updateDateTime = (date: string, time: string) => {
    const combinedDateTime = `${date}T${time}:00`;
    setValue('departure_datetime', combinedDateTime);
  };
  
  // Handle next button click
  const handleNext = () => {
    // Validate that we have a date and time before proceeding
    if (selectedDate && selectedTime) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">¿Cuándo sales?</h2>
        <p className="mt-1 text-sm text-gray-500">
          Selecciona la fecha y hora de salida de tu viaje
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date picker */}
        <div>
          <label htmlFor="trip-date" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <input
            type="date"
            id="trip-date"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min={formattedDate} // Prevent selecting dates in the past
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>

        {/* Custom Time picker */}
        <div ref={timePickerRef} className="relative">
          <label htmlFor="trip-time" className="block text-sm font-medium text-gray-700 mb-1">
            Hora
          </label>
          <button
            type="button"
            id="trip-time"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left bg-white"
            onClick={() => {
              setShowHourPicker(true);
              setShowMinutePicker(false);
            }}
          >
            {selectedTime}
          </button>
          
          {/* Hour selector */}
          {showHourPicker && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="grid grid-cols-4 gap-1 p-2">
                {hours.map((h) => (
                  <button
                    key={h}
                    type="button"
                    className={`p-2 text-center rounded hover:bg-blue-100 ${h === hour ? 'bg-blue-200' : ''}`}
                    onClick={() => handleHourSelect(h)}
                  >
                    {h.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Minute selector */}
          {showMinutePicker && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="grid grid-cols-4 gap-1 p-2">
                {minutes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`p-2 text-center rounded hover:bg-blue-100 ${m === minute ? 'bg-blue-200' : ''}`}
                    onClick={() => handleMinuteSelect(m)}
                  >
                    {m.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Date and time preview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800">Vista previa</h3>
        <p className="mt-1 text-lg font-semibold text-blue-900">
          {selectedDate && selectedTime ? (
            new Date(`${selectedDate}T${selectedTime}`).toLocaleString('es-VE', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          ) : (
            'Selecciona fecha y hora'
          )}
        </p>
      </div>

      <input type="hidden" {...register('departure_datetime')} />
      {errors.departure_datetime && (
        <p className="mt-1 text-sm text-red-600">{errors.departure_datetime.message}</p>
      )}
    </div>
  );
}
