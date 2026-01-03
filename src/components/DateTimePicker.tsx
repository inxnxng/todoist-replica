'use client';

import { useTranslation } from '@/lib/useTranslation';
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  CalendarDays,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sun,
  Sunrise,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface DateTimePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  startTime: string;
  endTime: string;
  onChange: (updates: {
    startDate?: Date | null;
    endDate?: Date | null;
    startTime?: string;
    endTime?: string;
  }) => void;
}

export default function DateTimePicker({
  startDate,
  endDate,
  startTime,
  endTime,
  onChange,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showTimeSelect, setShowTimeSelect] = useState(
    !!(startTime || endTime),
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { t, language } = useTranslation();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Calendar generation
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDateCalendar = startOfWeek(monthStart);
  const endDateCalendar = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDateCalendar,
    end: endDateCalendar,
  });

  const handleDateClick = (day: Date) => {
    // If no start date, or if we have both start and end dates (resetting),
    // or if clicking before the current start date -> set as new Start Date
    if (
      !startDate ||
      (startDate && endDate) ||
      (startDate && isBefore(day, startDate))
    ) {
      onChange({
        startDate: day,
        endDate: null,
        startTime: startTime,
        endTime: '',
      });
      // If we are resetting, maybe we keep the start time?
      // Logic: If I click a new date, it's the start date.
    } else if (startDate && !endDate) {
      // If clicking same day as start, could toggle or do nothing.
      // If clicking after start, set as End Date.
      if (isSameDay(day, startDate)) {
        // Maybe just keep it as start date. User might want single day task.
      } else {
        onChange({ endDate: day });
      }
    }
  };

  const setPresetDate = (type: 'today' | 'tomorrow' | 'this-week') => {
    const today = new Date();
    let newDate: Date;

    switch (type) {
      case 'today':
        newDate = today;
        break;
      case 'tomorrow':
        newDate = addDays(today, 1);
        break;
      case 'this-week':
        // Default to this Saturday
        newDate = endOfWeek(today, { weekStartsOn: 1 }); // Saturday if week starts on Monday
        // Check if Saturday is in the past? (e.g. today is Sunday)
        if (isBefore(newDate, today)) {
          newDate = addDays(newDate, 7);
        }
        break;
    }
    onChange({ startDate: newDate, endDate: null, startTime: '', endTime: '' });
    setIsOpen(false);
  };

  const toggleTimeSelect = () => {
    setShowTimeSelect(!showTimeSelect);
    if (!showTimeSelect) {
      // When opening time select, if no time is set, maybe default to next hour?
      // For now leave empty as per existing logic or let user pick.
    } else {
      // When closing, clear times?
      // Todoist usually keeps them if hidden, but let's clear to be safe or just hide UI.
      // User asked: "Clicking it allows setting time..."
      onChange({ startTime: '', endTime: '' });
    }
  };

  const formatDateDisplay = () => {
    if (!startDate) return t.tasks.startDate || 'Date';
    if (!endDate)
      return format(startDate, 'MMM d', {
        locale: language === 'ko' ? ko : undefined,
      });
    return `${format(startDate, 'MMM d', { locale: language === 'ko' ? ko : undefined })} - ${format(endDate, 'MMM d', { locale: language === 'ko' ? ko : undefined })}`;
  };

  const isInRange = (day: Date) => {
    if (!startDate || !endDate) return false;
    return isAfter(day, startDate) && isBefore(day, endDate);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 ${isOpen ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
      >
        <CalendarIcon
          size={14}
          className={startDate ? 'text-primary' : 'text-gray-500'}
        />
        <span
          className={startDate ? 'font-medium text-primary' : 'text-gray-500'}
        >
          {formatDateDisplay()}
        </span>
        {(startTime || endTime) && (
          <span className="ml-1 rounded bg-gray-200 px-1 text-[10px] text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {startTime} {endTime ? `- ${endTime}` : ''}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="animate-in fade-in zoom-in-95 absolute left-0 top-full z-50 mt-1 w-[280px] rounded-lg border border-gray-200 bg-white p-3 shadow-xl duration-100 dark:border-gray-700 dark:bg-[#282828]">
          {/* Quick Select Presets */}
          <div className="mb-3 grid grid-cols-1 gap-1">
            <button
              onClick={() => setPresetDate('today')}
              className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Sun size={14} className="text-green-600" />
              <span className="flex-1">Today</span>
              <span className="text-[10px] text-gray-400">
                {format(new Date(), 'E')}
              </span>
            </button>
            <button
              onClick={() => setPresetDate('tomorrow')}
              className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Sunrise size={14} className="text-orange-500" />
              <span className="flex-1">Tomorrow</span>
              <span className="text-[10px] text-gray-400">
                {format(addDays(new Date(), 1), 'E')}
              </span>
            </button>
            <button
              onClick={() => setPresetDate('this-week')}
              className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <CalendarDays size={14} className="text-purple-500" />
              <span className="flex-1">This Week</span>
              <span className="text-[10px] text-gray-400">
                {format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'E')}
              </span>
            </button>
          </div>

          <hr className="mb-3 border-gray-100 dark:border-gray-700" />

          {/* Header */}
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
              {format(currentMonth, 'MMMM yyyy', {
                locale: language === 'ko' ? ko : undefined,
              })}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="mb-2 grid grid-cols-7 gap-y-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-medium text-gray-400"
              >
                {d}
              </div>
            ))}

            {calendarDays.map((day, idx) => {
              const isSelectedStart = startDate && isSameDay(day, startDate);
              const isSelectedEnd = endDate && isSameDay(day, endDate);
              const isBetween = isInRange(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDateClick(day)}
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full text-xs ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'} ${isToday && !isSelectedStart && !isSelectedEnd ? 'font-bold text-primary' : ''} ${isSelectedStart ? 'z-10 bg-primary text-white' : ''} ${isSelectedEnd ? 'z-10 bg-primary text-white' : ''} ${isBetween ? 'w-full rounded-none bg-primary/10' : ''} ${isSelectedStart && endDate ? 'rounded-r-none' : ''} ${isSelectedEnd ? 'rounded-l-none' : ''} hover:bg-gray-100 dark:hover:bg-gray-700`}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>

          <hr className="my-2 border-gray-100 dark:border-gray-700" />

          {/* Time Button / Section */}
          <div className="flex flex-col gap-2">
            {!showTimeSelect ? (
              <button
                type="button"
                onClick={toggleTimeSelect}
                className="flex items-center gap-2 py-1 text-xs text-gray-500 transition-colors hover:text-primary"
              >
                <Clock size={14} />
                <span>{t.tasks.startTime || 'Time'}</span>
              </button>
            ) : (
              <div className="animate-in slide-in-from-top-2 space-y-2 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    {t.tasks.startTime || 'Time'}
                  </span>
                  <button
                    type="button"
                    onClick={toggleTimeSelect}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="mb-0.5 block text-[10px] text-gray-400">
                      Start
                    </label>
                    <input
                      type="time"
                      className="w-full rounded border border-gray-200 bg-transparent px-1 py-1 text-xs dark:border-gray-600"
                      value={startTime}
                      onChange={(e) => onChange({ startTime: e.target.value })}
                    />
                  </div>
                  {endDate && (
                    <div className="flex-1">
                      <label className="mb-0.5 block text-[10px] text-gray-400">
                        End
                      </label>
                      <input
                        type="time"
                        className="w-full rounded border border-gray-200 bg-transparent px-1 py-1 text-xs dark:border-gray-600"
                        value={endTime}
                        onChange={(e) => onChange({ endTime: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
