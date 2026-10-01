#!/usr/bin/env bash
# Export the 14 CMS content tables from a local database.
# Admin tables (admin_users/admin_sessions) are deliberately excluded, and
# --data-only means no schema/DDL is emitted — the restore target must already
# be migrated. Output is plain INSERTs, so importing into a fresh production
# database cannot delete anything.
set -euo pipefail

SOURCE_URL="${1:?usage: export-content.sh <local-dsn> <out.sql>}"
OUT_FILE="${2:?usage: export-content.sh <local-dsn> <out.sql>}"

TABLES=(
  profiles contact_infos nav_links social_links
  skill_categories skills
  project_categories projects project_technologies
  services service_features
  experiences experience_technologies
  articles
)

args=(--data-only --no-owner --no-privileges)
for t in "${TABLES[@]}"; do args+=(--table="$t"); done

pg_dump "$SOURCE_URL" "${args[@]}" > "$OUT_FILE.raw"

# `transaction_timeout` only exists on managed Postgres (Supabase/Neon). A dump
# taken from such a host carries `SET transaction_timeout = 0`, which aborts the
# whole restore with "unrecognized configuration parameter" on a plain Postgres
# target. Strip it, plus the paired \restrict/\unrestrict psql meta-commands, so
# the same dump imports into either kind of database.
sed -e '/^SET transaction_timeout = /d' \
    -e '/^\\restrict /d' \
    -e '/^\\unrestrict /d' \
    "$OUT_FILE.raw" > "$OUT_FILE"
rm -f "$OUT_FILE.raw"

echo "Wrote $OUT_FILE ($(wc -l < "$OUT_FILE" | tr -d ' ') lines)"
