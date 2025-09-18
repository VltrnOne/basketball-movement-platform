-- Basketball Movement Intelligence Platform Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('player', 'coach', 'analyst', 'admin');
CREATE TYPE session_type AS ENUM ('live', 'uploaded');
CREATE TYPE session_status AS ENUM ('processing', 'completed', 'failed', 'pending');
CREATE TYPE penalty_type AS ENUM ('travelling', 'double_dribble', 'defensive_three_seconds', 'charging', 'blocking', 'other');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'coach',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE public.teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    color_primary TEXT,
    color_secondary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Players table
CREATE TABLE public.players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    jersey_number INTEGER,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    position TEXT,
    height DECIMAL(5,2), -- in cm
    weight DECIMAL(5,2), -- in kg
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE public.sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    session_type session_type NOT NULL,
    video_url TEXT,
    status session_status DEFAULT 'pending',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration DECIMAL(10,2), -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Player stats table
CREATE TABLE public.player_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    minutes_played DECIMAL(5,2),
    distance_covered DECIMAL(8,2), -- in meters
    acceleration_bursts INTEGER DEFAULT 0,
    jump_count INTEGER DEFAULT 0,
    fatigue_score DECIMAL(3,1), -- 0-10 scale
    heart_rate INTEGER, -- bpm
    speed_max DECIMAL(5,2), -- km/h
    speed_avg DECIMAL(5,2), -- km/h
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Penalties table
CREATE TABLE public.penalties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    penalty_type penalty_type NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    description TEXT,
    video_timestamp DECIMAL(10,2), -- timestamp in video in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_players_team_id ON public.players(team_id);
CREATE INDEX idx_players_user_id ON public.players(user_id);
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_team_id ON public.sessions(team_id);
CREATE INDEX idx_sessions_status ON public.sessions(status);
CREATE INDEX idx_player_stats_player_id ON public.player_stats(player_id);
CREATE INDEX idx_player_stats_session_id ON public.player_stats(session_id);
CREATE INDEX idx_player_stats_timestamp ON public.player_stats(timestamp);
CREATE INDEX idx_penalties_session_id ON public.penalties(session_id);
CREATE INDEX idx_penalties_player_id ON public.penalties(player_id);
CREATE INDEX idx_penalties_timestamp ON public.penalties(timestamp);

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.penalties ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Teams are readable by all authenticated users
CREATE POLICY "Teams are viewable by authenticated users" ON public.teams
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Teams are manageable by coaches and admins" ON public.teams
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('coach', 'admin')
        )
    );

-- Players policies
CREATE POLICY "Players are viewable by team members" ON public.players
    FOR SELECT USING (
        auth.role() = 'authenticated' AND (
            user_id = auth.uid() OR
            EXISTS (
                SELECT 1 FROM public.sessions s
                WHERE s.team_id = players.team_id
                AND s.user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Players are manageable by coaches and admins" ON public.players
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('coach', 'admin')
        )
    );

-- Sessions policies
CREATE POLICY "Sessions are viewable by owner and team members" ON public.sessions
    FOR SELECT USING (
        auth.role() = 'authenticated' AND (
            user_id = auth.uid() OR
            EXISTS (
                SELECT 1 FROM public.players p
                WHERE p.team_id = sessions.team_id
                AND p.user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Sessions are manageable by owner" ON public.sessions
    FOR ALL USING (user_id = auth.uid());

-- Player stats policies
CREATE POLICY "Player stats are viewable by team members" ON public.player_stats
    FOR SELECT USING (
        auth.role() = 'authenticated' AND (
            EXISTS (
                SELECT 1 FROM public.players p
                WHERE p.id = player_stats.player_id
                AND p.user_id = auth.uid()
            ) OR
            EXISTS (
                SELECT 1 FROM public.sessions s
                WHERE s.id = player_stats.session_id
                AND s.user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Player stats are manageable by coaches and admins" ON public.player_stats
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('coach', 'admin')
        )
    );

-- Penalties policies
CREATE POLICY "Penalties are viewable by team members" ON public.penalties
    FOR SELECT USING (
        auth.role() = 'authenticated' AND (
            EXISTS (
                SELECT 1 FROM public.sessions s
                WHERE s.id = penalties.session_id
                AND s.user_id = auth.uid()
            ) OR
            EXISTS (
                SELECT 1 FROM public.players p
                WHERE p.id = penalties.player_id
                AND p.user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Penalties are manageable by coaches and admins" ON public.penalties
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('coach', 'admin')
        )
    );

-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public) VALUES ('basketball-videos', 'basketball-videos', false);

-- Storage policies for video uploads
CREATE POLICY "Users can upload videos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'basketball-videos' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can view own videos" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'basketball-videos' AND
        auth.role() = 'authenticated'
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON public.players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON public.sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO public.teams (name, color_primary, color_secondary) VALUES
('Lakers', '#552583', '#FDB927'),
('Warriors', '#1D428A', '#FFC72C'),
('Celtics', '#007A33', '#BA9653');

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        COALESCE(NEW.raw_user_meta_data->>'role', 'coach')::user_role
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
