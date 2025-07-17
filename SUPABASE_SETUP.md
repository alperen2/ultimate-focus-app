# Supabase Setup Guide for Ultimate Focus App

This guide will help you set up Supabase authentication and database for the Ultimate Focus App.

## 🚀 Quick Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Choose your organization
4. Give your project a name (e.g., "ultimate-focus-app")
5. Set a strong database password
6. Select a region close to your users
7. Click "Create new project"

### 2. Get Your Project Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (something like `https://your-project.supabase.co`)
   - **Anon key** (public key, safe to use in frontend)
   - **Service role key** (secret key, only for server-side operations)

### 3. Configure Environment Variables

1. In your project root, copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update `.env.local` with your actual Supabase values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

### 4. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase-schema.sql`
3. Paste it into a new query and click **Run**
4. This will create all necessary tables, policies, and triggers

### 5. Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add your local development URL: `http://localhost:3000`
3. Under **Redirect URLs**, add: `http://localhost:3000/auth/callback`
4. Enable **Email confirmations** if desired
5. Configure email templates under **Auth** → **Templates**

## 📋 Database Schema Overview

The app creates the following tables:

### `users` table
Extends Supabase auth.users with app-specific settings:
- User preferences (theme, sound settings)
- Pomodoro settings (focus duration, break intervals)
- Daily goals and tracking preferences

### `sessions` table
Stores completed focus sessions:
- Task name and category
- Session duration and completion time
- User association and date tracking

### `tasks` table
Stores user's task queue:
- Task text, category, and priority
- Completion status and timestamps
- User association

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Automatic user profile creation on signup
- Secure authentication flow with email verification

## 🧪 Testing the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`
3. You should see the login form
4. Try creating a new account
5. Check your email for verification (if enabled)
6. Once logged in, you should see the main app interface

## 📝 Additional Configuration

### Email Templates (Optional)

Customize your auth emails in Supabase:
1. Go to **Authentication** → **Templates**
2. Customize the following templates:
   - Confirm signup
   - Reset password
   - Magic link

### Custom Domain (Production)

For production deployment:
1. Set up your domain in **Settings** → **Custom Domains**
2. Update Site URL and Redirect URLs accordingly
3. Update environment variables for production

## 🔧 Troubleshooting

### Common Issues

1. **"Invalid JWT" errors**
   - Check that your environment variables are correct
   - Ensure you're using the right project URL and keys

2. **RLS policy errors**
   - Verify that the SQL schema was executed completely
   - Check that all policies were created successfully

3. **Email not sending**
   - Configure SMTP settings in **Settings** → **Auth**
   - Or use Supabase's built-in email service

4. **CORS errors**
   - Add your domain to the allowed origins in Supabase settings
   - Check your Site URL configuration

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## 🎯 Next Steps

Once your setup is complete:
1. The app will automatically sync user data to Supabase
2. Sessions and tasks are saved in real-time
3. Settings are preserved across devices
4. Users can access their data from any device

Your Ultimate Focus App is now fully connected to Supabase! 🎉