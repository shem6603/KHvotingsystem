# Kingston High Voting System - Google Cloud Quick Start

## 🚀 Quick Deployment Commands

```bash
# 1. Create Google Cloud project
gcloud projects create kingston-voting-system --name="Kingston High Voting System"
gcloud config set project kingston-voting-system

# 2. Enable required APIs
gcloud services enable appengine.googleapis.com firestore.googleapis.com

# 3. Initialize App Engine
gcloud app create --region=us-central

# 4. Install dependencies
npm install

# 5. Deploy to Google Cloud
gcloud app deploy

# 6. Open your app
gcloud app browse
```

## 📁 Files Added for Google Cloud

- `app.yaml` - App Engine configuration
- `package.json` - Node.js dependencies
- `server.js` - Express server with Firestore integration
- `GOOGLE_CLOUD_DEPLOYMENT.md` - Complete deployment guide

## 🔧 What Changed

### Sync System Updated
- Now syncs to Google Cloud Firestore
- Automatic fallback to local storage if offline
- Real-time statistics from cloud database

### Admin Dashboard Enhanced
- Fetches live data from Google Cloud
- Shows real-time vote counts
- Works seamlessly with cloud sync

### Server Features
- RESTful API endpoints (`/api/votes`, `/api/stats`)
- Firestore database integration
- Security headers and CORS
- Health check endpoint

## 💰 Cost Estimate
- **Free tier**: Up to 500 students voting
- **Paid**: ~$5-7/month for larger elections
- **Firestore**: Free for 50K reads/day

## 🔒 Security
- HTTPS automatically enabled
- Content Security Policy headers
- Firestore security rules included
- No personal data stored

## 📱 Access URLs
After deployment:
- **Voting**: `https://your-project-id.appspot.com`
- **Admin**: `https://your-project-id.appspot.com/admin`
- **API**: `https://your-project-id.appspot.com/api/stats`

## 🎯 Next Steps
1. Run the quick deployment commands above
2. Configure candidate names in `index.html`
3. Test voting and admin functionality
4. Share voting URL with school computers
5. Monitor results via admin dashboard on phone

Your Kingston High Voting System is now ready for Google Cloud deployment! 🗳️
