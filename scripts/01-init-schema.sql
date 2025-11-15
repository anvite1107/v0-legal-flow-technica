-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create clauses table
CREATE TABLE IF NOT EXISTS clauses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  clause_id TEXT NOT NULL,
  clause_type TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  extracted_text TEXT,
  plain_english TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Create summaries table
CREATE TABLE IF NOT EXISTS summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL UNIQUE REFERENCES documents(id) ON DELETE CASCADE,
  summary_text TEXT,
  key_points TEXT[],
  created_at TIMESTAMP DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE clauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents table
-- Allow service role to insert/update/delete (backend)
CREATE POLICY "Service role full access on documents"
ON documents FOR ALL
USING (auth.uid() IS NULL OR auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.uid() IS NULL OR auth.jwt() ->> 'role' = 'service_role');

-- Allow anon/authenticated users to read
CREATE POLICY "Public read access on documents"
ON documents FOR SELECT
USING (true);

-- RLS Policies for clauses table
CREATE POLICY "Service role full access on clauses"
ON clauses FOR ALL
USING (auth.uid() IS NULL OR auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.uid() IS NULL OR auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Public read access on clauses"
ON clauses FOR SELECT
USING (true);

-- RLS Policies for summaries table
CREATE POLICY "Service role full access on summaries"
ON summaries FOR ALL
USING (auth.uid() IS NULL OR auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.uid() IS NULL OR auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Public read access on summaries"
ON summaries FOR SELECT
USING (true);
