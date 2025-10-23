# Kingston High Voting System - Step-by-Step Google Cloud Deployment

## Prerequisites Checklist
- [ ] Google account (Gmail)
- [ ] Credit card for Google Cloud billing
- [ ] Computer with internet connection
- [ ] All project files ready in your `khvs` folder

---

## Step 1: Install Google Cloud SDK

### Windows (Your System)
1. **Download Google Cloud SDK**
   - Go to: https://cloud.google.com/sdk/docs/install
   - Click "Download for Windows"
   - Run the installer: `GoogleCloudSDKInstaller.exe`

2. **Verify Installation**
   - Open Command Prompt or PowerShell
   - Type: `gcloud --version`
   - You should see version information

### Alternative: Use Google Cloud Shell (Browser-based)
- Go to: https://console.cloud.google.com/
- Click the terminal icon (Cloud Shell) in the top right

---

## Step 2: Create Google Cloud Project

### 2.1 Login to Google Cloud
```bash
# Login to your Google account
gcloud auth login
```
- This will open your browser
- Sign in with your Google account
- Allow permissions

### 2.2 Create New Project
```bash
# Create project (replace with your preferred name)
gcloud projects create kingston-voting-2024 --name="Kingston High Voting System"

# Set as active project
gcloud config set project kingston-voting-2024
```

### 2.3 Enable Billing
1. Go to: https://console.cloud.google.com/billing
2. Click "Link a billing account"
3. Add your credit card
4. **Note**: You'll get $300 free credits for new accounts

---

## Step 3: Enable Required APIs

```bash
# Enable App Engine API
gcloud services enable appengine.googleapis.com

# Enable Firestore API
gcloud services enable firestore.googleapis.com

# Verify APIs are enabled
gcloud services list --enabled
```

---

## Step 4: Initialize App Engine

```bash
# Create App Engine application
gcloud app create --region=us-central

# This will ask for region - choose: us-central
```

---

## Step 5: Set Up Firestore Database

### 5.1 Create Firestore Database
1. Go to: https://console.cloud.google.com/firestore
2. Click "Create database"
3. Choose "Start in production mode"
4. Select location: **us-central1**
5. Click "Create"

### 5.2 Verify Database
- You should see "Firestore Database" in the console
- Note your project ID (you'll need this)

---

## Step 6: Prepare Your Files

### 6.1 Navigate to Your Project Folder
```bash
# Navigate to your khvs folder
cd "C:\Users\Shemmar (ITO)\Desktop\khvs"

# Verify all files are there
dir
```
You should see:
- index.html
- admin.html
- server.js
- package.json
- app.yaml
- All other files

### 6.2 Update Project ID in server.js
```bash
# Open server.js in notepad
notepad server.js
```
Find line 8 and replace `your-project-id` with your actual project ID:
```javascript
const db = new Firestore({
    projectId: 'kingston-voting-2024'  // Replace with your project ID
});
```

---

## Step 7: Install Node.js Dependencies

```bash
# Install required packages
npm install express cors helmet @google-cloud/firestore

# Verify installation
npm list
```

---

## Step 8: Test Locally (Optional)

```bash
# Start local server
npm start

# Open browser to: http://localhost:8080
# Test voting and admin functionality
# Press Ctrl+C to stop server
```

---

## Step 9: Deploy to Google Cloud

### 9.1 Deploy Application
```bash
# Deploy to App Engine
gcloud app deploy

# This will:
# - Upload all files
# - Build the application
# - Deploy to Google Cloud
# - Take 2-3 minutes
```

### 9.2 Monitor Deployment
- Watch the progress in terminal
- Wait for "Deployed service [default] to [your-url]"
- Note your app URL (e.g., `https://kingston-voting-2024.appspot.com`)

---

## Step 10: Verify Deployment

### 10.1 Open Your App
```bash
# Open deployed app in browser
gcloud app browse
```

### 10.2 Test Voting Interface
1. Go to your app URL
2. Click "Start Voting"
3. Select candidates
4. Submit vote
5. Verify thank you screen appears

### 10.3 Test Admin Dashboard
1. Go to: `https://your-project-id.appspot.com/admin`
2. Verify vote counts appear
3. Test refresh functionality

### 10.4 Test API Endpoints
```bash
# Test health endpoint
curl https://your-project-id.appspot.com/api/health

# Test stats endpoint
curl https://your-project-id.appspot.com/api/stats
```

---

## Step 11: Configure Firestore Security Rules

### 11.1 Create Security Rules File
Create file `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /votes/{document} {
      allow read, write: if true;
    }
  }
}
```

### 11.2 Deploy Security Rules
```bash
# Deploy Firestore rules
gcloud firestore deploy firestore.rules
```

---

## Step 12: Set Up Monitoring

### 12.1 View Application Logs
```bash
# View real-time logs
gcloud app logs tail -s default
```

### 12.2 Monitor in Console
1. Go to: https://console.cloud.google.com/appengine
2. Click "Monitoring" tab
3. View metrics and performance

---

## Step 13: Configure Custom Domain (Optional)

### 13.1 Add Custom Domain
1. Go to App Engine Console
2. Click "Settings" → "Custom Domains"
3. Add your domain (e.g., `voting.kingstonhigh.edu`)

### 13.2 SSL Certificate
- App Engine automatically provides SSL
- Your site will be accessible via HTTPS

---

## Step 14: Final Testing

### 14.1 Test Complete Workflow
1. **Voting**: Open app on multiple devices
2. **Offline**: Disconnect internet, test voting
3. **Sync**: Reconnect internet, verify sync
4. **Admin**: Check real-time results on phone

### 14.2 Test Admin Functions
1. Clear votes functionality
2. Refresh data
3. Manual sync
4. View statistics

---

## Step 15: Go Live!

### 15.1 Share Voting URL
- **Voting**: `https://your-project-id.appspot.com`
- **Admin**: `https://your-project-id.appspot.com/admin`

### 15.2 School Setup
1. Bookmark voting URL on all 20 computers
2. Test on each computer
3. Train teachers on admin dashboard
4. Set up monitoring for election day

---

## Troubleshooting Common Issues

### Issue: "Project not found"
```bash
# List your projects
gcloud projects list

# Set correct project
gcloud config set project YOUR-PROJECT-ID
```

### Issue: "API not enabled"
```bash
# Enable all required APIs
gcloud services enable appengine.googleapis.com firestore.googleapis.com
```

### Issue: "Deployment failed"
```bash
# Check logs
gcloud app logs tail -s default

# Redeploy
gcloud app deploy --force
```

### Issue: "Firestore connection error"
1. Verify Firestore database exists
2. Check project ID in server.js
3. Ensure APIs are enabled

---

## Success Checklist

- [ ] Google Cloud project created
- [ ] Billing enabled
- [ ] APIs enabled
- [ ] App Engine initialized
- [ ] Firestore database created
- [ ] Application deployed
- [ ] Voting interface working
- [ ] Admin dashboard working
- [ ] Offline functionality tested
- [ ] Sync functionality tested
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up

---

## Your App URLs

After successful deployment:
- **Main Voting**: `https://kingston-voting-2024.appspot.com`
- **Admin Dashboard**: `https://kingston-voting-2024.appspot.com/admin`
- **API Health**: `https://kingston-voting-2024.appspot.com/api/health`

**Congratulations! Your Kingston High Voting System is now live on Google Cloud! 🎉**
