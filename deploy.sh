#!/bin/bash

# Exit immediately if any command fails
set -e

# ==========================================
# ⚙️ НАСТРОЙКИ ПОДКЛЮЧЕНИЯ (Заполните ваши данные)
# ==========================================
SERVER_USER="root"                  # Имя пользователя SSH на сервере
SERVER_IP="134.122.67.1"          # IP или домен сервера
SERVER_PATH="/var/www/store" # Абсолютный путь к папке проекта на сервере

# Проверка, что пользователь ввел свои данные
if [ "$SERVER_IP" = "your_server_ip" ] || [ -z "$SERVER_IP" ]; then
    echo "❌ Ошибка: Пожалуйста, откройте файл deploy.sh и укажите IP вашего сервера в SERVER_IP!"
    exit 1
fi

echo "🚀 Начинаем локальную сборку и деплой..."

# ==========================================
# 🔨 ЛОКАЛЬНАЯ СБОРКА
# ==========================================
echo "--- Сборка Бэкенда (NestJS) ---"
npm run build

echo "--- Сборка Фронтенда (Nuxt) ---"
cd frontend
rm -rf .nuxt .output
NUXT_PUBLIC_API_BASE=https://aivixtech.com/api pnpm build
cd ..

# ==========================================
# 📤 СИНХРОНИЗАЦИЯ С СЕРВЕРОМ
# ==========================================
echo "📤 Отправка файлов на сервер через rsync..."
# Синхронизируем файлы, исключая папки зависимостей, кэш и локальные конфигурации env
rsync -avz --delete \
  --exclude='/node_modules' \
  --exclude='/frontend/node_modules' \
  --exclude='/frontend/.nuxt' \
  --exclude='/.git' \
  --exclude='/.idea' \
  --exclude='/.env' \
  --exclude='/frontend/.env' \
  ./ "$SERVER_USER@$SERVER_IP:$SERVER_PATH/"

# ==========================================
# 🖥️ ПЕРЕЗАПУСК НА СЕРВЕРЕ
# ==========================================
echo "🖥️ Запуск скрипта обновления на сервере..."
ssh "$SERVER_USER@$SERVER_IP" "cd $SERVER_PATH && chmod +x reload_server.sh && ./reload_server.sh"

echo "🎉 Деплой успешно завершен!"
