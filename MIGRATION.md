# Migration Guide: Base44 to Supabase + YouTube API

This document outlines the changes made during the migration from Base44 to Supabase and YouTube API integration.

## 📁 Files Changed

### Removed
- `src/api/base44Client.js` → Renamed to `supabaseClient.js`

### Modified
- `src/api/entities.js` - Complete rewrite for Supabase
- `src/api/integrations.js` - Replaced Base44 integrations with Supabase + YouTube
- `package.json` - Updated name and removed Base44 dependency
- `README.md` - Updated documentation

### Added
- `src/api/supabaseClient.js` - Supabase client configuration
- `src/api/youtubeClient.js` - YouTube API client
- `src/hooks/useAuth.jsx` - Authentication hook for Supabase
- `src/hooks/useYouTube.jsx` - YouTube API hooks
- `src/hooks/useSupabase.jsx` - Database operation hooks
- `database-schema.sql` - Database schema for Supabase
- `.env.example` - Environment variables template

## 🔄 API Changes

### Before (Base44)
```javascript
import { base44 } from './base44Client';

// Entity operations
const keyword = await base44.entities.Keyword.create(data);
const artists = await base44.entities.TrendingArtist.getAll();

// Auth
const user = await base44.auth.getCurrentUser();

// Integrations
await base44.integrations.Core.InvokeLLM(prompt);
```

### After (Supabase + YouTube)
```javascript
import { supabase } from './supabaseClient';
import { Keyword, TrendingArtist, User } from './entities';
import { YouTube } from './integrations';

// Entity operations
const keyword = await Keyword.create(data);
const artists = await TrendingArtist.getAll();

// Auth
const user = await User.getCurrentUser();

// YouTube integration
const videos = await YouTube.searchMusicVideos('trending music');
```

## 🗄️ Database Migration

Your new Supabase database includes these tables:

1. **user_profiles** - Extended user information
2. **keywords** - Music keyword tracking
3. **trending_artists** - Artist performance data
4. **video_analytics** - YouTube video metrics
5. **keyword_tracking** - Historical keyword performance
6. **user_saved_items** - User bookmarks

Run the SQL commands in `database-schema.sql` to set up your database.

## 🔑 Environment Variables

Update your environment variables:

```env
# Old Base44 config (remove these)
# VITE_BASE44_APP_ID=...

# New Supabase config
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# YouTube API
VITE_YOUTUBE_API_KEY=your-youtube-api-key
```

## 🛠️ Component Updates Needed

You'll need to update your React components to use the new hooks:

### Authentication
```javascript
// Old
import { User } from '../api/entities';

// New
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, signIn, signOut } = useAuth();
  // ...
}
```

### Data Fetching
```javascript
// Old
const [keywords, setKeywords] = useState([]);
useEffect(() => {
  Keyword.getAll().then(setKeywords);
}, []);

// New
import { useKeywords } from '../hooks/useSupabase';

function MyComponent() {
  const { keywords, loading, error } = useKeywords(user?.id);
  // ...
}
```

### YouTube Integration
```javascript
// New feature
import { useYouTubeSearch } from '../hooks/useYouTube';

function VideoSearch() {
  const { results, loading, searchVideos } = useYouTubeSearch();
  
  const handleSearch = async (query) => {
    await searchVideos(query);
  };
  // ...
}
```

## 📊 New Features Available

### YouTube API Integration
- Search music videos and channels
- Get trending music by region
- Analyze video and channel metrics
- Track collaboration opportunities

### Enhanced Analytics
- Historical keyword tracking
- Artist growth metrics
- Video performance analytics
- User bookmarking system

### Better Authentication
- Email/password authentication
- Password reset functionality
- User profile management
- Row-level security

## ⚠️ Breaking Changes

1. **Authentication State**: User state is now managed differently
2. **API Calls**: All API calls now use different syntax
3. **Error Handling**: New error handling patterns with hooks
4. **Data Structure**: Database schema is completely different

## 🚀 Next Steps

1. **Set up Supabase project** and run the database schema
2. **Get YouTube API key** from Google Cloud Console
3. **Update environment variables** with your credentials
4. **Update your components** to use new hooks and APIs
5. **Test authentication flow** with new Supabase auth
6. **Test YouTube integration** with search functionality

## 🆘 Common Issues

### Environment Variables Not Loading
- Make sure your `.env` file is in the project root
- Restart your development server after adding variables
- Variables must start with `VITE_` for Vite to include them

### Supabase Connection Issues
- Check your Supabase URL and anon key
- Ensure your project is not paused
- Verify Row Level Security policies are set up correctly

### YouTube API Quota Issues
- YouTube API has daily quotas
- Use efficient queries to minimize quota usage
- Consider implementing caching for frequently accessed data

### Database Schema Issues
- Make sure all SQL commands from `database-schema.sql` ran successfully
- Check for any constraint violations
- Verify Row Level Security policies allow your operations

## 📞 Support

If you encounter issues during migration:
1. Check the console for specific error messages
2. Verify all environment variables are set correctly
3. Test API connections individually
4. Review the database schema and policies
