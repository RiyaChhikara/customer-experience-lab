'use client';

import { BookingResponse } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface BookingConfirmationProps {
  booking: BookingResponse;
  customerName: string;
}

export function BookingConfirmation({ booking, customerName }: BookingConfirmationProps) {
  const appointmentTime = new Date(booking.appointment_time);

  return (
    <div className="mt-8">
      <div className="bg-green-50 dark:bg-green-950 border-2 border-green-300 dark:border-green-700 rounded-xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-green-600 dark:text-green-400">
          ✅ Appointment Booked!
        </h2>
        <div className="text-base md:text-lg space-y-2 text-gray-800 dark:text-gray-200">
          <p>
            <strong>Customer:</strong> {customerName}
          </p>
          <p>
            <strong>Service:</strong> Emergency Plumbing
          </p>
          <p>
            <strong>Location:</strong> Tower Bridge, London
          </p>
          <p>
            <strong>Distance:</strong> {booking.pricing.distance_text} ({booking.pricing.duration_text})
          </p>
          
          <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-green-400 dark:border-green-600">
            <p className="text-lg">
              <strong>Base Price:</strong> £{booking.pricing.base_price}
            </p>
            <p className="text-lg">
              <strong>Travel Fee:</strong> £{booking.pricing.travel_fee}
            </p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400 mt-2">
              Total: £{booking.pricing.total_price}
            </p>
          </div>
          
          <p className="mt-4 text-lg">
            <strong>Scheduled:</strong> {appointmentTime.toLocaleString('en-GB')}
          </p>
          <p className="mt-4">
            <Button asChild>
              <a
                href={booking.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Open in Google Calendar
              </a>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

