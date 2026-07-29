-- make-first-admin.sql
-- Run this ONCE in the Supabase SQL Editor to grant the first super-admin
-- access to the TPi Website admin panel.
--
-- Steps:
--   1. In the Supabase dashboard, go to Authentication → Users → Add user
--      and create the user with their email + password (or have them sign
--      up through any auth flow). Note the email used.
--   2. Replace 'you@example.com' below with that email.
--   3. Run this script in SQL Editor.
--   4. Log in at /admin/login.

begin;

insert into public.profiles (user_id, full_name)
select id, 'TPi Administrator'
from auth.users
where email = 'you@example.com'
on conflict (user_id) do nothing;

insert into public.admin_users (user_id, role, is_active)
select id, 'super_admin', true
from auth.users
where email = 'you@example.com'
on conflict (user_id) do update
set role = 'super_admin', is_active = true;

commit;

-- Verify:
-- select u.email, a.role, a.is_active
-- from public.admin_users a join auth.users u on u.id = a.user_id;
