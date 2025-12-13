-- Create PUBLIC storage bucket for images
-- This allows images to be viewed via public URLs
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do update set public = true;

-- RLS Policies for Storage
create policy "Anyone can view images"
  on storage.objects for select
  using (bucket_id = 'images');

create policy "Users can upload their own images"
  on storage.objects for insert
  with check (
    bucket_id = 'images' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own images"
  on storage.objects for delete
  using (
    bucket_id = 'images' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );
