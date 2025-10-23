// Kingston High Voting System - Sync Management
class SyncManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.syncInProgress = false;
        this.syncEndpoint = '/api/votes'; // Google Cloud App Engine endpoint
        this.init();
    }

    init() {
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateSyncStatus('online');
            this.syncVotes();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateSyncStatus('offline');
        });

        // Initial sync status
        this.updateSyncStatus(this.isOnline ? 'online' : 'offline');

        // Try to sync on load if online
        if (this.isOnline) {
            setTimeout(() => this.syncVotes(), 1000);
        }
    }

    updateSyncStatus(status) {
        const syncStatus = document.getElementById('sync-status');
        const syncText = document.getElementById('sync-text');
        
        syncStatus.className = `sync-status ${status}`;
        
        switch(status) {
            case 'online':
                syncText.textContent = 'Online';
                break;
            case 'offline':
                syncText.textContent = 'Offline';
                break;
            case 'syncing':
                syncText.textContent = 'Syncing...';
                break;
        }
    }

    async syncVotes() {
        if (!this.isOnline || this.syncInProgress) {
            return;
        }

        this.syncInProgress = true;
        this.updateSyncStatus('syncing');

        try {
            const unsyncedVotes = await voteStorage.getUnsyncedVotes();
            
            if (unsyncedVotes.length === 0) {
                this.updateSyncStatus('online');
                this.syncInProgress = false;
                return;
            }

            // In a real implementation, you would send votes to your server
            // For now, we'll simulate successful sync
            console.log(`Syncing ${unsyncedVotes.length} votes...`);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mark votes as synced
            for (const vote of unsyncedVotes) {
                await voteStorage.markVoteAsSynced(vote.id);
            }
            
            console.log('Votes synced successfully');
            this.updateSyncStatus('online');
            
        } catch (error) {
            console.error('Sync failed:', error);
            this.updateSyncStatus('offline');
        } finally {
            this.syncInProgress = false;
        }
    }

    async manualSync() {
        if (this.isOnline) {
            await this.syncVotes();
        }
    }

    // Send votes to Google Cloud server
    async sendVotesToServer(votes) {
        try {
            const response = await fetch(this.syncEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ votes })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Votes synced to Google Cloud:', result);
            return result;
        } catch (error) {
            console.error('Failed to send votes to Google Cloud:', error);
            throw error;
        }
    }
}

// Initialize sync manager
const syncManager = new SyncManager();
