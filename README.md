# Todoist Premium Personal

A personal task management application built with Next.js, Prisma, and Tailwind CSS, featuring Notion integration.

## Getting Started

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Set up the database:**

    ```bash
    npx prisma generate
    npx prisma migrate dev
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Notion Integration

This project supports syncing tasks and projects to Notion Databases. To use this feature, you need to set up Notion Databases with specific properties.

### Quick Setup (CSV Import)

The easiest way to set up your Notion Databases is to import the provided CSV templates.

**For Tasks:**

1.  Download the [`notion_task_template.csv`](./notion_task_template.csv).
2.  Import it into Notion ("Import" > "CSV").
3.  Copy the Database ID and paste it into the **Tasks Database ID** field in Settings.

**For Projects:**

1.  Download the [`notion_project_template.csv`](./notion_project_template.csv).
2.  Import it into Notion.
3.  Copy the Database ID and paste it into the **Projects Database ID** field in Settings.

### Manual Setup

**Tasks Database:**
| Property Name | Property Type | Description |
| :--- | :--- | :--- |
| **Name** | Title | The task title. |
| **Done** | Checkbox | Marks the task as completed. |
| **Priority** | Select | Options: `P1`, `P2`, `P3`, `P4`. |
| **Date** | Date | The start and end date of the task. |
| **Description** | Text (Rich Text) | Additional details about the task. |

**Projects Database:**
| Property Name | Property Type | Description |
| :--- | :--- | :--- |
| **Name** | Title | The project name. |
| **Color** | Text (Rich Text) | The color code or name. |

### Environment Variables

You can also configure the Notion settings via `.env` file for development:

```env
NOTION_API_KEY=your_secret_key
NOTION_TASK_DB_ID=your_database_id
```
