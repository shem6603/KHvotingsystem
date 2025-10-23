# Kingston High Voting System - Google Cloud Deployment Guide

## Overview
This guide will help you deploy the Kingston High Voting System to Google Cloud Platform using App Engine and Firestore.

## Prerequisites
- Google Cloud Platform account
- Google Cloud SDK installed locally
- Node.js 18+ installed locally

## Step 1: Set Up Google Cloud Project

### 1.1 Create a New Project
```bash
# Create a new project (replace with your project name)
gcloud projects create kingston-voting-system --name="Kingston High Voting System"

# Set the project as active
gcloud config set project kingston-voting-system

# Enable required APIs
gcloud services enable appengine.googleapis.com
gcloud services enable firestore.googleapis.com
```

### 1.2 Initialize App Engine
```bash
# Initialize App Engine in your project
gcloud app create --region=us-central
```

## Step 2: Configure Firestore Database

### 2.1 Create Firestore Database
1. Go to [Firestore Console](https://console.cloud.google.com/firestore)
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location (recommend `us-central1`)

### 2.2 Set Up Authentication (Optional)
For production use, consider setting up authentication:
```bash
# Enable Identity and Access Management API
gcloud services enable iam.googleapis.com
```

## Step 3: Deploy the Application

### 3.1 Install Dependencies
```bash
# Install Node.js dependencies
npm install
```

### 3.2 Configure Environment Variables
Create a `.env` file (optional for development):
```env
GOOGLE_CLOUD_PROJECT=kingston-voting-system
NODE_ENV=production
```

### 3.3 Deploy to App Engine
```bash
# Deploy the application
gcloud app deploy

# Deploy specific services
gcloud app deploy app.yaml
```

### 3.4 View Your Application
```bash
# Open the deployed app in browser
gcloud app browse
```

## Step 4: Configure Custom Domain (Optional)

### 4.1 Add Custom Domain
1. Go to [App Engine Console](https://console.cloud.google.com/appengine)
2. Click "Settings" → "Custom Domains"
3. Add your domain (e.g., `voting.kingstonhigh.edu`)

### 4.2 SSL Certificate
App Engine automatically provides SSL certificates for custom domains.

## Step 5: Monitor and Manage

### 5.1 View Logs
```bash
# View application logs
gcloud app logs tail -s default

# View specific service logs
gcloud app logs tail -s default --version=1
```

### 5.2 Monitor Performance
1. Go to [App Engine Console](https://console.cloud.google.com/appengine)
2. Click "Monitoring" to view metrics
3. Set up alerts for errors and performance

### 5.3 Manage Firestore Data
1. Go to [Firestore Console](https://console.cloud.google.com/firestore)
2. View vote collections and data
3. Export data if needed

## Step 6: Security Configuration

### 6.1 App Engine Security
The `app.yaml` file includes security headers via Helmet.js:
- Content Security Policy
- HTTPS enforcement
- Secure headers

### 6.2 Firestore Security Rules
Create `firestore.rules` file:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to votes collection
    match /votes/{document} {
      allow read: if true;
      allow write: if true; // For production, add authentication
    }
  }
}
```

Deploy rules:
```bash
gcloud firestore deploy firestore.rules
```

## Step 7: Testing the Deployment

### 7.1 Test Voting Interface
1. Open your deployed app URL
2. Test voting functionality
3. Verify offline capability

### 7.2 Test Admin Dashboard
1. Navigate to `/admin` on your deployed app
2. Verify real-time statistics
3. Test sync functionality

### 7.3 Test API Endpoints
```bash
# Test health endpoint
curl https://your-app-url.appspot.com/api/health

# Test stats endpoint
curl https://your-app-url.appspot.com/api/stats
```

## Step 8: Production Considerations

### 8.1 Environment Variables
Set production environment variables:
```bash
gcloud app deploy --set-env-vars NODE_ENV=production
```

### 8.2 Scaling Configuration
The `app.yaml` includes automatic scaling:
- Min instances: 1
- Max instances: 10
- Target CPU: 60%

### 8.3 Backup Strategy
1. Enable Firestore automatic backups
2. Set up Cloud Storage for data exports
3. Schedule regular data exports

## Step 9: Maintenance

### 9.1 Update Application
```bash
# Deploy new version
gcloud app deploy

# Deploy specific version
gcloud app deploy --version=v2
```

### 9.2 Rollback if Needed
```bash
# List versions
gcloud app versions list

# Rollback to previous version
gcloud app services set-traffic default --splits=previous-version=1
```

### 9.3 Monitor Costs
1. Go to [Billing Console](https://console.cloud.google.com/billing)
2. Set up billing alerts
3. Monitor App Engine and Firestore usage

## Troubleshooting

### Common Issues

#### 1. Deployment Fails
```bash
# Check logs
gcloud app logs tail -s default

# Verify project configuration
gcloud config list
```

#### 2. Firestore Connection Issues
- Verify Firestore API is enabled
- Check project ID configuration
- Ensure proper authentication

#### 3. Sync Issues
- Check network connectivity
- Verify API endpoints
- Review browser console for errors

### Support Resources
- [App Engine Documentation](https://cloud.google.com/appengine/docs)
- [Firestore Documentation](https://cloud.google.com/firestore/docs)
- [Google Cloud Support](https://cloud.google.com/support)

## Cost Estimation

### App Engine
- Free tier: 28 instance hours/day
- Paid: ~$0.05/hour per instance

### Firestore
- Free tier: 50K reads, 20K writes/day
- Paid: $0.06 per 100K reads, $0.18 per 100K writes

### Estimated Monthly Cost
For a school election with ~500 students:
- App Engine: $0-5/month
- Firestore: $0-2/month
- **Total: $0-7/month**

## Security Best Practices

1. **Enable HTTPS**: Automatically provided by App Engine
2. **Set up monitoring**: Use Cloud Monitoring
3. **Regular backups**: Enable Firestore backups
4. **Access control**: Implement proper authentication
5. **Data retention**: Set up data deletion policies

---

**Your Kingston High Voting System is now deployed on Google Cloud!**

Access your application at: `https://your-project-id.appspot.com`
Admin dashboard: `https://your-project-id.appspot.com/admin`
