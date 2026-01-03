# Todoist Replica Project
> A deep-dive reproduction of Todoist, focused on implementing premium features and complex data sync with Notion API.

A personal task management application built with Next.js and Tailwind CSS, featuring seamless Notion integration.

## Getting Started

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Run the development server:**

    ```bash
    npm run dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Notion Integration

This project syncs tasks and projects with Notion Databases. To get started, you need to set up two Notion Databases (Tasks and Projects) with specific properties and a relation between them.

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

**⚠️ Important: Manual Relation Setup**
After importing both CSVs, you **must** manually add a Relation property:
1.  In your **Tasks** database, add a new property named `Project`.
2.  Set the type to **Relation**.
3.  Select your **Projects** database.
4.  (Optional) Enable "Show on Projects" to see tasks within each project in Notion.

### Manual Setup

If you prefer to set up the databases manually, use the following property names and types:

**Tasks Database:**
| Property Name | Property Type | Description |
| :--- | :--- | :--- |
| **Name** | Title | The task title. |
| **Done** | Checkbox | Marks the task as completed. |
| **Priority** | Select | Options: `P1`, `P2`, `P3`, `P4`. |
| **Date** | Date | The start and end date of the task. |
| **Description** | Text (Rich Text) | Additional details about the task. |
| **Project** | Relation | Link to the Projects database. |

**Projects Database:**
| Property Name | Property Type | Description |
| :--- | :--- | :--- |
| **Name** | Title | The project name. |
| **Color** | Text (Rich Text) | The color code or name. |

### Environment Variables

You can also configure the Notion settings via a `.env` file:

```env
NOTION_API_KEY=your_secret_key
NOTION_TASK_DB_ID=your_database_id
NOTION_PROJECT_DB_ID=your_project_database_id
```
