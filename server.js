// Kingston High Voting System - Google Cloud Server
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Firestore } = require('@google-cloud/firestore');

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize Firestore
const db = new Firestore({
    projectId: process.env.GOOGLE_CLOUD_PROJECT || 'kh-voting-system'
});

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    }
}));

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// API Routes

// Get all votes
app.get('/api/votes', async (req, res) => {
    try {
        const votesSnapshot = await db.collection('votes').get();
        const votes = [];
        
        votesSnapshot.forEach(doc => {
            votes.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        res.json({ votes });
    } catch (error) {
        console.error('Error fetching votes:', error);
        res.status(500).json({ error: 'Failed to fetch votes' });
    }
});

// Submit votes (for sync)
app.post('/api/votes', async (req, res) => {
    try {
        const { votes } = req.body;
        
        if (!votes || !Array.isArray(votes)) {
            return res.status(400).json({ error: 'Invalid votes data' });
        }
        
        const batch = db.batch();
        const timestamp = new Date().toISOString();
        
        votes.forEach(vote => {
            const voteRef = db.collection('votes').doc();
            batch.set(voteRef, {
                ...vote,
                timestamp,
                synced: true
            });
        });
        
        await batch.commit();
        
        res.json({ 
            success: true, 
            message: `${votes.length} votes synced successfully`,
            timestamp 
        });
        
    } catch (error) {
        console.error('Error syncing votes:', error);
        res.status(500).json({ error: 'Failed to sync votes' });
    }
});

// Get vote statistics
app.get('/api/stats', async (req, res) => {
    try {
        const votesSnapshot = await db.collection('votes').get();
        const stats = {
            totalVotes: votesSnapshot.size,
            president: {},
            vicePresident: {},
            secretary: {}
        };
        
        votesSnapshot.forEach(doc => {
            const vote = doc.data();
            
            // Count President votes
            if (vote.president) {
                stats.president[vote.president] = (stats.president[vote.president] || 0) + 1;
            }
            
            // Count Vice President votes
            if (vote.vicePresident) {
                stats.vicePresident[vote.vicePresident] = (stats.vicePresident[vote.vicePresident] || 0) + 1;
            }
            
            // Count Secretary votes
            if (vote.secretary) {
                stats.secretary[vote.secretary] = (stats.secretary[vote.secretary] || 0) + 1;
            }
        });
        
        res.json(stats);
        
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Clear all votes (admin only)
app.delete('/api/votes', async (req, res) => {
    try {
        const votesSnapshot = await db.collection('votes').get();
        const batch = db.batch();
        
        votesSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        
        await batch.commit();
        
        res.json({ 
            success: true, 
            message: 'All votes cleared successfully' 
        });
        
    } catch (error) {
        console.error('Error clearing votes:', error);
        res.status(500).json({ error: 'Failed to clear votes' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'Kingston High Voting System'
    });
});

// Serve the main voting page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Serve the admin dashboard
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

// Start server
app.listen(PORT, () => {
    console.log(`Kingston High Voting System running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Project ID: ${process.env.GOOGLE_CLOUD_PROJECT || 'not set'}`);
});

module.exports = app;
