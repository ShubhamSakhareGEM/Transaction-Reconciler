# 🚀 Deployment Guide - Transaction Reconciler

This guide covers deploying both the frontend and backend of the Transaction Reconciler application.

## 📋 Prerequisites

- GitHub account
- Render account (free tier available)
- Node.js 18+ installed locally
- Java 17+ installed locally (for backend)

## 🌐 Deployment Options

### Option 1: Render (Recommended - Free)

Render provides free hosting for both frontend and backend with automatic deployments.

#### Backend Deployment on Render

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Backend Service**
   - **Name**: `reconciler-backend`
   - **Runtime**: `Docker`
   - **Root Directory**: `backend`
   - **Build Command**: `./mvnw -q -DskipTests package || mvn -q -DskipTests package`
   - **Start Command**: `java -jar target/*SNAPSHOT.jar`

3. **Environment Variables**
   ```
   SPRING_DATASOURCE_URL=<from database>
   SPRING_DATASOURCE_USERNAME=<from database>
   SPRING_DATASOURCE_PASSWORD=<from database>
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   ```

4. **Database Setup**
   - Create a PostgreSQL database on Render
   - Name: `reconciler-db`
   - Plan: Free

#### Frontend Deployment on Render

1. **Create Static Site**
   - Go to Render Dashboard
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

2. **Configure Frontend Service**
   - **Name**: `reconciler-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

3. **Environment Variables**
   ```
   REACT_APP_API_BASE_URL=https://reconciler-backend.onrender.com
   ```

### Option 2: Vercel (Frontend Only)

For frontend deployment on Vercel:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy from Frontend Directory**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add: `REACT_APP_API_BASE_URL=https://your-backend-url.com`

### Option 3: Netlify (Frontend Only)

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Connect your GitHub repository

2. **Build Settings**
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`

3. **Environment Variables**
   - Add `REACT_APP_API_BASE_URL` in Site Settings → Environment Variables

## 🔧 Local Development Setup

### Backend
```bash
cd backend
./mvnw spring-boot:run
# Backend runs on http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm start
# Frontend runs on http://localhost:3000
```

## 🌍 Environment Configuration

### Development
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`

### Production
- Backend: `https://reconciler-backend.onrender.com`
- Frontend: `https://reconciler-frontend.onrender.com`

## 📦 Build Commands

### Frontend
```bash
# Development build
npm run build

# Production build with production API URL
npm run build:production
```

### Backend
```bash
# Development
./mvnw spring-boot:run

# Production build
./mvnw clean package -DskipTests
```

## 🔍 Testing Deployment

### Local Testing
1. Start backend: `cd backend && ./mvnw spring-boot:run`
2. Start frontend: `cd frontend && npm start`
3. Test file upload and reconciliation

### Production Testing
1. Deploy backend first
2. Update frontend environment variables with backend URL
3. Deploy frontend
4. Test end-to-end functionality

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS configuration allows frontend domain
   - Check `CorsConfig.java` in backend

2. **API Connection Issues**
   - Verify `REACT_APP_API_BASE_URL` is correct
   - Check backend is running and accessible

3. **Build Failures**
   - Ensure all dependencies are installed
   - Check Node.js and Java versions
   - Review build logs for specific errors

4. **Database Connection**
   - Verify database credentials
   - Check database is accessible from Render

### Debug Commands

```bash
# Check frontend build
cd frontend && npm run build

# Check backend build
cd backend && ./mvnw clean package

# Test API endpoints
curl https://your-backend-url.com/api/health
```

## 📊 Monitoring

### Render Dashboard
- Monitor service health
- View logs and metrics
- Check resource usage

### Application Logs
- Backend logs available in Render dashboard
- Frontend errors in browser console
- Network requests in browser dev tools

## 🔄 Continuous Deployment

The application is configured for automatic deployment:
- Push to main branch triggers deployment
- Both frontend and backend auto-deploy
- Environment variables are managed in Render dashboard

## 📝 Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Database is connected and working
- [ ] Frontend loads without errors
- [ ] File upload functionality works
- [ ] Reconciliation process completes successfully
- [ ] Results display correctly
- [ ] Mobile responsiveness works
- [ ] Error handling works properly

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review Render service logs
3. Test locally first
4. Verify environment variables
5. Check network connectivity

## 🎯 Next Steps

After successful deployment:
1. Set up custom domain (optional)
2. Configure SSL certificates (automatic on Render)
3. Set up monitoring and alerts
4. Configure backup strategies
5. Plan for scaling if needed
