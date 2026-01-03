'use server';

import { getNotionConfig } from '@/lib/notion';

export async function saveNotionSettings(
  apiKey: string,
  taskDbId: string,
  projectDbId: string,
) {
  // db -> notion
  return true;
}

export async function getNotionSettings() {
  const config = await getNotionConfig();

  return {
    apiKey: config?.apiKey || '',
    taskDbId: config?.taskDbId || '',
    projectDbId: config?.projectDbId || '',
    source: 'env.local', // Always env or hardcoded now
  };
}
