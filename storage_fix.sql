-- ИСПРАВЛЕНИЕ ПРАВ ДОСТУПА (DB & Storage RLS)
-- Выполните этот код целиком в Supabase SQL Editor

-- 1. Настройка бакета для студентов
INSERT INTO storage.buckets (id, name, public) 
VALUES ('students-avatars', 'students-avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Удаляем старые политики для пересоздания (чтобы не было конфликтов)
DROP POLICY IF EXISTS "Public Access Students" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Students" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Students" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Students" ON storage.objects;

-- Новые политики для Storage (разрешаем всем для простоты, т.к. CRM учебная)
CREATE POLICY "Public Access Students" ON storage.objects FOR SELECT USING (bucket_id = 'students-avatars');
CREATE POLICY "Public Insert Students" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'students-avatars');
CREATE POLICY "Public Update Students" ON storage.objects FOR UPDATE USING (bucket_id = 'students-avatars');
CREATE POLICY "Public Delete Students" ON storage.objects FOR DELETE USING (bucket_id = 'students-avatars');

-- 2. Настройка прав для таблицы студентов (на случай, если RLS включен там)
-- Разрешаем анонимным и авторизованным пользователям всё
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for students" ON public.students;
CREATE POLICY "Allow all for students" ON public.students FOR ALL USING (true) WITH CHECK (true);

-- Также проверим TEACHERS (на всякий случай)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('teachers-avatars', 'teachers-avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Access Teachers" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Teachers" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Teachers" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Teachers" ON storage.objects;

CREATE POLICY "Public Access Teachers" ON storage.objects FOR SELECT USING (bucket_id = 'teachers-avatars');
CREATE POLICY "Public Insert Teachers" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'teachers-avatars');
CREATE POLICY "Public Update Teachers" ON storage.objects FOR UPDATE USING (bucket_id = 'teachers-avatars');
CREATE POLICY "Public Delete Teachers" ON storage.objects FOR DELETE USING (bucket_id = 'teachers-avatars');

-- Если вы видите ошибку "policy already exists", это нормально. 
-- Главное, чтобы "new row violates row-level security policy" исчезла.
