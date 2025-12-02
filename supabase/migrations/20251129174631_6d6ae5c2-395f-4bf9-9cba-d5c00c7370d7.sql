-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('student', 'alumni', 'admin');

-- Create enum for application status
CREATE TYPE application_status AS ENUM ('submitted', 'under_review', 'selected', 'rejected');

-- Create enum for internship status
CREATE TYPE internship_status AS ENUM ('open', 'closed', 'draft');

-- Create enum for notification types
CREATE TYPE notification_type AS ENUM ('new_internship', 'deadline_alert', 'status_update', 'post_approved', 'general');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  roll_no TEXT,
  batch TEXT,
  branch TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  skills TEXT[] DEFAULT '{}',
  is_alumni_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Internships table
CREATE TABLE internships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  mode TEXT NOT NULL,
  stipend TEXT,
  deadline TIMESTAMPTZ NOT NULL,
  tags TEXT[] DEFAULT '{}',
  eligibility TEXT,
  status internship_status DEFAULT 'open',
  posted_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
  resume_url TEXT,
  cover_letter TEXT,
  status application_status DEFAULT 'submitted',
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, internship_id)
);

-- Alumni posts table
CREATE TABLE alumni_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alumni_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  rounds JSONB DEFAULT '[]',
  tips TEXT[] DEFAULT '{}',
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookmarks table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, internship_id)
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feedback table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_internships_deadline ON internships(deadline);
CREATE INDEX idx_internships_company ON internships(company);
CREATE INDEX idx_internships_status ON internships(status);
CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_internship ON applications(internship_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumni_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for internships
CREATE POLICY "Internships are viewable by authenticated users"
  ON internships FOR SELECT
  TO authenticated
  USING (status = 'open' OR posted_by = auth.uid());

CREATE POLICY "Admins can insert internships"
  ON internships FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update internships"
  ON internships FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete internships"
  ON internships FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for applications
CREATE POLICY "Students can view their own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert their own applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their own applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Admins can view all applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for alumni_posts
CREATE POLICY "Alumni can view their own posts"
  ON alumni_posts FOR SELECT
  TO authenticated
  USING (alumni_id = auth.uid());

CREATE POLICY "Approved posts are viewable by authenticated users"
  ON alumni_posts FOR SELECT
  TO authenticated
  USING (approved = true);

CREATE POLICY "Alumni can insert their own posts"
  ON alumni_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    alumni_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'alumni'
    )
  );

CREATE POLICY "Alumni can update their own posts"
  ON alumni_posts FOR UPDATE
  TO authenticated
  USING (alumni_id = auth.uid());

CREATE POLICY "Alumni can delete their own posts"
  ON alumni_posts FOR DELETE
  TO authenticated
  USING (alumni_id = auth.uid());

CREATE POLICY "Admins can view all posts"
  ON alumni_posts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all posts"
  ON alumni_posts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for bookmarks
CREATE POLICY "Students can view their own bookmarks"
  ON bookmarks FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert their own bookmarks"
  ON bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can delete their own bookmarks"
  ON bookmarks FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for feedback
CREATE POLICY "Users can insert feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_internships_updated_at
  BEFORE UPDATE ON internships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alumni_posts_updated_at
  BEFORE UPDATE ON alumni_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();