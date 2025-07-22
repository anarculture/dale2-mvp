import React from 'react';
import Link from 'next/link';
import { Trip } from '@dale/core';
import { useTranslation } from 'react-i18next';

// Helper functions to format date and time
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-VE', { weekday: 'short', day: 'numeric', month: 'short' });
};

// Extend Trip type to include nested profile data for the component
export type TripWithProfile = Trip & {
  profiles: {
    id: string;
    full_name: string;
    photo_url: string;
  } | null;
};

interface TripCardProps {
  trip: TripWithProfile;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const { t } = useTranslation();
  return (
    <Link href={`/trips/${trip.id}`} className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        {/* Date */}
        <div className="md:col-span-1 text-center bg-blue-50 p-2 rounded-lg">
          <p className="font-bold text-blue-800">{formatDate(trip.departure_datetime)}</p>
          <p className="text-sm text-blue-600">{formatTime(trip.departure_datetime)}</p>
        </div>
        
        {/* Origin and Destination */}
        <div className="md:col-span-2 flex items-center space-x-4">
          <div className="text-right">
            <p className="font-bold text-gray-800">{trip.origin}</p>
          </div>
          <div className="flex-grow text-center flex items-center">
            <div className="bg-gray-300 h-0.5 w-full"></div>
            <div className="bg-blue-500 text-white rounded-full p-1 mx-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="bg-gray-300 h-0.5 w-full"></div>
          </div>
          <div className="text-left">
            <p className="font-bold text-gray-800">{trip.destination}</p>
          </div>
        </div>
        
        {/* Driver Info */}
        <div className="md:col-span-1 text-center">
          {trip.profiles ? (
            <div className="flex flex-col items-center justify-center">
              <img 
                src={trip.profiles.photo_url || '/default-avatar.jpg'} 
                alt={trip.profiles.full_name} 
                className="w-10 h-10 rounded-full mb-1 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/default-avatar.jpg';
                }}
              />
              <p className="text-sm text-gray-700">{trip.profiles.full_name}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full mb-1 bg-gray-200"></div>
              <p className="text-sm text-gray-500">{t('trips.noInfo')}</p>
            </div>
          )}
        </div>
        
        {/* Price and Seats */}
        <div className="md:col-span-1 flex flex-col items-end">
          <p className="text-2xl font-bold text-blue-600">${trip.price_per_seat.toFixed(2)}</p>
          <p className="text-sm text-gray-500">{t('trips.perSeat')}</p>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>{trip.available_seats} {t('trips.seats')}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TripCard;
