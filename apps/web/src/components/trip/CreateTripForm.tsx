import React, { useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { createTrip } from '@dale/core/api/tripsApi';
import { useRouter } from 'next/router';
import OriginStep from './steps/OriginStep';
import DestinationStep from './steps/DestinationStep';
import DateTimeStep from './steps/DateTimeStep';
import SeatsStep from './steps/SeatsStep';
import PriceStep from './steps/PriceStep';

const tripFormSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  departure_datetime: z.string().min(1, 'Departure date and time is required'),
  available_seats: z.number().int().positive('Must have at least 1 seat'),
  price_per_seat: z.number().positive('Price must be greater than 0'),
  vehicle_details: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => data.origin !== data.destination, {
  message: 'Origin and destination must be different',
  path: ['destination'],
});

export type TripFormData = {
  origin: string;
  destination: string;
  departure_datetime: string;
  available_seats: number;
  price_per_seat: number;
  vehicle_details?: string;
  notes?: string;
};

export default function CreateTripForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const supabase = useSupabaseClient();
  const router = useRouter();

  const methods = useForm<TripFormData>({
    // @ts-expect-error zod v4 types differ from resolver typings; runtime is compatible.
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      origin: '',
      destination: '',
      departure_datetime: '',
      available_seats: 1,
      price_per_seat: 0,
      vehicle_details: '',
      notes: '',
    },
  });

  const { handleSubmit, watch } = methods;

  const formData = watch();

  const onSubmit = async (data: TripFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const { error } = await createTrip(supabase, {
        ...data,
        available_seats: Number(data.available_seats),
        price_per_seat: Number(data.price_per_seat),
      });

      if (error) throw error;

      // Redirect to trips list or show success message
      router.push('/trips');
    } catch (error) {
      console.error('Failed to create trip:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create trip';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = React.useMemo(() => [
    {
      title: 'Origen',
      component: <OriginStep onNext={() => setCurrentStep(1)} />,
    },
    {
      title: 'Destino',
      component: <DestinationStep onNext={() => setCurrentStep(2)} onBack={() => setCurrentStep(0)} />,
    },
    {
      title: 'Fecha y hora',
      component: <DateTimeStep onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />,
    },
    {
      title: 'Pasajeros',
      component: <SeatsStep onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />,
    },
    {
      title: 'Precio',
      component: <PriceStep onNext={handleSubmit(onSubmit)} onBack={() => setCurrentStep(3)} />,
    }
  ], [handleSubmit, onSubmit]);

  // Ensure we don't try to access steps before they're ready
  if (steps.length === 0) {
    return <div>Loading...</div>;
  }

  const currentStepData = steps[currentStep] || steps[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormProvider {...methods}>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                {currentStepData.title}
              </h2>
              <span className="text-sm text-gray-500">
                Paso {currentStep + 1} de {steps.length}
              </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current step content */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {currentStepData.component}
        </div>

        {/* Error message */}
        {submitError && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {submitError}
          </div>
        )}
        
        {/* Loading indicator */}
        {isSubmitting && (
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </FormProvider>
    </form>
  );
}
