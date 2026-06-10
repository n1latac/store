#!/bin/bash

# Exit immediately if any command fails
set -e

echo "🚀 Running post-deployment tasks on server..."

# ==========================================
# 🖥️ BACKEND POST-DEPLOY (NestJS)
# ==========================================
echo "--- Updating Backend ---"
# Install only production dependencies (dev dependencies are not needed on server)
npm install --omit=dev

echo "🗄️ Running database migrations..."
npx sequelize-cli db:migrate

echo "🌱 Running database seeds (unrun only)..."
npm run seed

echo "🔄 Reloading backend in PM2..."
if pm2 describe store-backend > /dev/null 2>&1; then
    pm2 reload store-backend --update-env
else
    echo "💡 process 'store-backend' not found in PM2, starting it for the first time..."
    pm2 start dist/main.js --name "store-backend" --env PORT=3001
fi

# ==========================================
# 🎨 FRONTEND POST-DEPLOY (Nuxt)
# ==========================================
# Frontend requires zero node_modules or dependencies on the server to run.
# It runs directly from the precompiled frontend/.output/ server bundle.

echo "🔄 Reloading frontend in PM2..."
if pm2 describe store-frontend > /dev/null 2>&1; then
    pm2 reload store-frontend --update-env
else
    echo "💡 process 'store-frontend' not found in PM2, starting it for the first time..."
    pm2 start frontend/.output/server/index.mjs --name "store-frontend" --env PORT=3000
fi

echo "✅ Deployment completed successfully!"
