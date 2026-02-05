-- Enable read/write access for authenticated users to all tables
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- Teachers Table
ALTER TABLE "teachers" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable ALL for authenticated users" ON "teachers";
CREATE POLICY "Enable ALL for authenticated users" ON "teachers"
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Students Table
ALTER TABLE "students" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable ALL for authenticated users" ON "students";
CREATE POLICY "Enable ALL for authenticated users" ON "students"
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Courses Table
ALTER TABLE "courses" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable ALL for authenticated users" ON "courses";
CREATE POLICY "Enable ALL for authenticated users" ON "courses"
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Groups Table
ALTER TABLE "groups" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable ALL for authenticated users" ON "groups";
CREATE POLICY "Enable ALL for authenticated users" ON "groups"
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Enrollments Table
ALTER TABLE "enrollments" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable ALL for authenticated users" ON "enrollments";
CREATE POLICY "Enable ALL for authenticated users" ON "enrollments"
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Payments Table
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable ALL for authenticated users" ON "payments";
CREATE POLICY "Enable ALL for authenticated users" ON "payments"
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
