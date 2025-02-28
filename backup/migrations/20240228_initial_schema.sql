-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create platform_connections table
create table public.platform_connections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  platform text not null,
  access_token text,
  refresh_token text,
  platform_user_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, platform)
);

-- Create content_suggestions table
create table public.content_suggestions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  platform text not null,
  status text default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create scheduled_posts table
create table public.scheduled_posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content_suggestion_id uuid references public.content_suggestions(id),
  platform text not null,
  content text not null,
  scheduled_for timestamp with time zone not null,
  status text default 'scheduled' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_preferences table
create table public.user_preferences (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  theme text default 'light' not null,
  notification_email boolean default true not null,
  notification_push boolean default true not null,
  ai_content_style text default 'professional' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
alter table public.profiles enable row level security;
alter table public.platform_connections enable row level security;
alter table public.content_suggestions enable row level security;
alter table public.scheduled_posts enable row level security;
alter table public.user_preferences enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Platform connections policies
create policy "Users can view their own platform connections"
  on public.platform_connections for select
  using (auth.uid() = user_id);

create policy "Users can insert their own platform connections"
  on public.platform_connections for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own platform connections"
  on public.platform_connections for update
  using (auth.uid() = user_id);

create policy "Users can delete their own platform connections"
  on public.platform_connections for delete
  using (auth.uid() = user_id);

-- Content suggestions policies
create policy "Users can view their own content suggestions"
  on public.content_suggestions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own content suggestions"
  on public.content_suggestions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own content suggestions"
  on public.content_suggestions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own content suggestions"
  on public.content_suggestions for delete
  using (auth.uid() = user_id);

-- Scheduled posts policies
create policy "Users can view their own scheduled posts"
  on public.scheduled_posts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own scheduled posts"
  on public.scheduled_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own scheduled posts"
  on public.scheduled_posts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own scheduled posts"
  on public.scheduled_posts for delete
  using (auth.uid() = user_id);

-- User preferences policies
create policy "Users can view their own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can update their own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);

-- Create functions and triggers
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  
  insert into public.user_preferences (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 