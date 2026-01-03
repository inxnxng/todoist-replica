import { Tag } from 'lucide-react';

export const revalidate = 60; // 60초마다 데이터 갱신

export default async function FiltersLabelsPage() {
  // Label support temporarily removed with Notion migration
  const labels: any[] = [];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">필터 및 라벨</h1>
      </header>

      <section>
        <h2 className="mb-4 text-sm font-semibold text-gray-500">라벨</h2>
        <div className="grid gap-2">
          {labels.length === 0 && (
            <p className="text-sm text-gray-400">라벨이 없습니다.</p>
          )}
          {labels.map((label) => (
            <div
              key={label.id}
              className="group flex items-center justify-between rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-gray-400" />
                <span>{label.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
