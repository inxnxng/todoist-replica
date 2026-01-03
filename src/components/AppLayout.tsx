import { fetchProjectsFromNotion } from '@/lib/notion';
import Sidebar from './Sidebar';
import SidebarToggle from './SidebarToggle';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = await fetchProjectsFromNotion();
  // Labels temporarily empty
  const labels: any[] = [];

  return (
    <div className="flex h-screen bg-white dark:bg-[#1f1f1f]">
      <SidebarToggle />
      <Sidebar projects={projects} labels={labels} />
      <main className="w-full flex-1 overflow-auto transition-all duration-300">
        <div className="mx-auto max-w-4xl p-4 pt-14 md:p-8 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
