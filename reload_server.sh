#!/bin/bash

# Exit immediately if any command fails
set -e

echo "🚀 Starting deployment and reload process..."

# 1. Pull the latest code from GitHub
echo "📥 Pulling latest changes from Git..."
git pull origin main

# ==========================================
# 🖥️ BACKEND DEPLOYMENT (NestJS)
# ==========================================
echo "--- Updating Backend ---"
echo "📦 Installing backend dependencies..."
npm install

echo "🔨 Building NestJS application..."
# Set memory limit to 3GB for Node process during compilation to avoid OOM
NODE_OPTIONS="--max-old-space-size=3072" npm run build

echo "🗄️ Running database migrations..."
npm run migrate

echo "🔄 Reloading backend in PM2..."
if pm2 describe store-backend > /dev/null 2>&1; then
    pm2 reload store-backend --update-env
else
    echo "💡 process 'store-backend' not found in PM2, starting it for the first time..."
    pm2 start dist/main.js --name "store-backend" --env PORT=3001
fi

# ==========================================
# 🎨 FRONTEND DEPLOYMENT (Nuxt)
# ==========================================
echo "--- Updating Frontend ---"
cd frontend

echo "📦 Installing frontend dependencies..."
pnpm install

echo "🔨 Building Nuxt application..."
# Nuxt/Vite builds are very heavy, we allocate up to 3GB of memory for compilation
NODE_OPTIONS="--max-old-space-size=3072" pnpm build

cd ..

echo "🔄 Reloading frontend in PM2..."
if pm2 describe store-frontend > /dev/null 2>&1; then
    pm2 reload store-frontend --update-env
else
    echo "💡 process 'store-frontend' not found in PM2, starting it for the first time..."
    pm2 start frontend/.output/server/index.mjs --name "store-frontend" --env PORT=3000
fi

echo "✅ All services (Backend & Frontend) successfully updated and reloaded!"
