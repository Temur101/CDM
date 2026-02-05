-- РАЗРЕШЕНИЕ ДОСТУПА ДЛЯ ВСЕХ (Включая неавторизованных пользователей)
-- Запустите это в Supabase SQL Editor, если данные не отображаются

-- Teachers Table
ALTER TABLE "teachers" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable ALL for anyone" ON "teachers";
CREATE POLICY "Enable ALL for anyone" ON "teachers"
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Students Table
ALTER TABLE "students" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable ALL for anyone" ON "students";
CREATE POLICY "Enable ALL for anyone" ON "students"
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Courses Table
ALTER TABLE "courses" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable ALL for anyone" ON "courses";
CREATE POLICY "Enable ALL for anyone" ON "courses"
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Groups Table
ALTER TABLE "groups" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable ALL for anyone" ON "groups";
CREATE POLICY "Enable ALL for anyone" ON "groups"
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Enrollments Table
ALTER TABLE "enrollments" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable ALL for anyone" ON "enrollments";
CREATE POLICY "Enable ALL for anyone" ON "enrollments"
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Payments Table
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable ALL for anyone" ON "payments";
CREATE POLICY "Enable ALL for anyone" ON "payments"
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);
