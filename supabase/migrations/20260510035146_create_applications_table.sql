/*
  # Create applications table

  1. New Tables
    - `applications`
      - `id` (uuid, primary key)
      - `discord_id` (text) - Discord user ID of the applicant
      - `discord_username` (text) - Discord username
      - `discord_avatar` (text, nullable) - Avatar URL
      - `ticket_channel_id` (text) - Discord channel ID of the ticket
      - `ticket_channel_name` (text) - Name of the ticket channel
      - `status` (text, default 'pending') - pending, accepted, rejected, closed
      - `application_content` (text, nullable) - The application message content
      - `reviewed_by` (uuid, nullable) - Member who reviewed the application
      - `reviewed_at` (timestamptz, nullable) - When it was reviewed
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `applications` table
    - Authenticated elder members can view applications
    - Authenticated elder members can update application status
    - The sync edge function uses service role key to insert/update
*/

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id text NOT NULL,
  discord_username text NOT NULL,
  discord_avatar text,
  ticket_channel_id text NOT NULL UNIQUE,
  ticket_channel_name text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'closed')),
  application_content text,
  reviewed_by uuid REFERENCES members(id),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Elder members can view applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.is_elder_member = true
    )
  );

CREATE POLICY "Elder members can update applications"
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

CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_discord_id ON applications(discord_id);
