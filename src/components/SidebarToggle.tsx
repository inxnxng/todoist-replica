'use client';

import { useSettings } from '@/lib/SettingsContext';
import { Menu } from 'lucide-react';

export default function SidebarToggle() {
  const { isSidebarOpen, toggleSidebar } = useSettings();

  if (isSidebarOpen) return null;

  return (
    <div className="absolute left-4 top-4 z-50">
      <button
        onClick={toggleSidebar}
        className="rounded-md border border-gray-200 bg-white p-2 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-[#1f1f1f] dark:hover:bg-gray-800"
      >
        <Menu size={20} />
      </button>
    </div>
  );
}
