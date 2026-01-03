'use client';

import { useSettings } from '@/lib/SettingsContext';
import { useTranslation } from '@/lib/useTranslation';
import type { Project } from '@/types';
import {
  Calendar,
  CalendarDays,
  ChevronDown,
  Hash,
  Inbox,
  Menu,
  PanelLeftClose,
  Settings,
  Tag,
} from 'lucide-react';
import Link from 'next/link';
import AddProjectButton from './AddProjectButton';

interface SidebarProps {
  projects: Project[];

  labels: any[];
}

export default function Sidebar({ projects, labels }: SidebarProps) {
  const { isSidebarOpen, toggleSidebar } = useSettings();

  const { t } = useTranslation();

  if (!isSidebarOpen) {
    return (
      <div className="absolute left-4 top-4 z-50">
        <button
          onClick={toggleSidebar}
          className="rounded-md bg-gray-100 p-2 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <Menu size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-[#faf9f8] p-4 transition-all duration-300 dark:border-gray-700 dark:bg-[#282828]">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-white">
            T
          </div>

          <span className="text-lg font-semibold">My Todoist</span>
        </Link>

        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        <NavItem
          icon={<Inbox size={18} className="text-blue-500" />}
          label={t.sidebar.inbox}
          href="/"
        />

        <NavItem
          icon={<Calendar size={18} className="text-green-500" />}
          label={t.sidebar.today}
          href="/today"
        />

        <NavItem
          icon={<CalendarDays size={18} className="text-purple-500" />}
          label={t.sidebar.upcoming}
          href="/upcoming"
        />

        <NavItem
          icon={<Hash size={18} className="text-pink-500" />}
          label={t.sidebar.weekly}
          href="/weekly-plan"
        />

        <NavItem
          icon={<Tag size={18} className="text-orange-500" />}
          label={t.sidebar.filters}
          href="/filters-labels"
        />

        <div className="mt-8">
          <div className="group mb-2 flex items-center justify-between px-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
            <div className="flex cursor-pointer items-center gap-1">
              <ChevronDown size={14} />

              <span>{t.sidebar.projects}</span>
            </div>

            <AddProjectButton />
          </div>

          <div className="space-y-0.5">
            {projects.map((project) => (
              <NavItem
                key={project.id}
                icon={<Hash size={18} className="text-gray-400" />}
                label={project.name}
                href={`/project/${project.id}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between px-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
            <span>{t.sidebar.settings}</span>
          </div>

          <NavItem
            icon={<Settings size={18} className="text-gray-500" />}
            label={t.sidebar.settings}
            href="/settings"
          />
        </div>
      </nav>
    </div>
  );
}

const NavItem = ({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) => (
  <Link
    href={href}
    className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
  >
    {icon}

    <span className="truncate">{label}</span>
  </Link>
);
