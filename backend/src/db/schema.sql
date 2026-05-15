-- Core authentication and role-based access control (RBAC)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reference dictionary for available social services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  processing_days INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Main business entity: User applications for social services
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  id_code VARCHAR(10) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  region VARCHAR(100) NOT NULL,
  description TEXT,
  form_data JSONB DEFAULT '{}',
  status VARCHAR(30) DEFAULT 'pending' CHECK (
    status IN ('pending', 'reviewing', 'approved', 'rejected')
  ),
  ticket_id VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log for tracking application status transitions
CREATE TABLE IF NOT EXISTS status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  old_status VARCHAR(30),
  new_status VARCHAR(30) NOT NULL,
  comment TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for storing user feedback and contact messages
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial seed data for services catalog
INSERT INTO services (code, name, description, processing_days) VALUES
  ('vpo', 'Допомога ВПО', 'Реєстрація статусу та житлові програми', 10),
  ('financial', 'Фінансова підтримка', 'Одноразова фінансова допомога', 7),
  ('housing', 'Субсидія на житлово-комунальні послуги', 'Оформлення субсидії онлайн', 15),
  ('disability', 'Допомога особам з інвалідністю', 'Оформлення пільг та засобів реабілітації', 15),
  ('pension', 'Пенсійне забезпечення', 'Призначення та перерахунок пенсій', 30),
  ('family', 'Підтримка сімей з дітьми', 'Допомога при народженні та багатодітним сім''ям', 10),
  ('medical', 'Медичні пільги', 'Забезпечення ліками та санаторно-курортне лікування', 15)
ON CONFLICT (code) DO NOTHING;
