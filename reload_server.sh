#!/bin/bash

# Exit immediately if any command fails
set -e

echo "🚀 Starting deployment and reload process..."

# 1. Pull the latest code from GitHub
echo "📥 Pulling latest changes from Git..."
git pull origin main

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Build NestJS application
echo "🔨 Building NestJS application..."
npm run build

# 4. Run database migrations
echo "🗄️ Running database migrations..."
npm run migrate

# 5. Reload application in PM2
# Using 'reload' instead of 'restart' for zero-downtime reloading
# '--update-env' ensures PM2 picks up any changes in the .env file
echo "🔄 Reloading process in PM2..."
pm2 reload store-backend --update-env

echo "✅ Server successfully updated and reloaded!"
