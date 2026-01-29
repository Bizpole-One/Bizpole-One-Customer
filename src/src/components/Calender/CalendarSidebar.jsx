import React from 'react';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

const CalendarSidebar = ({ 
  handleSelectSlot, 
  events, 
  setSelectedEvent 
}) => {
  return (
    <div className="lg:w-1/4">
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <button 
          onClick={() => handleSelectSlot({ start: new Date(), end: new Date() })}
          className="w-full py-3.5 bg-yellow-500 cursor-pointer text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors shadow-md"
        >
          <Plus size={18} className="mr-2" />
          New Event
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          {events.slice(0, 5).map((event) => (
            <div 
              key={event.id} 
              className="p-4 rounded-xl border border-gray-200 hover:border-amber-300 cursor-pointer transition-colors bg-white hover:shadow-sm"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800 mb-1">{event.title}</div>
                  <div className="text-xs text-gray-500">
                    {format(event.start, "EEE, MMM d")} · {format(event.start, "h:mm a")}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="text-center py-6 text-gray-400 text-sm">
              No upcoming events
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarSidebar;