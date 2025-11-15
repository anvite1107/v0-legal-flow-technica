-- Disabling RLS to allow backend inserts without key management issues
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE summaries DISABLE ROW LEVEL SECURITY;
ALTER TABLE clauses DISABLE ROW LEVEL SECURITY;

-- Allow public read/write for development
GRANT ALL ON TABLE documents TO anon, authenticated;
GRANT ALL ON TABLE summaries TO anon, authenticated;
GRANT ALL ON TABLE clauses TO anon, authenticated;
