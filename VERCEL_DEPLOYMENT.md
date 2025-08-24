# Vercel Deployment Guide for BeatNiche

This guide will help you deploy your BeatNiche application to Vercel with proper environment variable configuration.

## 🚀 Quick Deploy

### Option 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Migrate to Supabase and add YouTube API"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign up/login
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Vite project

3. **Configure Environment Variables:**
   In the Vercel dashboard, add these environment variables:
   
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_YOUTUBE_API_KEY=your_youtube_api_key
   ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy automatically

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory:**
   ```bash
   cd /Users/arvid/beatniche
   vercel
   ```

4. **Follow the prompts:**
   - What's your project name? `beatniche`
   - In which directory is your code located? `./`
   - Want to override the settings? `N`

5. **Add environment variables:**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   vercel env add VITE_YOUTUBE_API_KEY
   ```

## 📋 Environment Variables Setup

### In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables" tab
3. Add each variable for all environments (Production, Preview, Development):

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview |
| `VITE_SUPABASE_ANON_KEY` | `your_supabase_anon_key` | Production, Preview |
| `VITE_YOUTUBE_API_KEY` | `your_youtube_api_key` | Production, Preview |

### Getting Your Values:

#### Supabase URL & Key:
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy "Project URL" and "anon public" key

#### YouTube API Key:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services → Credentials
3. Copy your YouTube Data API v3 key

## 🔧 Vercel Configuration

The `vercel.json` file is already configured with optimal settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "regions": ["iad1"]
}
```

## 🌐 Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to your project
   - Navigate to "Domains" tab
   - Add your custom domain

2. **DNS Configuration:**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or A record pointing to Vercel's IP

## 🔄 Automatic Deployments

Once connected to GitHub, Vercel will automatically:
- Deploy on every push to `main` branch
- Create preview deployments for pull requests
- Run build checks and tests

## 📊 Performance Optimization

Vercel automatically provides:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Edge caching
- ✅ Image optimization
- ✅ Serverless functions (if needed)

## 🐛 Troubleshooting

### Build Fails
- Check if all dependencies are in `package.json`
- Verify build command works locally: `npm run build`
- Check Vercel build logs for specific errors

### Environment Variables Not Working
- Ensure variables start with `VITE_` prefix
- Variables are case-sensitive
- Redeploy after adding new variables

### 404 Errors on Refresh
Vite/React Router needs this in `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### API Quota Issues
- YouTube API has daily quotas
- Monitor usage in Google Cloud Console
- Implement caching to reduce API calls

## 🚀 Deployment Commands

```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel

# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Remove deployment
vercel rm [deployment-name]
```

## 📱 Preview Deployments

Every pull request gets a unique preview URL:
- Test changes before merging
- Share with team for feedback
- Automatic cleanup after merge

## 🔐 Security Best Practices

1. **Environment Variables:**
   - Never commit API keys to Git
   - Use different keys for production/development
   - Rotate keys regularly

2. **Supabase Security:**
   - Enable Row Level Security
   - Configure proper authentication policies
   - Use HTTPS only

3. **YouTube API:**
   - Restrict API key to specific domains
   - Monitor usage and quotas
   - Implement rate limiting

## 📈 Monitoring

Vercel provides built-in analytics:
- Page views and unique visitors
- Performance metrics
- Error tracking
- Real User Monitoring (RUM)

## 💰 Pricing

- **Hobby Plan (Free):**
  - 100GB bandwidth/month
  - Unlimited personal projects
  - Community support

- **Pro Plan ($20/month):**
  - 1TB bandwidth/month
  - Team collaboration
  - Advanced analytics
  - Priority support

## 🎯 Next Steps After Deployment

1. **Test your deployed app** thoroughly
2. **Set up monitoring** for API usage
3. **Configure custom domain** if needed
4. **Set up staging environment** for testing
5. **Monitor performance** and optimize as needed

## 🆘 Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- Check deployment logs for debugging

---

Your BeatNiche app is now ready for production on Vercel! 🎉
