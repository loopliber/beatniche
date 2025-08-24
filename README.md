# BeatNiche - Music Industry Analytics Platform

A modern web application for music industry professionals to discover trending keywords, analyze artist performance, and find collaboration opportunities using YouTube API and Supabase backend.

## 🚀 Features

- **Keyword Research**: Discover trending music keywords and analyze their performance
- **Artist Analytics**: Track trending artists and their social media metrics
- **YouTube Integration**: Search and analyze music videos and channels
- **Collaboration Finder**: Discover potential collaboration opportunities
- **Real-time Data**: Live data from YouTube API with Supabase storage
- **User Authentication**: Secure user management with Supabase Auth
- **Responsive Design**: Built with React and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **APIs**: YouTube Data API v3
- **UI Components**: Radix UI, Lucide React
- **State Management**: React Hooks
- **Routing**: React Router Dom

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- YouTube Data API key

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd beatniche
npm install
```

### 2. Environment Setup

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# YouTube API Configuration
VITE_YOUTUBE_API_KEY=your-youtube-api-key
```

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL commands from `database-schema.sql` to create tables and policies

### 4. Get API Keys

#### Supabase Setup:
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your URL and anon key
3. Enable Row Level Security in Authentication settings

#### YouTube API Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Restrict the key to YouTube Data API v3

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy is using Vercel:

#### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/beatniche)

#### Option 2: Manual Setup
1. **Push to GitHub** (if not already done)
2. **Connect to Vercel**: Go to [vercel.com](https://vercel.com) → Import from GitHub
3. **Set Environment Variables** in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`  
   - `VITE_YOUTUBE_API_KEY`
4. **Deploy**: Vercel will automatically build and deploy

#### Option 3: CLI Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Run deployment script
./deploy.sh

# Or deploy manually
vercel --prod
```

See `VERCEL_DEPLOYMENT.md` for detailed deployment instructions.

### Other Platforms
The app builds to static files and can be deployed to:
- Netlify
- GitHub Pages  
- AWS S3 + CloudFront
- Any static hosting service
npm run dev
```

## Building the app

```bash
npm run build
```

For more information and support, please contact Base44 support at app@base44.com.