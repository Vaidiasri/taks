# Deployment Guide for Team Pulse on Vercel

This guide will help you deploy the Team Pulse application to Vercel.

## Prerequisites

1. A GitHub account (your code is already pushed)
2. A Vercel account (sign up at https://vercel.com)
3. MongoDB Atlas account (for database)

## Deployment Options

### Option 1: Deploy Frontend to Vercel, Backend Separately (Recommended)

This is the recommended approach for easier management and scaling.

#### Step 1: Deploy Frontend to Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Sign in with your GitHub account
   - Click "Add New Project"

2. **Import Your Repository**
   - Select the `Vaidiasri/taks` repository
   - Click "Import"

3. **Configure Frontend Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**
   Add these environment variables:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app/api
   ```
   (You'll set this after deploying the backend)

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your frontend URL (e.g., `https://team-pulse.vercel.app`)

#### Step 2: Deploy Backend to Vercel (or Railway/Render)

**Option A: Deploy Backend to Vercel**

1. **Create a New Vercel Project for Backend**
   - Click "Add New Project" again
   - Import the same repository
   - Configure:
     - **Framework Preset**: Other
     - **Root Directory**: `api`
     - **Build Command**: (leave empty)
     - **Output Directory**: (leave empty)
     - **Install Command**: `npm install`

2. **Environment Variables**
   Add these environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret_key
   FRONTEND_URL=https://your-frontend-url.vercel.app
   NODE_ENV=production
   ```

3. **Update vercel.json**
   The `api/vercel.json` file should handle the routing.

4. **Deploy**
   - Click "Deploy"
   - Note your backend URL (e.g., `https://team-pulse-api.vercel.app`)

5. **Update Frontend Environment Variable**
   - Go back to your frontend project settings
   - Update `VITE_API_URL` to your backend URL
   - Redeploy the frontend

**Option B: Deploy Backend to Railway/Render**

1. **Railway** (https://railway.app)
   - Create a new project
   - Connect your GitHub repository
   - Set root directory to `api`
   - Add environment variables:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `FRONTEND_URL`
   - Deploy

2. **Render** (https://render.com)
   - Create a new Web Service
   - Connect your GitHub repository
   - Set root directory to `api`
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variables (same as Railway)
   - Deploy

### Option 2: Deploy Both as Monorepo (Advanced)

1. **Deploy to Vercel**
   - Import your repository
   - Use the root `vercel.json` configuration
   - Set environment variables for both frontend and backend
   - Deploy

## Environment Variables Setup

### Frontend Environment Variables (Vercel)
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

### Backend Environment Variables (Vercel/Railway/Render)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_key_min_32_chars
FRONTEND_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
PORT=5000
```

## MongoDB Atlas Setup

1. **Create a MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free cluster

2. **Configure Network Access**
   - Add your IP address or `0.0.0.0/0` for all IPs (development only)

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

4. **Add to Environment Variables**
   - Add the connection string to your backend's `MONGODB_URI` environment variable

## Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Environment variables set correctly
- [ ] CORS configured to allow frontend domain
- [ ] MongoDB connection working
- [ ] Test registration/login
- [ ] Test creating questions
- [ ] Test manager dashboard (if manager account exists)

## Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in backend matches your frontend domain
- Check that CORS middleware is configured correctly

### API Not Found
- Verify `VITE_API_URL` points to correct backend URL
- Ensure backend routes are accessible at `/api/*`

### Database Connection Issues
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access settings
- Ensure IP whitelist includes Vercel's IPs (or use 0.0.0.0/0 for development)

### Build Failures
- Check that all dependencies are in `package.json`
- Verify build commands are correct
- Check Vercel build logs for specific errors

## Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update environment variables with new domain

## Continuous Deployment

Vercel automatically deploys when you push to your main branch. To deploy other branches:

1. Push to a feature branch
2. Vercel will create a preview deployment
3. Merge to main for production deployment

## Support

For issues, check:
- Vercel Documentation: https://vercel.com/docs
- Vercel Community: https://github.com/vercel/vercel/discussions

