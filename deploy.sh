#!/bin/bash
# Tek komutla: Firebase Hosting'e deploy et + GitHub reposuna senkronize et.
# Kullanım: ./deploy.sh "commit mesajı (opsiyonel)"
set -e

SITE_DIR="/c/Users/Administrator/Desktop/claude/site"
REPO_DIR="/c/Users/Administrator/Desktop/emir-kepenk-sistemleri"
GH_BIN="/c/Users/Administrator/AppData/Local/Temp/gh_cli/bin/gh.exe"
COMMIT_MSG="${1:-Site güncellemesi $(date '+%Y-%m-%d %H:%M')}"

echo "== 1/3: Firebase Hosting'e deploy ediliyor =="
cd "$SITE_DIR"
export GOOGLE_APPLICATION_CREDENTIALS="$SITE_DIR/.secrets/site-deployer-key.json"
npx --yes firebase-tools@latest deploy --only hosting --project gen-lang-client-0256784982 --non-interactive

echo "== 2/3: Dosyalar GitHub reposuna kopyalanıyor =="
find "$REPO_DIR" -mindepth 1 -maxdepth 1 ! -name '.git' ! -name 'README.md' -exec rm -rf {} +
cp -r "$SITE_DIR"/. "$REPO_DIR"/
rm -rf "$REPO_DIR/.secrets" "$REPO_DIR/.firebase"

echo "== 3/3: GitHub'a commit + push ediliyor =="
cd "$REPO_DIR"
git add -A
if git diff --cached --quiet; then
  echo "Değişiklik yok, commit atlanıyor."
else
  git commit -m "$COMMIT_MSG"
  git push origin main
fi

echo "Tamamlandı: https://github.com/Bluetwinklez/emir-kepenk-sistemleri"
