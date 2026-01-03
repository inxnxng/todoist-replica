'use client';

import AddTask from '@/components/AddTask';
import TaskList from '@/components/TaskList';
import { useTranslation } from '@/lib/useTranslation';
import type { Project, Task } from '@/types';
import { endOfDay, format, startOfDay } from 'date-fns';
import { enUS, ko } from 'date-fns/locale';
import { useEffect, useRef } from 'react';

interface TaskWithSubTasks extends Task {
  subTasks?: Task[];
}

interface WeeklyPlanViewProps {
  days: Date[];
  tasks: TaskWithSubTasks[];
  projects: Project[];
  startRange: Date;
  endRange: Date;
}

export default function WeeklyPlanView({
  days,
  tasks,
  projects,
  startRange,
  endRange,
}: WeeklyPlanViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, language } = useTranslation();
  const locale = language === 'ko' ? ko : enUS;

  useEffect(() => {
    // Scroll to Today column on mount
    if (containerRef.current) {
      const todayColumn = containerRef.current.querySelector(
        '[data-is-today="true"]',
      );
      if (todayColumn) {
        todayColumn.scrollIntoView({ behavior: 'smooth', inline: 'start' });
      }
    }
  }, []);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-bold">{t.weekly.title}</h1>
        <p className="text-sm text-gray-500">
          {format(startRange, t.weekly.dateFormat, { locale })} -{' '}
          {format(endRange, t.weekly.dateFormat, { locale })}
        </p>
      </header>

      <div
        ref={containerRef}
        className="flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
      >
        <div className="flex h-full min-w-max gap-4 px-1 pb-4">
          {days.map((date) => {
            const dayStart = startOfDay(date);
            const dayEnd = endOfDay(date);
            const isToday =
              format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

            // Filter tasks
            const daysTasks = tasks
              .filter((task) => {
                // 1. Hide if main task is completed
                if (task.completed) return false;

                // Check date overlap for main task context
                const hasDate = task.startDate || task.endDate;
                if (!hasDate) return false;

                let isInRange = false;
                if (task.startDate && !task.endDate) {
                  isInRange =
                    new Date(task.startDate) >= dayStart &&
                    new Date(task.startDate) <= dayEnd;
                } else if (task.startDate && task.endDate) {
                  const s = new Date(task.startDate);
                  const e = new Date(task.endDate);
                  isInRange = s <= dayEnd && e >= dayStart;
                }

                return isInRange;
              })
              .map((task) => {
                // 2. Filter subtasks to only show those for THIS day
                // We create a new object to avoid mutating the original prop
                // If no subtasks, just return task as is (it might be a single day task)
                if (!task.subTasks || task.subTasks.length === 0) return task;

                const daySubTasks = task.subTasks.filter((sub) => {
                  if (!sub.startDate) return false;
                  const subDate = new Date(sub.startDate);
                  return subDate >= dayStart && subDate <= dayEnd;
                });

                return {
                  ...task,
                  subTasks: daySubTasks,
                };
              });

            return (
              <div
                key={date.toISOString()}
                data-is-today={isToday}
                className={`flex h-full w-72 snap-start flex-col rounded-xl border ${isToday ? 'border-primary/50 bg-primary/5 dark:bg-primary/10' : 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50'}`}
              >
                <div
                  className={`border-b p-3 ${isToday ? 'border-primary/20' : 'border-gray-200 dark:border-gray-800'}`}
                >
                  <h2 className={`font-bold ${isToday ? 'text-primary' : ''}`}>
                    {format(date, 'E', { locale })}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {format(date, t.weekly.dateFormat)}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                  <TaskList tasks={daysTasks} />
                </div>

                <div className="rounded-b-xl border-t border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-[#1f1f1f]">
                  <AddTask
                    projectId={projects[0]?.id}
                    projects={projects}
                    defaultDate={date}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
