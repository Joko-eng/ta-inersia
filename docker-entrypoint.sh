#!/bin/sh
set -e

echo "Menjalankan seed..."
tsx scripts/seed.ts

echo "Menjalankan aplikasi..."
exec node server.js