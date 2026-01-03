// Define types to replace Prisma types
export interface Task {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  priority: number;
  startDate?: Date | null;
  endDate?: Date | null;
  projectId?: string;
  subTasks?: Task[];
}

export interface Project {
  id: string;
  name: string;
  color?: string | null;
  order?: number;
}

export interface Label {
  id: string;
  name: string;
  color?: string | null;
}
