# Production Deployment Guide

This guide covers deploying your TypeProgram application to production with MongoDB Atlas, Render (backend), and Vercel (frontend).

## Prerequisites

- MongoDB Atlas account (free tier available)
- Render account
- Vercel account
- Git repository

---

## 1. MongoDB Atlas Configuration

### Database Setup

1. **Create/Access your MongoDB Atlas cluster**
   - Your cluster should already be set up based on your confirmation

2. **Get your connection string**
   - Go to your cluster → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/`)

3. **Configure Network Access**
   - Go to "Network Access" in Atlas
   - Add IP Address: `0.0.0.0/0` (allows connections from anywhere - required for Render)
   - Or add Render's IP ranges if you prefer more security

4. **Database Access**
   - Ensure you have a database user with read/write permissions
   - Note the username and password for your connection string

---

## 2. Render Backend Deployment

### Environment Variables

In your Render dashboard, set the following environment variables:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=typeprogram
JWT_SECRET=your_secure_random_jwt_secret_here
```

**Important Notes:**
- Replace `username` and `password` in `MONGO_URI` with your actual MongoDB credentials
- Replace `cluster` with your actual cluster name
- Use a strong, random string for `JWT_SECRET` (you can generate one using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `PORT` is automatically set by Render, no need to configure it

### Deployment Settings

- **Build Command**: `npm install`
- **Start Command**: `node index.js`
- **Environment**: Node

### CORS Configuration

✅ **Already configured!** Your backend now accepts requests from:
- `http://localhost:3000` (local development)
- `http://localhost:5173` (local Vite dev)
- `https://type-program.vercel.app` (production frontend)

---

## 3. Vercel Frontend Deployment

### Environment Variables

In your Vercel project settings, configure:

```
REACT_APP_API_URL=https://typeprogram.onrender.com
```

Or if using Vite:

```
VITE_API_URL=https://typeprogram.onrender.com
```

### Deployment

Vercel should automatically deploy when you push to your main branch.

---

## 4. Verification Steps

### Test Backend API

1. **Health Check** (if you have one):
   ```bash
   curl https://typeprogram.onrender.com/
   ```

2. **Test User Endpoint**:
   ```bash
   curl https://typeprogram.onrender.com/api/auth/users
   ```

### Test Frontend

1. Visit `https://type-program.vercel.app`
2. Try registering a new user
3. Try logging in
4. Verify Socket.IO connections work for real-time features

### Common Issues

**CORS Errors:**
- Verify your frontend URL is exactly `https://type-program.vercel.app` in the backend's `allowedOrigins`
- Check browser console for specific CORS error messages

**MongoDB Connection Errors:**
- Verify `MONGO_URI` is correct in Render environment variables
- Ensure Network Access allows `0.0.0.0/0` in MongoDB Atlas
- Check that database user credentials are correct

**Socket.IO Not Connecting:**
- Ensure CORS is properly configured for Socket.IO (already done in `index.js`)
- Check that frontend is using the correct backend URL

---

## 5. Monitoring

### Render Logs
- View logs in Render dashboard to monitor backend activity
- Check for MongoDB connection success message: "MongoDB connected!"

### MongoDB Atlas Monitoring
- Monitor database connections in Atlas dashboard
- Check query performance and storage usage

---

## Environment Variables Reference

### Backend (.env)
```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=typeprogram
JWT_SECRET=your_secure_jwt_secret_here
PORT=3001  # Auto-set by Render in production
```

### Frontend
```bash
# For Create React App
REACT_APP_API_URL=https://typeprogram.onrender.com

# For Vite
VITE_API_URL=https://typeprogram.onrender.com
```

---

## Security Best Practices

1. ✅ Never commit `.env` files to Git (already gitignored)
2. ✅ Use strong, random JWT secrets
3. ✅ Use environment-specific CORS origins (already configured)
4. 🔒 Consider restricting MongoDB Network Access to specific IPs in production
5. 🔒 Regularly rotate JWT secrets and database passwords
6. 🔒 Enable MongoDB Atlas encryption at rest
7. 🔒 Use HTTPS for all production endpoints (already using)

---

## Troubleshooting

### Backend won't start on Render
- Check Render logs for error messages
- Verify all environment variables are set correctly
- Ensure `package.json` has correct start script

### Frontend can't connect to backend
- Verify CORS configuration includes your frontend URL
- Check that environment variables are set in Vercel
- Ensure backend is running (check Render dashboard)

### Database connection fails
- Verify MongoDB Atlas cluster is running
- Check Network Access settings in Atlas
- Confirm database user credentials are correct
- Test connection string locally first

---

## Next Steps

After successful deployment:
1. Set up monitoring and alerts in Render
2. Configure custom domain (optional)
3. Set up automated backups in MongoDB Atlas
4. Implement rate limiting for API endpoints
5. Add application performance monitoring (APM)
