'use client';

import AddTask from '@/components/AddTask';
import TaskList from '@/components/TaskList';
import { useTranslation } from '@/lib/useTranslation';

import type { Project, Task } from '@/types';
import {
  addWeeks,
  eachDayOfInterval,
  endOfDay,
  endOfWeek,
  format,
  isSameDay,
  startOfDay,
  startOfWeek,
  subWeeks,
} from 'date-fns';
import { enUS, ko } from 'date-fns/locale';
import { Calendar as CalendarIcon, LayoutList } from 'lucide-react';
import { useState } from 'react';

interface ProjectClientViewProps {
  project: Project & { tasks: Task[] };
  projects: Project[];
}

export default function ProjectClientView({
  project,
  projects,
}: ProjectClientViewProps) {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const { t, language } = useTranslation();
  const locale = language === 'ko' ? ko : enUS;

  return (
    <div className="flex h-full flex-col space-y-6">
      <header className="flex flex-shrink-0 items-center justify-between">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          <button
            onClick={() => setViewMode('list')}
            className={`rounded p-1.5 ${viewMode === 'list' ? 'bg-white shadow-sm dark:bg-gray-700' : 'text-gray-500 hover:text-gray-700'}`}
            title={t.project.viewList}
          >
            <LayoutList size={18} />
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`rounded p-1.5 ${viewMode === 'calendar' ? 'bg-white shadow-sm dark:bg-gray-700' : 'text-gray-500 hover:text-gray-700'}`}
            title={t.project.viewCalendar}
          >
            <CalendarIcon size={18} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        {viewMode === 'list' ? (
          <div className="h-full overflow-y-auto pr-2">
            <TaskList tasks={project.tasks} />
            <div className="pt-4">
              <AddTask projectId={project.id} projects={projects} />
            </div>
          </div>
        ) : (
          <CalendarView
            project={project}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            locale={locale}
          />
        )}
      </div>
    </div>
  );
}

function CalendarView({
  project,
  currentDate,
  setCurrentDate,
  locale,
}: {
  project: Project & { tasks: Task[] };
  currentDate: Date;
  setCurrentDate: (d: Date) => void;
  locale: any;
}) {
  const start = startOfWeek(currentDate, { locale });
  const end = endOfWeek(currentDate, { locale });
  const days = eachDayOfInterval({ start, end });

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {format(currentDate, 'yyyy.MM', { locale })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
            className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
            className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-7 gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 dark:border-gray-700 dark:bg-gray-700">
        {days.map((day) => {
          const dayTasks = project.tasks.filter((task) => {
            if (!task.startDate && !task.endDate) return false;
            const taskStart = task.startDate ? new Date(task.startDate) : null;
            const taskEnd = task.endDate ? new Date(task.endDate) : null;

            // Simple check if date is within range
            if (taskStart && taskEnd) {
              return day >= startOfDay(taskStart) && day <= endOfDay(taskEnd);
            } else if (taskStart) {
              return isSameDay(day, taskStart);
            }
            return false;
          });

          return (
            <div
              key={day.toISOString()}
              className="flex min-h-[100px] flex-col bg-white p-2 dark:bg-[#1f1f1f]"
            >
              <div
                className={`mb-1 text-xs font-semibold ${isSameDay(day, new Date()) ? 'text-primary' : 'text-gray-500'}`}
              >
                {format(day, 'd E', { locale })}
              </div>
              <div className="flex-1 space-y-1 overflow-y-auto">
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="truncate rounded border-l-2 border-primary bg-gray-50 p-1 text-[10px] dark:bg-gray-800"
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
