-- Signal Scout Lite Database Schema
-- This file contains the database schema for RSS feeds, sources, and related data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create RSS feeds table
CREATE TABLE IF NOT EXISTS public.rss_feeds (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    description TEXT,
    source TEXT DEFAULT 'Manual',
    category TEXT,
    domain TEXT,
    region TEXT DEFAULT 'US',
    topic_hints TEXT[],
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    added_by TEXT,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create journalist suggestions table
CREATE TABLE IF NOT EXISTS public.journalist_suggestions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    journalist_name TEXT NOT NULL,
    substack_url TEXT NOT NULL,
    description TEXT NOT NULL,
    why_important TEXT,
    submitter_name TEXT,
    submitter_email TEXT,
    submitter_affiliation TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewer_notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create search logs table
CREATE TABLE IF NOT EXISTS public.search_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    query TEXT,
    results_count INTEGER DEFAULT 0,
    user_agent TEXT,
    ip_address TEXT,
    session_id TEXT,
    search_type TEXT DEFAULT 'general',
    filters JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create articles table for storing parsed RSS content
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    rss_feed_id UUID REFERENCES public.rss_feeds(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    content TEXT,
    author TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[],
    sentiment_score DECIMAL(3,2),
    sentiment_label TEXT CHECK (sentiment_label IN ('positive', 'negative', 'neutral')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rss_feeds_url ON public.rss_feeds(url);
CREATE INDEX IF NOT EXISTS idx_rss_feeds_status ON public.rss_feeds(status);
CREATE INDEX IF NOT EXISTS idx_rss_feeds_source ON public.rss_feeds(source);
CREATE INDEX IF NOT EXISTS idx_articles_rss_feed_id ON public.articles(rss_feed_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_sentiment ON public.articles(sentiment_label);
CREATE INDEX IF NOT EXISTS idx_search_logs_created_at ON public.search_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journalist_suggestions_status ON public.journalist_suggestions(status);

-- Enable Row Level Security
ALTER TABLE public.rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journalist_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for RSS feeds (public read, admin write)
CREATE POLICY "RSS feeds are viewable by everyone" ON public.rss_feeds
    FOR SELECT USING (status = 'active');

CREATE POLICY "RSS feeds are insertable by authenticated users" ON public.rss_feeds
    FOR INSERT WITH CHECK (true);

CREATE POLICY "RSS feeds are updatable by authenticated users" ON public.rss_feeds
    FOR UPDATE USING (true);

CREATE POLICY "RSS feeds are deletable by authenticated users" ON public.rss_feeds
    FOR DELETE USING (true);

-- RLS Policies for journalist suggestions (public insert, admin manage)
CREATE POLICY "Journalist suggestions are viewable by everyone" ON public.journalist_suggestions
    FOR SELECT USING (true);

CREATE POLICY "Journalist suggestions are insertable by everyone" ON public.journalist_suggestions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Journalist suggestions are updatable by authenticated users" ON public.journalist_suggestions
    FOR UPDATE USING (true);

-- RLS Policies for search logs (public insert, admin view)
CREATE POLICY "Search logs are insertable by everyone" ON public.search_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Search logs are viewable by authenticated users" ON public.search_logs
    FOR SELECT USING (true);

-- RLS Policies for articles (public read, admin write)
CREATE POLICY "Articles are viewable by everyone" ON public.articles
    FOR SELECT USING (true);

CREATE POLICY "Articles are insertable by authenticated users" ON public.articles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Articles are updatable by authenticated users" ON public.articles
    FOR UPDATE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_rss_feeds_updated_at BEFORE UPDATE ON public.rss_feeds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial RSS feeds data (the democracy-focused feeds from your SQL)
INSERT INTO public.rss_feeds (name, url, description, source, category, domain, region, topic_hints, added_by) VALUES
('The UnPopulist', 'https://www.theunpopulist.net/feed', 'Democracy, authoritarianism, civil liberties, and institutions', 'Substack', 'Democracy', 'www.theunpopulist.net', 'US', ARRAY['democracy','authoritarianism','civil liberties','institutions'], 'system'),
('DemocracySOS', 'https://democracysos.substack.com/feed', 'Democracy reform, elections, voting systems, and institutions', 'Substack', 'Democracy', 'democracysos.substack.com', 'US', ARRAY['democracy reform','elections','voting systems','institutions'], 'system'),
('DemocracyNext Newsletter', 'https://demnext.substack.com/feed', 'Deliberative democracy, citizens assemblies, and institutional design', 'Substack', 'Democracy', 'demnext.substack.com', 'US', ARRAY['deliberative democracy','citizens assemblies','institutional design'], 'system'),
('Democracy Notes', 'https://democracynotes.substack.com/feed', 'Voting rights, civic engagement, and elections', 'Substack', 'Democracy', 'democracynotes.substack.com', 'US', ARRAY['voting rights','civic engagement','elections'], 'system'),
('Democracy of Hope', 'https://democracyofhope.substack.com/feed', 'History of democracy, civic culture, and institutions', 'Substack', 'Democracy', 'democracyofhope.substack.com', 'US', ARRAY['history of democracy','civic culture','institutions'], 'system'),
('Democracy for Sale', 'https://democracyforsale.substack.com/feed', 'Dark money, campaign finance, and transparency', 'Substack', 'Democracy', 'democracyforsale.substack.com', 'US', ARRAY['dark money','campaign finance','transparency'], 'system'),
('The Present Age', 'https://www.readtpa.com/feed', 'Media criticism, disinformation, and democracy', 'Substack', 'Media', 'www.readtpa.com', 'US', ARRAY['media criticism','disinformation','democracy'], 'system'),
('Popular Information', 'https://popular.info/feed', 'Political accountability, money in politics, and voting rights', 'Substack', 'Investigative', 'popular.info', 'US', ARRAY['political accountability','money in politics','voting rights'], 'system'),
('Center for Democracy & Civic Engagement', 'https://cdce.substack.com/feed', 'Civic research, participation, and pro-democracy content', 'Substack', 'Research', 'cdce.substack.com', 'US', ARRAY['civic research','participation','pro-democracy'], 'system'),
('Democracy Is Hard', 'https://ruthbraunstein.substack.com/feed', 'Religion and politics, civic norms, and democracy', 'Substack', 'Democracy', 'ruthbraunstein.substack.com', 'US', ARRAY['religion and politics','civic norms','democracy'], 'system'),
('Letters from an American', 'https://heathercoxrichardson.substack.com/feed', 'US history, democracy, and institutions', 'Substack', 'History', 'heathercoxrichardson.substack.com', 'US', ARRAY['US history','democracy','institutions'], 'system'),
('America, America (Dan Rather)', 'https://america.substack.com/feed', 'Media and democracy, civic norms, and politics', 'Substack', 'Media', 'america.substack.com', 'US', ARRAY['media and democracy','civic norms','politics'], 'system')
ON CONFLICT (url) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
