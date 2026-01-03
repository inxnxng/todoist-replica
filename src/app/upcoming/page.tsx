import AddTask from '@/components/AddTask';
import TaskList from '@/components/TaskList';
import { fetchProjectsFromNotion, fetchTasksFromNotion } from '@/lib/notion';
import { addDays, endOfDay, format, startOfDay } from 'date-fns';
import { ko } from 'date-fns/locale';

export const revalidate = 60; // 60초마다 데이터 갱신

export default async function UpcomingPage() {
  const now = new Date();

  const [allTasks, projects] = await Promise.all([
    fetchTasksFromNotion(),
    fetchProjectsFromNotion(),
  ]);

  // Sort tasks by start date then priority
  allTasks.sort((a, b) => {
    if (a.startDate && b.startDate) {
      if (a.startDate.getTime() !== b.startDate.getTime()) {
        return a.startDate.getTime() - b.startDate.getTime();
      }
    }
    return a.priority - b.priority;
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">다음 7일</h1>
      </header>

      <div className="space-y-8">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((daysToAdd) => {
          const date = addDays(now, daysToAdd);
          const dayStart = startOfDay(date);
          const dayEnd = endOfDay(date);

          const dayTasks = allTasks.filter((task) => {
            if (!task.startDate) return false;
            // Simple overlap check or just start date check?
            // Original logic was "tasks starting or ending or spanning".
            // Let's check overlap.
            const start = task.startDate;
            const end = task.endDate || task.startDate;
            return start <= dayEnd && end >= dayStart;
          });

          return (
            <div key={daysToAdd} className="space-y-2">
              <h2 className="border-b border-gray-100 pb-2 text-sm font-bold dark:border-gray-800">
                {format(date, 'MM월 dd일 · EEEE', { locale: ko })}
              </h2>
              {/* @ts-ignore */}
              <TaskList tasks={dayTasks} />
              <div className="mt-2">
                {/* @ts-ignore */}
                <AddTask projects={projects} defaultDate={date} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
