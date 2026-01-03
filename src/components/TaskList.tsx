'use client';

import { deleteTask, toggleTask } from '@/lib/actions';
import { useTranslation } from '@/lib/useTranslation';
import type { Task } from '@/types';
import { format } from 'date-fns';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Trash2,
} from 'lucide-react';
import { useState, useTransition } from 'react';

interface TaskWithSubTasks extends Task {
  subTasks?: Task[];
}

interface TaskListProps {
  tasks: TaskWithSubTasks[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const { t } = useTranslation();
  if (tasks.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>{t.tasks.noTasks}</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}

function TaskItem({ task }: { task: TaskWithSubTasks }) {
  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubTasks = task.subTasks && task.subTasks.length > 0;

  const priorityColors: Record<number, string> = {
    1: 'text-red-600 border-red-600',
    2: 'text-orange-500 border-orange-500',
    3: 'text-blue-500 border-blue-500',
    4: 'text-gray-400 border-gray-400',
  };

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTask(task.id, !task.completed);
    });
  };

  const handleDelete = () => {
    if (confirm('정말 이 작업을 삭제하시겠습니까?')) {
      startTransition(async () => {
        await deleteTask(task.id);
      });
    }
  };

  // Helper to check if task has specific time set (not 00:00:00 default)
  const hasTime = (date: Date) => {
    return date.getHours() !== 0 || date.getMinutes() !== 0;
  };

  const formatDate = (date: Date) => format(date, 'yyyyMMdd');
  const formatTime = (date: Date) => format(date, 'HH:mm');

  return (
    <div className="space-y-1">
      <div
        className={`group flex gap-2 rounded-lg border-b border-gray-100 p-2 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 ${isPending ? 'opacity-50' : ''}`}
      >
        {hasSubTasks && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            {isExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>
        )}
        {!hasSubTasks && <div className="w-[14px]" />}{' '}
        {/* Spacer for alignment */}
        <button
          onClick={handleToggle}
          className="mt-0.5 flex-shrink-0 transition-transform active:scale-90"
        >
          {task.completed ? (
            <CheckCircle2 size={18} className="fill-gray-400 text-gray-400" />
          ) : (
            <Circle
              size={18}
              className={priorityColors[task.priority] || priorityColors[4]}
            />
          )}
        </button>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`break-words text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : ''}`}
            >
              {task.title}
            </h3>
            <button
              onClick={handleDelete}
              className="flex-shrink-0 p-1 text-gray-400 opacity-0 transition-all hover:text-red-500 group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {task.description && (
            <p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
              {task.description}
            </p>
          )}

          <div className="mt-1 flex flex-wrap items-center gap-2">
            {(task.startDate || task.endDate) && (
              <div className="flex items-center gap-1 rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                <Calendar size={10} />
                {task.startDate && (
                  <span>
                    {formatDate(new Date(task.startDate))}
                    {hasTime(new Date(task.startDate)) &&
                      ` ${formatTime(new Date(task.startDate))}`}
                  </span>
                )}
                {task.startDate && task.endDate && ' - '}
                {task.endDate && (
                  <span>
                    {formatDate(new Date(task.endDate))}
                    {hasTime(new Date(task.endDate)) &&
                      ` ${formatTime(new Date(task.endDate))}`}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SubTasks (Recursive) */}
      {hasSubTasks && isExpanded && (
        <div className="ml-3 border-l-2 border-gray-100 pl-6 dark:border-gray-800">
          {task.subTasks!.map((subTask) => (
            <TaskItem key={subTask.id} task={subTask} />
          ))}
        </div>
      )}
    </div>
  );
}
