# Database Migrations

This directory contains database migration files for the Ultimate Focus App.

## Migration Files

### 001_initial_schema.sql
- **Purpose**: Creates the initial database schema
- **Tables**: users, sessions, tasks
- **Features**: 
  - Basic user settings and preferences
  - Session tracking for focus sessions
  - Task management with categories and priorities
  - Row Level Security (RLS) policies
  - Indexes for performance

### 002_add_projects.sql
- **Purpose**: Adds project management functionality
- **Tables**: projects (new), updates to tasks and sessions
- **Features**:
  - Project organization with status tracking
  - Task-to-project relationships
  - Pomodoro estimation and tracking
  - Project statistics view
  - Automatic project completion tracking

## How to Apply Migrations

### For New Supabase Projects

1. Run migrations in order:
   ```sql
   -- In Supabase SQL Editor, run:
   -- 1. First run 001_initial_schema.sql
   -- 2. Then run 002_add_projects.sql
   ```

### For Existing Projects

If you already have some of these tables, the migrations use `CREATE TABLE IF NOT EXISTS` and `ADD COLUMN IF NOT EXISTS` to avoid conflicts.

## Database Schema Overview

### Tables Structure

```
auth.users (Supabase built-in)
└── public.users (user settings)
    ├── public.projects (project management)
    │   └── public.tasks (tasks within projects)
    └── public.sessions (focus sessions)
        ├── → tasks (optional relationship)
        └── → projects (optional relationship)
```

### Key Features

- **Row Level Security**: All tables have RLS enabled
- **User Isolation**: Users can only access their own data
- **Foreign Key Constraints**: Maintain data integrity
- **Triggers**: Auto-update timestamps and project statistics
- **Views**: Aggregated project statistics
- **Indexes**: Optimized for common queries

## Environment Variables

Make sure to set these in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Notes

- All timestamps use `TIMESTAMPTZ` for proper timezone handling
- User preferences are stored in the `users` table
- Sessions track actual focus time spent
- Tasks can exist independently or within projects
- Project completion is automatically calculated from task completion