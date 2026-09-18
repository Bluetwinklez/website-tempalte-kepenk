#!/bin/bash
# Firebase Hosting'e deploy betiği
# Kullanım: ./deploy.sh
set -e

echo "== Firebase Hosting ve Kurallar Dağıtılıyor =="
npx --yes firebase-tools@latest deploy --only firestore:rules,storage,hosting

echo "Tamamlandı!"
