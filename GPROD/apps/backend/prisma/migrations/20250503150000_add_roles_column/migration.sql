-- Добавляем roles столбец в таблицу User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "roles" TEXT[] DEFAULT ARRAY['user']::TEXT[]; 