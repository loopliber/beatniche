#!/bin/bash

# BeatNiche Vercel Deployment Script
# This script helps you deploy your app to Vercel with proper setup

echo "🎵 BeatNiche Vercel Deployment Setup"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this from the project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
else
    echo "✅ Vercel CLI already installed"
fi

# Build the project to check for errors
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Check for environment variables
echo "🔍 Checking environment variables..."

if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found."
    echo "   Make sure to set environment variables in Vercel dashboard:"
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY"
    echo "   - VITE_YOUTUBE_API_KEY"
fi

# Login to Vercel
echo "🔐 Logging into Vercel..."
vercel login

# Deploy
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set environment variables in Vercel dashboard if not already done"
echo "2. Test your deployed application"
echo "3. Set up custom domain (optional)"
echo ""
echo "🔗 Useful commands:"
echo "   vercel --prod          # Deploy to production"
echo "   vercel                 # Deploy preview"
echo "   vercel logs            # View logs"
echo "   vercel ls              # List deployments"
echo ""
echo "Happy coding! 🎵"
