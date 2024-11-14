'use client'

import { useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
//import format from 'date-fns/format'
//import format from 'date-fns'
//import parse from 'date-fns/parse'
//import startOfWeek from 'date-fns/startOfWeek'
//import getDay from 'date-fns/getDay'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { ArrowLeft } from 'lucide-react'

import Link from 'next/link'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const events = [
  {
    id: 1,
    title: 'LE SSERAFIM Concert',
    start: new Date(2024, 10, 10, 18, 0),
    end: new Date(2024, 10, 10, 21, 0),
    color: '#F472B6', // poooooooink
  },
  {
    id: 2,
    title: 'Fan Meeting',
    start: new Date(2024, 10, 15, 14, 0),
    end: new Date(2024, 10, 15, 16, 0),
    color: '#60A5FA', // bluebob
  },
  {
    id: 3,
    title: 'Album Release',
    start: new Date(2024, 10, 20),
    end: new Date(2024, 10, 20),
    color: '#34D399', // greeeen
  },
]

const eventStyleGetter = (event: { color: string }) => { 
    return {
      style: {
        backgroundColor: event.color,
      },
    }
  }

export default function EventsPage() {
const [selectedEvent, setSelectedEvent] = useState<{ id: number; title: string; start: Date; end: Date; color: string } | null>(null)  
const [showEventDialog, setShowEventDialog] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', color: '#F472B6' })

  const handleSelectEvent = (event: { id: number; title: string; start: Date; end: Date; color: string }) => {
    setSelectedEvent(event)
    setShowEventDialog(true)
  }

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setNewEvent({ 
        ...newEvent, 
        start: format(new Date(start), "yyyy-MM-dd'T'HH:mm"),
        end: format(new Date(start), "yyyy-MM-dd'T'HH:mm") 
    })    
    setShowEventDialog(true)
  }

  const handleCreateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const createdEvent = {
      ...newEvent,
      id: events.length + 1,
      start: new Date(newEvent.start),
      end: new Date(newEvent.end),
    }
    events.push(createdEvent)
    setShowEventDialog(false)
    setNewEvent({ title: '', start: '', end: '', color: '#F472B6' })
  }

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
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 'calc(100vh - 200px)' }}
              defaultDate={new Date(2024, 10, 1)}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent>
          {selectedEvent ? (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Start: {format(selectedEvent.start, 'PPpp')}
                <br />
                End: {format(selectedEvent.end, 'PPpp')}
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="start">Start Time</Label>
                  <Input
                    id="start"
                    type="datetime-local"
                    value={newEvent.start}
                    onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end">End Time</Label>
                  <Input
                    id="end"
                    type="datetime-local"
                    value={newEvent.end}
                    onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="color">Event Color</Label>
                  <Select
                    value={newEvent.color}
                    onValueChange={(value) => setNewEvent({ ...newEvent, color: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="#F472B6">Pink</SelectItem>
                      <SelectItem value="#60A5FA">Blue</SelectItem>
                      <SelectItem value="#34D399">Green</SelectItem>
                      <SelectItem value="#FBBF24">Yellow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Create Event</Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}