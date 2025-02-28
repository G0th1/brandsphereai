# Brandsphere - Personal Brand Manager

Brandsphere is an AI-powered personal brand management platform that helps users create content, schedule posts, and analyze performance across multiple social media platforms.

## Features

- AI-generated content suggestions
- Social media post scheduling
- Performance analytics
- Multi-platform support (Twitter, LinkedIn, YouTube, TikTok)
- Connect and manage your social accounts in one place

## Tech Stack

- Vite + React
- Tailwind CSS
- Supabase (Authentication & Database)
- Recharts (for data visualization)

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file based on `.env.example` and add your Supabase credentials
4. Add your social media API credentials to the `.env` file
5. Run the development server with `npm run dev`

## Supabase Setup

1. Create a new Supabase project
2. Run the migration scripts in the `supabase/migrations` folder
3. Enable Email/Password authentication in the Auth settings
4. Copy your Supabase URL and anon key to the `.env` file

## Social Media Platform Integration

Brandsphere supports integration with multiple social media platforms. To set up platform integrations:

1. Create developer accounts on each platform you want to support:
   - Twitter (X) Developer Portal
   - LinkedIn Developer Portal
   - YouTube/Google Developer Console
   - TikTok for Developers

2. Configure OAuth applications and obtain API credentials

3. Add the credentials to your `.env` file

## Database Schema

The application uses several database tables to manage user data:

- `profiles`: User profile information
- `platform_connections`: Stored connections to social media platforms
- `content_suggestions_mvp`: AI-generated content ideas
- `scheduled_posts_mvp`: Scheduled social media posts
- `user_preferences`: User settings and preferences
- `youtube_settings`: YouTube-specific configuration
- `youtube_metrics`: YouTube analytics data

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production version
- `npm run preview` - Preview the production build locally

## License

MIT