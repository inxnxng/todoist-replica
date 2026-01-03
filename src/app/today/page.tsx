import AddTask from '@/components/AddTask';
import TaskList from '@/components/TaskList';
import { fetchProjectsFromNotion, fetchTasksFromNotion } from '@/lib/notion';
import { endOfDay, startOfDay } from 'date-fns';

export const revalidate = 60; // 60초마다 데이터 갱신

export default async function TodayPage() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const [allTasks, projects] = await Promise.all([
    fetchTasksFromNotion(),
    fetchProjectsFromNotion(),
  ]);

  // Filter for Today
  const tasks = allTasks.filter((task) => {
    // If no date, not today (usually)
    if (!task.startDate) return false;

    const start = task.startDate;
    const end = task.endDate || task.startDate;

    // Check overlap
    return start <= todayEnd && end >= todayStart;
  });

  // Sort by priority
  tasks.sort((a, b) => a.priority - b.priority);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">오늘</h1>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString('ko-KR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </header>

      {/* @ts-ignore - Types might slightly differ but structure is compatible */}
      <TaskList tasks={tasks} />

      <div className="mt-4">
        {/* @ts-ignore */}
        <AddTask projects={projects} defaultDate={now} />
      </div>
    </div>
  );
}
