'use client'

import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const locales = {
    'en-US': enUS,
};

interface Event {
  start: Date; 
  end: Date;   
  color?: string;
}


const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const eventStyleGetter = (event: { color?: string }) => {
  return {
        style: {
            backgroundColor: event.color || '#60A5FA', 
        },
    };
};

export default function EventsPage() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/getEvents');
                const data = await response.json();
                console.log("Fetched events data:", data);

                const formattedEvents = data.map((event: Event) => ({
                  ...event,
                  start: new Date(event.start),
                  end: new Date(event.end),
                    color: '#60A5FA',
                }));

                setEvents(formattedEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <Link href="/">
                        <Button variant="outline" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-center text-pink-500">LE SSERAFIM Events</h1>
                </div>
                
                <Card className="w-full">
                    <CardContent className="p-6">
                    <Calendar
                        localizer={localizer}
                        events={events as Event[]}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 'calc(100vh - 200px)' }}
                        defaultDate={new Date()} // Set to current date
                        eventPropGetter={eventStyleGetter}
                        selectable
                    />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
