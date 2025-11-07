import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface CalendarProps {
  onDateSelect: (date: string) => void;
  onClose: () => void;
  initialDate?: string;
}

export const Calendar: React.FC<CalendarProps> = ({ onDateSelect, onClose, initialDate }) => {
  const getInitialDate = () => {
    if (!initialDate) return new Date();
    // Safely parse YYYY-MM-DD to avoid timezone issues
    const parts = initialDate.split('-');
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  };

  const [currentDate, setCurrentDate] = useState(getInitialDate());
  const calendarRef = useRef<HTMLDivElement>(null);

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay(); 
  const daysInMonth = endOfMonth.getDate();
  
  const selectedDate = initialDate ? getInitialDate() : null;
  const today = new Date();

  const days = [];
  // Pad start of month with empty cells
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className=""></div>);
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
    const isToday = date.toDateString() === today.toDateString();
    
    days.push(
      <div
        key={i}
        className={`w-full aspect-square flex items-center justify-center rounded-full cursor-pointer transition-colors ${
            isSelected 
                ? 'bg-blue-600 text-white font-semibold' 
                : isToday 
                    ? 'ring-1 ring-blue-500' 
                    : 'hover:bg-blue-100'
        }`}
        onClick={() => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            onDateSelect(`${yyyy}-${mm}-${dd}`);
        }}
      >
        {i}
      </div>
    );
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value, 10);
    setCurrentDate(new Date(currentDate.getFullYear(), newMonth, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10);
    setCurrentDate(new Date(newYear, currentDate.getMonth(), 1));
  };
  
  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString('default', { month: 'long' })
  );
  
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        ref={calendarRef} 
        className="w-full max-w-xs mx-4 bg-white p-4 rounded-lg shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <button type="button" onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <ChevronLeftIcon className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex gap-2">
            <select
              value={currentDate.getMonth()}
              onChange={handleMonthChange}
              className="appearance-none cursor-pointer px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
              {monthNames.map((name, index) => (
                <option key={name} value={index}>{name}</option>
              ))}
            </select>
             <select
              value={currentDate.getFullYear()}
              onChange={handleYearChange}
              className="appearance-none cursor-pointer px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <button type="button" onClick={handleNextMonth} className="p-1 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <ChevronRightIcon className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm text-slate-500 font-medium mb-2">
          {weekdays.map(day => <div key={day} className="w-full aspect-square flex items-center justify-center">{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm text-slate-700">
          {days}
        </div>
      </div>
    </div>
  );
};