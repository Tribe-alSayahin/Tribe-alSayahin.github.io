-- منح صلاحية super_admin للبريد mwthrc23@gmail.com
-- إذا كان المستخدم موجوداً في auth.users يُضاف مباشرة إلى admin_users
-- وإذا كان موجوداً مسبقاً يُرفّع دوره إلى super_admin

do $$
declare
  target_user_id uuid;
begin
  select id
  into target_user_id
  from auth.users
  where lower(email) = 'mwthrc23@gmail.com'
  limit 1;

  if target_user_id is null then
    raise notice 'المستخدم mwthrc23@gmail.com غير موجود في auth.users بعد. يُرجى إنشاء الحساب أولاً ثم إعادة تشغيل هذا الـ migration.';
  elsif exists (
    select 1 from public.admin_users where user_id = target_user_id
  ) then
    -- تحديث الدور إن كان موجوداً مسبقاً
    update public.admin_users
    set role = 'super_admin',
        updated_at = now()
    where user_id = target_user_id;
    raise notice 'تم تحديث دور mwthrc23@gmail.com إلى super_admin.';
  else
    insert into public.admin_users (user_id, role, full_name)
    values (target_user_id, 'super_admin', 'المدير');
    raise notice 'تم إضافة mwthrc23@gmail.com كـ super_admin بنجاح.';
  end if;
end;
$$;

notify pgrst, 'reload schema';
