/*
  # Create core tables for clan management system

  1. New Tables
    - `members`: Store clan member profiles with Discord data
      - `id` (uuid, primary key) - Supabase auth user ID
      - `discord_id` (text, unique) - Discord user ID
      - `discord_username` (text) - Discord username
      - `discord_avatar` (text) - Discord avatar URL
      - `quote` (text) - Member quote/bio
      - `is_elder_member` (boolean) - Elder status flag
      - `created_at` (timestamp)
    
    - `maps`: Store map/level information
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `css_skins`: Store CSS skin configurations
      - `id` (uuid, primary key)
      - `name` (text)
      - `css_code` (text)
      - `created_by` (uuid) - Reference to members
      - `created_at` (timestamp)
    
    - `applications`: Store membership applications
      - `id` (uuid, primary key)
      - `applicant_name` (text)
      - `applicant_email` (text)
      - `status` (text) - pending, approved, rejected
      - `created_at` (timestamp)
      - `reviewed_by` (uuid) - Reference to reviewing member
      - `reviewed_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Members can read all members (public profiles)
    - Members can update their own profile
    - Only elders can review applications
    - Only creators can manage their own CSS skins
*/

CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id text UNIQUE NOT NULL,
  discord_username text NOT NULL,
  discord_avatar text,
  quote text DEFAULT '',
  is_elder_member boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS maps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS css_skins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  css_code text NOT NULL,
  created_by uuid REFERENCES members(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_name text NOT NULL,
  applicant_email text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  reviewed_by uuid REFERENCES members(id) ON DELETE SET NULL,
  reviewed_at timestamptz
);

-- Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE css_skins ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Members policies
CREATE POLICY "Members are viewable by anyone"
  ON members FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own member profile"
  ON members FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Maps policies
CREATE POLICY "Maps are viewable by anyone"
  ON maps FOR SELECT
  USING (true);

CREATE POLICY "Only elders can insert maps"
  ON maps FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.is_elder_member = true
    )
  );

-- CSS Skins policies
CREATE POLICY "CSS skins are viewable by anyone"
  ON css_skins FOR SELECT
  USING (true);

CREATE POLICY "Users can create CSS skins"
  ON css_skins FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own CSS skins"
  ON css_skins FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own CSS skins"
  ON css_skins FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Applications policies
CREATE POLICY "Applications are viewable by elders only"
  ON applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.is_elder_member = true
    )
  );

CREATE POLICY "Anyone can submit applications"
  ON applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only elders can update application status"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.is_elder_member = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.is_elder_member = true
    )
  );
