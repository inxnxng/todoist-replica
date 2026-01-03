'use client';

import { createProject } from '@/lib/actions';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function AddProjectButton() {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createProject(name);
    setName('');
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <form onSubmit={handleSubmit} className="space-y-2 px-2 py-2">
        <input
          autoFocus
          type="text"
          placeholder="프로젝트 이름"
          className="w-full rounded border border-gray-300 bg-transparent p-1.5 text-xs dark:border-gray-600"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="rounded bg-gray-100 px-2 py-1 text-[10px] dark:bg-gray-800"
          >
            취소
          </button>
          <button
            type="submit"
            className="rounded bg-primary px-2 py-1 text-[10px] text-white"
          >
            추가
          </button>
        </div>
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="rounded p-1 opacity-0 transition-opacity hover:bg-gray-200 group-hover:opacity-100 dark:hover:bg-gray-700"
    >
      <Plus size={14} />
    </button>
  );
}
