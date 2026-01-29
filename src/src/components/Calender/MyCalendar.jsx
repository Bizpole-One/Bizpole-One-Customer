import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import CalendarToolbar from './CalendarToolbar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar-theme.css'; // ⬅️ import AFTER the default CSS

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Meeting with Team',
      start: new Date(),
      end: new Date(new Date().setHours(new Date().getHours() + 2)),
    },
  ]);

  const handleNavigate = (newDate, newView) => {
    const d = new Date(newDate);
    setDate(isNaN(d.getTime()) ? new Date() : d);
    if (newView) setView(newView);
  };

  const handleView = (newView) => setView(newView);

  // When user selects a slot, create a sample event (you can replace with your modal/form)
  const handleSelectSlot = ({ start, end }) => {
    setEvents((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: 'New Event',
        start,
        end,
      },
    ]);
  };

  // (Optional) If you still want per-event inline styles, keep this.
  // Not required since we themed via CSS, but left here as example.
  const eventStyleGetter = () => ({
    style: {
      backgroundColor: '#f59e0b', // amber-500
      border: 'none',
      color: '#111827',
      fontWeight: 600,
      borderRadius: 8,
      padding: '2px 6px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    },
  });

  useEffect(() => {
    console.log('Current calendar date:', date);
  }, [date]);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={date}
          view={view}
          onNavigate={handleNavigate}
          onView={handleView}
          components={{ toolbar: CalendarToolbar }}
          selectable
          onSelectSlot={handleSelectSlot}
          popup
          eventPropGetter={eventStyleGetter} // optional — CSS already styles too
          style={{ height: 500 }}
        />
      </div>
    </div>
  );
};

export default MyCalendar;
