import { Project, Task } from '@/types';
import { Client } from '@notionhq/client';

export async function getNotionConfig() {
  const envApiKey = process.env.NOTION_API_KEY;
  const envTaskDbId = process.env.NOTION_TASK_DB_ID;
  const envProjectDbId = process.env.NOTION_PROJECT_DB_ID;

  // Simple validation to ignore placeholders
  const isValid = (val?: string) =>
    val && !val.includes('your_database_id') && !val.includes('...');

  if (isValid(envApiKey) && isValid(envTaskDbId)) {
    return {
      apiKey: envApiKey!,
      taskDbId: envTaskDbId!,
      projectDbId: envProjectDbId,
    };
  }
  return null;
}

function mapNotionPageToTask(page: any): Task {
  const props = page.properties;

  // Date parsing
  let startDate: Date | null = null;
  let endDate: Date | null = null;
  if (props.Date?.date?.start) {
    startDate = new Date(props.Date.date.start);
    if (props.Date.date.end) {
      endDate = new Date(props.Date.date.end);
    }
  }

  // Priority parsing (P1, P2, P3, P4)
  let priority = 4;
  if (props.Priority?.select?.name) {
    const pName = props.Priority.select.name;
    if (pName === 'P1') priority = 1;
    if (pName === 'P2') priority = 2;
    if (pName === 'P3') priority = 3;
  }

  // Description parsing
  const description = props.Description?.rich_text?.[0]?.plain_text || '';

  return {
    id: page.id,
    title: props.Name?.title?.[0]?.plain_text || 'Untitled',
    description,
    completed: props.Done?.checkbox || false,
    priority,
    startDate,
    endDate,
    projectId: props.Project?.relation?.[0]?.id, // Linked Project ID
    subTasks: [], // Notion doesn't have native subtasks in this simple schema
  };
}

export async function fetchTasksFromNotion(): Promise<Task[]> {
  const config = await getNotionConfig();
  if (!config) return [];

  const notion = new Client({ auth: config.apiKey });

  try {
    const response = await notion.databases.query({
      database_id: config.taskDbId,
    });

    return response.results.map(mapNotionPageToTask);
  } catch (error) {
    console.error('Failed to fetch tasks from Notion:', error);
    return [];
  }
}

export async function createTaskInNotion(task: Omit<Task, 'id' | 'subTasks'>) {
  const config = await getNotionConfig();
  if (!config) return null;

  const notion = new Client({ auth: config.apiKey });

  try {
    const properties: any = {
      Name: { title: [{ text: { content: task.title } }] },
      Done: { checkbox: task.completed },
      Priority: { select: { name: `P${task.priority}` } },
    };

    if (task.description) {
      properties.Description = {
        rich_text: [{ text: { content: task.description } }],
      };
    }

    if (task.startDate) {
      const start = task.startDate.toISOString();
      const end = task.endDate ? task.endDate.toISOString() : null;
      properties.Date = {
        date: { start, end: start === end ? null : end },
      };
    }

    if (task.projectId) {
      properties.Project = { relation: [{ id: task.projectId }] };
    }

    const response = await notion.pages.create({
      parent: { database_id: config.taskDbId },
      properties,
    });

    return mapNotionPageToTask(response);
  } catch (error) {
    console.error('Failed to create task in Notion:', error);
    return null;
  }
}

export async function updateTaskInNotion(id: string, updates: Partial<Task>) {
  const config = await getNotionConfig();
  if (!config) return null;

  const notion = new Client({ auth: config.apiKey });

  try {
    const properties: any = {};
    if (updates.title !== undefined)
      properties.Name = { title: [{ text: { content: updates.title } }] };
    if (updates.completed !== undefined)
      properties.Done = { checkbox: updates.completed };
    if (updates.priority !== undefined)
      properties.Priority = { select: { name: `P${updates.priority}` } };
    if (updates.description !== undefined)
      properties.Description = {
        rich_text: [{ text: { content: updates.description } }],
      };

    if (updates.projectId !== undefined) {
      properties.Project = { relation: [{ id: updates.projectId }] };
    }

    // Date update logic is a bit complex, assuming if one changes, we might need both.
    // For simplicity, if startDate is provided, we update the date object.
    if (updates.startDate !== undefined || updates.endDate !== undefined) {
      // We might need to fetch the existing task to know the other date if only one is updated?
      // For now, let's assume we pass both if we update dates, or just handle what's passed.
      // Actually, simpler to just set what we have. If we want to clear it, we pass null?
      // Let's assume the caller passes the new full date range state.
      if (updates.startDate) {
        const start = updates.startDate.toISOString();
        const end = updates.endDate ? updates.endDate.toISOString() : null;
        properties.Date = { date: { start, end: start === end ? null : end } };
      } else if (updates.startDate === null) {
        properties.Date = null;
      }
    }

    const response = await notion.pages.update({
      page_id: id,
      properties,
    });
    return mapNotionPageToTask(response);
  } catch (error) {
    console.error('Failed to update task in Notion:', error);
    return null;
  }
}

export async function deleteTaskInNotion(id: string) {
  const config = await getNotionConfig();
  if (!config) return null;

  const notion = new Client({ auth: config.apiKey });

  try {
    await notion.pages.update({
      page_id: id,
      archived: true, // Notion API deletes by archiving
    });
    return true;
  } catch (error) {
    console.error('Failed to delete task in Notion:', error);
    return false;
  }
}

// --- Projects ---

function mapNotionPageToProject(page: any): Project {
  const props = page.properties;
  return {
    id: page.id,
    name: props.Name?.title?.[0]?.plain_text || 'Untitled',
    color: props.Color?.rich_text?.[0]?.plain_text || null,
  };
}

export async function fetchProjectsFromNotion(): Promise<Project[]> {
  const config = await getNotionConfig();
  if (!config || !config.projectDbId) return [];

  const notion = new Client({ auth: config.apiKey });

  try {
    const response = await notion.databases.query({
      database_id: config.projectDbId,
    });

    return response.results.map(mapNotionPageToProject);
  } catch (error) {
    console.error('Failed to fetch projects from Notion:', error);
    return [];
  }
}

export async function createProjectInNotion(name: string, color?: string) {
  const config = await getNotionConfig();
  if (!config || !config.projectDbId) return null;

  const notion = new Client({ auth: config.apiKey });

  try {
    const properties: any = {
      Name: { title: [{ text: { content: name } }] },
    };
    if (color) {
      properties.Color = { rich_text: [{ text: { content: color } }] };
    }

    const response = await notion.pages.create({
      parent: { database_id: config.projectDbId },
      properties,
    });

    return mapNotionPageToProject(response);
  } catch (error) {
    console.error('Failed to create project in Notion:', error);
    return null;
  }
}
