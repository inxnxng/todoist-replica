import ProjectClientView from '@/components/project/ProjectClientView';
import { fetchProjectsFromNotion, fetchTasksFromNotion } from '@/lib/notion';
import { notFound } from 'next/navigation';

export const revalidate = 60; // 60초마다 데이터 갱신

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;

  // In a real implementation, we would fetch the specific project and its tasks
  // For this migration, we fetch all and filter JS side, assuming we have project linkage.
  // Since project linkage isn't fully implemented in the Notion adapter yet, this might return empty.

  const [allProjects, allTasks] = await Promise.all([
    fetchProjectsFromNotion(),
    fetchTasksFromNotion(),
  ]);

  const project = allProjects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  // Filter tasks belonging to this project
  const tasks = allTasks.filter((t) => t.projectId === id);

  return (
    <ProjectClientView project={{ ...project, tasks }} projects={allProjects} />
  );
}
