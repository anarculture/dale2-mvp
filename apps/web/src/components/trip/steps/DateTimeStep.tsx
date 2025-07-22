import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import type { TripFormData } from '../CreateTripForm';
import { format, addDays, isToday, isSameDay, parseISO, setHours, setMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

type DateTimeStepProps = {
  onNext: () => void;
  onBack: () => void;
};

type DatePickerStep = 'date' | 'time';

export default function DateTimeStep({ onNext, onBack }: DateTimeStepProps) {
  const { setValue, watch, formState: { errors } } = useFormContext<TripFormData>();
  const departureDatetime = watch('departure_datetime');
  
  // Track which step we're on (date or time selection)
  const [currentStep, setCurrentStep] = useState<DatePickerStep>('date');

  // Initialize with current date or existing value
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (departureDatetime) {
      return new Date(departureDatetime);
    }
    const now = new Date();
    return now;
  });

  const [selectedTime, setSelectedTime] = useState<string>(() => {
    if (departureDatetime) {
      const date = new Date(departureDatetime);
      return format(date, 'HH:mm');
    }
    const now = new Date();
    // Round to nearest 10 minutes
    const minutes = Math.ceil(now.getMinutes() / 10) * 10;
    return format(setMinutes(now, minutes >= 60 ? 0 : minutes), 'HH:mm');
  });

  // Set minimum date to today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Update form value when date or time changes
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const dateWithTime = setHours(setMinutes(selectedDate, minutes), hours);
      setValue('departure_datetime', dateWithTime.toISOString());
    }
  }, [selectedDate, selectedTime, setValue]);
  
  // Check if we have valid date and time selected
  const isDateTimeValid = Boolean(selectedDate && selectedTime);

  // Generate calendar data
  const generateCalendarData = () => {
    const currentDate = new Date();
    const months = [];
    
    // Generate current month and next month
    for (let i = 0; i < 2; i++) {
      const monthDate = new Date(currentDate);
      monthDate.setMonth(currentDate.getMonth() + i);
      monthDate.setDate(1); // First day of month
      
      const monthName = format(monthDate, 'MMMM', { locale: es });
      const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
      const firstDayOfMonth = monthDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Adjust for week starting on Monday (0 = Monday, 6 = Sunday)
      const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
      
      const days = [];
      
      // Add empty cells for days before the first day of the month
      for (let j = 0; j < adjustedFirstDay; j++) {
        days.push(null);
      }
      
      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        // Only include today and future dates
        if (date >= today) {
          days.push(date);
        } else {
          days.push(null); // Past dates are null but keep the grid structure
        }
      }
      
      months.push({
        name: monthName,
        capitalizedName: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        days
      });
    }
    
    return months;
  };
  
  const calendarData = generateCalendarData();
  
  // Generate time slots in 10-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 5; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        slots.push(format(new Date().setHours(hour, minute), 'HH:mm'));
      }
    }
    return slots;
  };
  
  const timeSlots = generateTimeSlots();
  
  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentStep('time');
  };
  
  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    handleNext();
  };
  
  const handleNext = () => {
    onNext();
  };
  
  // Format day names
  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  return (
    <div className="space-y-6">
      {currentStep === 'date' ? (
        <>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">¿Qué día sales?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {calendarData.map((month, monthIndex) => (
              <div key={monthIndex} className="calendar-month">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-700 capitalize">{month.capitalizedName}</h3>
                  {monthIndex === 0 && calendarData.length > 1 && (
                    <button 
                      type="button" 
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                      onClick={() => setCurrentStep('time')}
                    >
                      <span className="mr-1">Agosto</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {/* Day names */}
                  {dayNames.map((day, i) => (
                    <div key={i} className="text-center text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {month.days.map((date, i) => {
                    if (date === null) {
                      return <div key={`empty-${i}`} className="h-10"></div>;
                    }
                    
                    const isSelected = isSameDay(date, selectedDate);
                    const isCurrentDay = isToday(date);
                    
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={date < today}
                        className={`h-10 w-full flex items-center justify-center rounded-full text-sm
                          ${isSelected ? 'bg-blue-600 text-white' : ''}
                          ${!isSelected && isCurrentDay ? 'border border-blue-600 text-blue-600' : ''}
                          ${!isSelected && !isCurrentDay ? 'hover:bg-gray-100' : ''}
                          ${date < today ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                        onClick={() => handleDateSelect(date)}
                      >
                        {format(date, 'd')}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="text-center mb-6">
            <button 
              type="button" 
              className="absolute left-0 top-0 p-4 text-blue-600 hover:text-blue-800 flex items-center"
              onClick={() => setCurrentStep('date')}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span>Volver</span>
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">¿A qué hora recogerás a los pasajeros?</h2>
          </div>
          
          <div className="relative">
            <div className="flex justify-center mb-4">
              <div className="relative w-full max-w-xs">
                <button 
                  type="button" 
                  className="w-full text-4xl font-semibold text-center py-4 px-8 border-2 border-blue-500 text-blue-600 rounded-full flex items-center justify-center"
                >
                  {selectedTime}
                  <ChevronDown className="w-6 h-6 ml-2" />
                </button>
              </div>
            </div>
            
            <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg">
              <div className="grid grid-cols-4 sm:grid-cols-6">
                {timeSlots.map((time, i) => {
                  const isSelected = time === selectedTime;
                  
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`py-3 text-center text-sm border-b border-r border-gray-100
                        ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}
                      `}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
      {/* Navigation buttons */}
      <div className="mt-8 space-y-3">
        <button
          type="button"
          onClick={onNext}
          disabled={!isDateTimeValid}
          className={`w-full py-3 px-4 ${isDateTimeValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'} text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          Continuar
        </button>
        
        {!isDateTimeValid && (
          <p className="text-sm text-center text-amber-600">
            {!selectedDate ? 'Selecciona una fecha' : 'Selecciona una hora'} para continuar
          </p>
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
