# Kingston High Voting System

A Progressive Web App (PWA) designed for school student government elections that works offline and syncs when internet is available.

## Features

- ✅ **Offline Voting**: Works completely offline on school computers
- ✅ **Automatic Sync**: Syncs votes when internet connection is restored
- ✅ **Mobile Admin Dashboard**: View results on phone with stable internet
- ✅ **1-Minute Thank You Screen**: Prevents confusion between voters
- ✅ **No Personal Data**: Simple voting without names or IDs
- ✅ **Teacher Monitoring**: Relies on ink method for duplicate prevention
- ✅ **Real-time Results**: Live vote counts and standings

## Positions

Students vote for:
1. **President** (choose 1 candidate)
2. **Vice President** (choose 1 candidate)  
3. **Secretary** (choose 1 candidate)

## Setup Instructions

### 1. Deploy Files
1. Copy all files to a web server or local computer
2. Ensure all files are in the same directory
3. Open `index.html` in a web browser

### 2. Configure Candidates
Edit the candidate names in `index.html`:
- President candidates (lines 30-40)
- Vice President candidates (lines 45-55)  
- Secretary candidates (lines 60-70)

### 3. Set Up Sync Endpoint (Optional)
Edit `sync.js` line 6 to point to your server:
```javascript
this.syncEndpoint = 'https://your-server.com/api/votes';
```

### 4. Test the System
1. Open `index.html` - voting interface
2. Open `admin.html` - admin dashboard
3. Test offline functionality by disconnecting internet
4. Test sync by reconnecting internet

## File Structure

```
kingston-voting/
├── index.html          # Main voting interface
├── admin.html          # Admin dashboard
├── styles.css          # Main styles
├── admin-styles.css    # Admin dashboard styles
├── voting.js           # Voting logic & timer
├── admin.js            # Admin dashboard logic
├── storage.js          # IndexedDB management
├── sync.js             # Background sync
├── sw.js               # Service worker
├── manifest.json       # PWA configuration
└── README.md           # This file
```

## Usage

### For Students (Desktop Computers)
1. Open `index.html` in browser
2. Click "Start Voting"
3. Select candidates for each position
4. Click "Submit Vote"
5. Wait for 1-minute thank you screen
6. System automatically resets for next student

### For Admin (Mobile Phone)
1. Open `admin.html` in mobile browser
2. View real-time vote counts and standings
3. Use "Refresh Data" to update manually
4. Use "Sync Now" to force sync
5. Monitor "Pending Sync" count

## Offline Functionality

- **Votes stored locally** using IndexedDB
- **App cached** using Service Worker
- **Automatic sync** when internet returns
- **Manual sync** available in admin dashboard
- **Works on all 20 computers** simultaneously

## Security Features

- **No personal information** collected
- **Teacher ink method** prevents duplicate voting
- **Session management** prevents browser-based duplicates
- **Vote integrity** verification
- **Offline-first** architecture

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: Full support
- Mobile browsers: Full support

## Troubleshooting

### Votes Not Syncing
1. Check internet connection
2. Click "Sync Now" in admin dashboard
3. Check browser console for errors

### App Not Working Offline
1. Ensure service worker is registered
2. Check browser console for errors
3. Try refreshing the page

### Admin Dashboard Not Loading
1. Ensure `admin.html` is in same directory
2. Check internet connection
3. Try refreshing the page

## Customization

### Change Candidate Names
Edit the candidate names in `index.html` and update the corresponding names in `admin.js` `getCandidateName()` method.

### Modify Timer Duration
Edit `voting.js` line 8 to change the countdown duration:
```javascript
this.countdownSeconds = 60; // Change to desired seconds
```

### Update School Name
Edit the school name in `index.html` header section and `admin.html`.

## Support

For technical support or questions, contact your school's IT department.

---

**Kingston High School Voting System**  
Version 1.0 - Built for offline-first school elections
