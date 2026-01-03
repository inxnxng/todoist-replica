'use client';

import { getNotionSettings } from '@/lib/settings-actions';
import { Check, Eye, EyeOff, Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotionSettings() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [taskDbId, setTaskDbId] = useState('');
  const [projectDbId, setProjectDbId] = useState('');
  const [source, setSource] = useState<'db' | 'env'>('db');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    getNotionSettings().then((data) => {
      setApiKey(data.apiKey);
      setTaskDbId(data.taskDbId);
      setProjectDbId(data.projectDbId);
      setSource(data.source as 'db' | 'env');
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // setSaving(true);
    // setSuccess(false);
    // const result = await saveNotionSettings(apiKey, taskDbId, projectDbId);
    // setSaving(false);
    // if (result.success) {
    //   setSuccess(true);
    //   setTimeout(() => setSuccess(false), 2000);
    // }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  const isEnv = source === 'env';

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {isEnv && (
        <div className="mb-2 rounded bg-blue-50 px-3 py-2 text-xs text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
          Settings are loaded from Environment Variables (.env.local). Editing
          here will not affect the active configuration.
        </div>
      )}
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notion API Key
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="secret_..."
              disabled={isEnv}
              className="w-full rounded-lg border border-gray-200 bg-transparent py-2 pl-3 pr-10 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:disabled:bg-gray-800"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Create an integration at{' '}
            <a
              href="https://www.notion.so/my-integrations"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              notion.so/my-integrations
            </a>
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tasks Database ID
          </label>
          <input
            type="text"
            value={taskDbId}
            onChange={(e) => setTaskDbId(e.target.value)}
            placeholder="32 chars ID"
            disabled={isEnv}
            className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:disabled:bg-gray-800"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Projects Database ID (Optional)
          </label>
          <input
            type="text"
            value={projectDbId}
            onChange={(e) => setProjectDbId(e.target.value)}
            placeholder="32 chars ID"
            disabled={isEnv}
            className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:disabled:bg-gray-800"
          />
        </div>
      </div>

      {!isEnv && (
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>Save Settings</span>
          </button>
          {success && (
            <span className="animate-in fade-in flex items-center gap-1 text-sm text-green-600">
              <Check size={16} />
              Saved!
            </span>
          )}
        </div>
      )}
    </form>
  );
}
