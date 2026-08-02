#!/usr/bin/env bash
#
# Create (or reset) the TPi admin account.
#
#   bash supabase/scripts/create-admin.sh [email] [password]
#
# With no arguments it uses ADMIN_EMAIL / ADMIN_PASSWORD from .env.local. The
# credentials deliberately live there rather than in this file, because this
# repository is public — a password committed here would let anyone sign into
# the live admin panel.
#
# Run it after the migrations. Safe to re-run: if the user already exists its
# password is reset and the super_admin role re-applied.
#
# Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local.

set -euo pipefail
cd "$(dirname "$0")/../.."

if [ ! -f .env.local ]; then
  echo "error: .env.local not found — copy .env.example and fill it in first." >&2
  exit 1
fi
set -a; . ./.env.local; set +a

EMAIL="${1:-${ADMIN_EMAIL:-admin@tpi.or.tz}}"
PASSWORD="${2:-${ADMIN_PASSWORD:-}}"

: "${NEXT_PUBLIC_SUPABASE_URL:?missing in .env.local}"
: "${SUPABASE_SERVICE_ROLE_KEY:?missing in .env.local}"

if [ -z "$PASSWORD" ]; then
  echo "error: no password given." >&2
  echo "  Set ADMIN_PASSWORD in .env.local, or pass one:" >&2
  echo "  bash supabase/scripts/create-admin.sh $EMAIL 'your-password'" >&2
  exit 1
fi

auth() {
  curl -sS -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
       -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
       -H "Content-Type: application/json" "$@"
}

echo "→ looking up $EMAIL"
USER_ID=$(auth "$NEXT_PUBLIC_SUPABASE_URL/auth/v1/admin/users?per_page=1000" \
  | python3 -c "
import json,sys
email = '$EMAIL'.lower()
for u in json.load(sys.stdin).get('users', []):
    if (u.get('email') or '').lower() == email:
        print(u['id']); break
")

if [ -z "$USER_ID" ]; then
  echo "→ creating auth user"
  USER_ID=$(auth -X POST "$NEXT_PUBLIC_SUPABASE_URL/auth/v1/admin/users" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"email_confirm\":true,\"user_metadata\":{\"full_name\":\"TPi Administrator\"}}" \
    | python3 -c "import json,sys; print(json.load(sys.stdin).get('id',''))")
  [ -n "$USER_ID" ] || { echo "error: could not create the user." >&2; exit 1; }
else
  echo "→ user exists, resetting password"
  auth -X PUT "$NEXT_PUBLIC_SUPABASE_URL/auth/v1/admin/users/$USER_ID" \
    -d "{\"password\":\"$PASSWORD\",\"email_confirm\":true}" > /dev/null
fi

echo "→ granting super_admin"
# PostgREST upserts through the service role, bypassing RLS.
curl -sS -o /dev/null -X POST \
  "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/admin_users?on_conflict=user_id" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  -d "{\"user_id\":\"$USER_ID\",\"role\":\"super_admin\",\"is_active\":true}"

echo
echo "Done. Sign in at /admin/login as $EMAIL"
echo "(password is the one in ADMIN_PASSWORD / the argument you passed)"
