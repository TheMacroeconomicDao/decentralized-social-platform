#!/bin/sh
set -e

# Ждём, пока база будет доступна
until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER"; do
  echo "Waiting for postgres..."
  sleep 2
done

echo "Running Prisma migrations..."
pnpm prisma migrate deploy

echo "Generating Prisma client..."
pnpm prisma generate

echo "Starting app..."
exec node dist/src/main.js 