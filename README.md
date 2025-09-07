# Signal Scout Lite

A Next.js application for finding niche voices and media coverage.

## Setup Instructions

### 1. Install Dependencies
```bash

npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Setup (Optional for Demo)
- Create a Supabase project at https://supabase.com
- Copy your project URL and anon key to the `.env.local` file
- Run the SQL schema from the original scaffold file to set up your database

### 4. Run the Development Server
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Features
- **Landing page** with Google OAuth and email authentication
- **Search interface** for finding niche coverage
- **Results page** with dummy data (can be connected to real data)
- **CSV export functionality** for data analysis
- **RSS Feed Management** - Add and manage RSS feeds from various sources
- **Substack Integration** - Discover and search Substack publications
- **Sources Management** - Centralized interface for managing all your news sources
- **Responsive design** with Tailwind CSS
- **Professional corporate styling**

## RSS Feeds & Substack Integration

### RSS Feeds
- Add RSS feeds from any website or publication
- Automatic feed parsing and validation
- Persistent storage in browser localStorage
- Support for custom RSS feed URLs

### Substack Publications
- Search for Substack publications by topic or author
- Browse popular Substack publications
- Integration with RSS feeds for Substack newsletters
- Category-based organization

### How to Use
1. Go to the **Search page**
2. Click **"Manage Sources"** button
3. Add RSS feeds or search Substack publications
4. Your sources will be available for future searches

## Demo Mode
You can use the app in demo mode without setting up Supabase by clicking "Try Demo Mode" on the landing page.

