#!/bin/sh
set -e

if [ -z "$APP_KEY" ]; then
  php artisan key:generate --force
fi

php artisan config:clear
php artisan route:clear
php artisan view:clear

php artisan migrate --force

if [ "$RUN_DB_SEED" = "true" ]; then
  php artisan db:seed --force
fi

apache2-foreground
