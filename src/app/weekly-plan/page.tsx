import WeeklyPlanView from '@/components/WeeklyPlanView';
import { fetchProjectsFromNotion, fetchTasksFromNotion } from '@/lib/notion';
import { addWeeks, eachDayOfInterval, endOfWeek, startOfWeek } from 'date-fns';

export const revalidate = 60; // 60초마다 데이터 갱신

export default async function WeeklyPlanPage() {
  const [tasks, projects] = await Promise.all([
    fetchTasksFromNotion(),
    fetchProjectsFromNotion(),
  ]);

  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(addWeeks(today, 1), { weekStartsOn: 1 }); // 2 weeks view

  const days = eachDayOfInterval({ start, end });

  return (
    <WeeklyPlanView
      tasks={tasks}
      projects={projects}
      days={days}
      startRange={start}
      endRange={end}
    />
  );
}
