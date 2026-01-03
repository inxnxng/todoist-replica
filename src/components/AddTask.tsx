'use client';

import { createTask } from '@/lib/actions';
import { useTranslation } from '@/lib/useTranslation';
import type { Project } from '@/types';
import { format } from 'date-fns';
import { Flag, Hash, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import DateTimePicker from './DateTimePicker';

interface AddTaskProps {
  projectId?: string;
  projects?: Project[];
  defaultDate?: Date;
}

export default function AddTask({
  projectId: initialProjectId,
  projects = [],
  defaultDate,
}: AddTaskProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Date/Time Logic
  const [startDate, setStartDate] = useState<Date | null>(defaultDate || null);
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState<Date | null>(defaultDate || null);
  const [endTime, setEndTime] = useState('');

  const [priority, setPriority] = useState(4);
  const [selectedProjectId, setSelectedProjectId] = useState(
    initialProjectId || projects[0]?.id || '',
  );
  const { t, language } = useTranslation();

  useEffect(() => {
    if (initialProjectId) setSelectedProjectId(initialProjectId);
  }, [initialProjectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Construct Dates
    let finalStartDate: Date | null = null;
    let finalEndDate: Date | null = null;

    if (startDate) {
      const dateStr = format(startDate, 'yyyy-MM-dd');

      if (startTime) {
        finalStartDate = new Date(`${dateStr}T${startTime}`);
      } else {
        finalStartDate = new Date(`${dateStr}T00:00:00`);
      }
    }

    if (endDate) {
      const dateStr = format(endDate, 'yyyy-MM-dd');

      if (endTime) {
        finalEndDate = new Date(`${dateStr}T${endTime}`);
      } else if (
        finalStartDate &&
        startDate &&
        endDate &&
        startDate.getTime() === endDate.getTime()
      ) {
        // If same day and no end time specified, default to end of day
        finalEndDate = new Date(`${dateStr}T23:59:59`);
      } else {
        finalEndDate = new Date(`${dateStr}T00:00:00`);
      }
    }

    await createTask(
      {
        title,
        description,
        priority,
        startDate: finalStartDate,
        endDate: finalEndDate,
        projectId: selectedProjectId,
      },
      language,
    );

    // Reset form
    setTitle('');
    setDescription('');
    setStartDate(defaultDate || null);
    setStartTime('');
    setEndDate(defaultDate || null);
    setEndTime('');
    setPriority(4);
    setIsExpanded(false);
  };

  const handleDateChange = (updates: {
    startDate?: Date | null;
    endDate?: Date | null;
    startTime?: string;
    endTime?: string;
  }) => {
    if (updates.startDate !== undefined) setStartDate(updates.startDate);
    if (updates.endDate !== undefined) setEndDate(updates.endDate);
    if (updates.startTime !== undefined) setStartTime(updates.startTime);
    if (updates.endTime !== undefined) setEndTime(updates.endTime);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="group flex w-full items-center gap-2 py-2 text-gray-500 transition-colors hover:text-primary"
      >
        <Plus
          size={20}
          className="rounded-full p-0.5 text-primary group-hover:bg-primary group-hover:text-white"
        />
        <span className="text-sm font-medium">{t.tasks.addTask}</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-[#1f1f1f]"
    >
      <div className="space-y-1">
        <input
          autoFocus
          type="text"
          placeholder={t.tasks.taskName}
          className="mb-2 w-full border-none bg-transparent p-0 text-sm font-medium placeholder:text-gray-400 focus:ring-0"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder={t.tasks.description}
          className="w-full resize-none border-none bg-transparent p-0 text-xs placeholder:text-gray-400 focus:ring-0"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      <div className="flex flex-col gap-2 text-xs text-gray-600 dark:text-gray-400">
        {/* Date/Time Row */}
        <div className="flex flex-wrap items-center gap-2">
          <DateTimePicker
            startDate={startDate}
            endDate={endDate}
            startTime={startTime}
            endTime={endTime}
            onChange={handleDateChange}
          />

          {/* Project Selector */}
          <div className="flex items-center gap-1 rounded border border-gray-200 px-2 py-1 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
            <Hash size={14} />
            <select
              className="max-w-[100px] cursor-pointer border-none bg-transparent p-0 text-xs focus:ring-0"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Selector */}
          <div className="flex items-center gap-1 rounded border border-gray-200 px-2 py-1 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
            <Flag
              size={14}
              className={
                priority === 1
                  ? 'text-red-600'
                  : priority === 2
                    ? 'text-orange-500'
                    : priority === 3
                      ? 'text-blue-500'
                      : 'text-gray-400'
              }
            />
            <select
              className="cursor-pointer border-none bg-transparent p-0 text-xs focus:ring-0"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
            >
              <option value={1}>P1</option>
              <option value={2}>P2</option>
              <option value={3}>P3</option>
              <option value={4}>P4</option>
            </select>
          </div>
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="rounded bg-gray-100 px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          {t.common.cancel}
        </button>
        <button
          type="submit"
          disabled={!title.trim() || !selectedProjectId}
          className="rounded bg-primary px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          {t.tasks.addTask}
        </button>
      </div>
    </form>
  );
}
