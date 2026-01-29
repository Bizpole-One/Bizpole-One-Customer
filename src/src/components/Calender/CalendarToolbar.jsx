import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';

const CalendarToolbar = (toolbar) => {
  const [showMenu, setShowMenu] = useState(false);

  const view = toolbar?.view || 'month';
  
  let date;
  if (toolbar?.date && !isNaN(new Date(toolbar.date).getTime())) {
    date = new Date(toolbar.date);
  } else {
    date = new Date();
    console.warn('Invalid date provided to CalendarToolbar, using current date');
  }

  const onView = toolbar?.onView || (() => {});
  const onNavigate = toolbar?.onNavigate || (() => {});

  const label = generateLabel(date, view);

  function generateLabel(currentDate, viewType) {
    try {
      if (isNaN(currentDate.getTime())) {
        currentDate = new Date();
      }

      if (viewType === 'month') {
        return currentDate.toLocaleDateString(undefined, { 
          year: 'numeric', 
          month: 'long' 
        });
      } else if (viewType === 'week') {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
          return `${startOfWeek.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })} - ${endOfWeek.toLocaleDateString(undefined, { day: 'numeric', year: 'numeric' })}`;
        } else {
          return `${startOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
        }
      } else if (viewType === 'day') {
        return currentDate.toLocaleDateString(undefined, { 
          year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
        });
      } else {
        return currentDate.toLocaleDateString(undefined, { 
          year: 'numeric', month: 'long', day: 'numeric' 
        });
      }
    } catch (error) {
      console.error('Error generating calendar label:', error);
      return new Date().toLocaleDateString(undefined, { 
        year: 'numeric', month: 'long' 
      });
    }
  }

  const navigate = (action) => {
    if (typeof onNavigate === 'function') onNavigate(action);
  };

  const changeView = (viewName) => {
    if (typeof onView === 'function') onView(viewName);
    setShowMenu(false); // close menu after selecting
  };

  return (
    <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow-sm">
      {/* Left Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigate('PREV')}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => navigate('TODAY')}
          className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
        >
          Today
        </button>
        <button
          onClick={() => navigate('NEXT')}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Center Label */}
      <div className="flex-1 text-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {label}
        </h2>
      </div>

      {/* Right View Controls */}
      <div className="relative">
        {/* Desktop View Buttons */}
        <div className="hidden sm:flex items-center space-x-1 bg-gray-100 rounded-md p-1">
          {['month', 'week', 'day', 'agenda'].map((viewName) => (
            <button
              key={viewName}
              onClick={() => changeView(viewName)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                view === viewName
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {viewName.charAt(0).toUpperCase() + viewName.slice(1)}
            </button>
          ))}
        </div>

        {/* Mobile 3-dot Menu */}
        <div className="sm:hidden">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <MoreVertical size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {['month', 'week', 'day', 'agenda'].map((viewName) => (
                <button
                  key={viewName}
                  onClick={() => changeView(viewName)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    view === viewName
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {viewName.charAt(0).toUpperCase() + viewName.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarToolbar;
