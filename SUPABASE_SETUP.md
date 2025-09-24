# Supabase Setup Guide for Signal Scout Lite

This guide will help you set up Supabase integration for Signal Scout Lite to enable real-time RSS feed data and search functionality.

## Prerequisites

1. A Supabase account (free tier available at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. Your Signal Scout Lite project

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `signal-scout-lite` (or your preferred name)
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be created (usually 1-2 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

## Step 3: Set Up Environment Variables

1. In your project root, create a `.env.local` file:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Service role key for admin operations (server-side only)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

2. Replace the placeholder values with your actual Supabase credentials

## Step 4: Set Up the Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Copy the entire contents of `supabase-schema.sql` from your project
3. Paste it into the SQL Editor
4. Click **Run** to execute the schema

This will create:
- `rss_feeds` table for storing RSS feed information
- `journalist_suggestions` table for user suggestions
- `search_logs` table for tracking searches
- `articles` table for storing parsed RSS content
- All necessary indexes and Row Level Security policies

## Step 5: Install Dependencies

Make sure you have the required packages installed:

```bash
npm install @supabase/supabase-js rss-parser
```

## Step 6: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Go to the admin panel: `http://localhost:3000/admin/login`
3. Login with: `selsi21@gmail.com` / `password1234`
4. Try adding an RSS feed
5. Click "Process All RSS Feeds" to fetch articles
6. Go to the search page and test searching

## Step 7: Initial RSS Feed Processing

After setting up the database, you'll need to populate it with articles:

1. Go to the admin dashboard
2. Click "Process All RSS Feeds" button
3. This will fetch articles from all active RSS feeds and store them in the database
4. The process may take a few minutes depending on the number of feeds

## Database Schema Overview

### RSS Feeds Table
- Stores RSS feed metadata (name, URL, description, source, etc.)
- Includes topic hints for better categorization
- Tracks feed status (active, inactive, pending)

### Articles Table
- Stores individual articles from RSS feeds
- Links to RSS feeds via foreign key
- Includes content, publication date, author, sentiment analysis
- Supports full-text search

### Journalist Suggestions Table
- Stores user-submitted journalist recommendations
- Includes approval workflow (pending, approved, rejected)
- Tracks reviewer notes and approval status

### Search Logs Table
- Logs all search queries for analytics
- Tracks result counts and user information
- Helps improve search functionality

## Row Level Security (RLS)

The database uses RLS policies to ensure:
- Public read access to active RSS feeds and articles
- Public insert access for journalist suggestions
- Admin-only access for managing feeds and suggestions
- Secure search logging

## API Endpoints

The integration provides these new API endpoints:

- `GET /api/feeds` - Get all active RSS feeds
- `POST /api/feeds` - Add a new RSS feed
- `PUT /api/feeds` - Update an RSS feed
- `DELETE /api/feeds` - Delete an RSS feed
- `POST /api/feeds/process` - Process RSS feeds to fetch articles
- `POST /api/search` - Search articles across all feeds
- `GET /api/search` - Get search statistics
- `GET /api/journalist-suggestions` - Get journalist suggestions
- `POST /api/journalist-suggestions` - Submit a journalist suggestion
- `PUT /api/journalist-suggestions` - Update suggestion status

## Troubleshooting

### Common Issues

1. **"new row violates row-level security policy"**
   - Make sure you've run the complete schema from `supabase-schema.sql`
   - Check that RLS policies are properly set up

2. **Environment variables not working**
   - Ensure `.env.local` is in your project root
   - Restart your development server after adding environment variables
   - Check that variable names match exactly (including `NEXT_PUBLIC_` prefix)

3. **RSS parsing errors**
   - Some RSS feeds may have parsing issues
   - Check the browser console and server logs for specific error messages
   - The system will continue processing other feeds even if some fail

4. **No search results**
   - Make sure RSS feeds have been processed (click "Process All RSS Feeds")
   - Check that articles exist in the database
   - Verify the search query is not too specific

### Monitoring

You can monitor your Supabase usage in the dashboard:
- **Database** → **Tables** - View your data
- **Logs** → **API** - Monitor API usage
- **Logs** → **Database** - Check for database errors

## Next Steps

1. **Set up automated RSS processing**: Consider setting up a cron job or scheduled function to regularly fetch new articles
2. **Add more RSS feeds**: Use the admin interface to add more democracy-focused news sources
3. **Monitor performance**: Keep an eye on database usage and optimize queries as needed
4. **Backup strategy**: Set up regular backups of your Supabase database

## Support

If you encounter issues:
1. Check the Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
2. Review the browser console and server logs for error messages
3. Ensure all environment variables are correctly set
4. Verify the database schema was applied successfully

The integration should now provide real-time, accurate search results from your RSS feeds!
