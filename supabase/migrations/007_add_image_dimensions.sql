-- Add width and height columns to images table
alter table public.images
add column if not exists width integer,
add column if not exists height integer;

-- Create index for dimensions queries
create index if not exists images_dimensions_idx on public.images(width, height);

