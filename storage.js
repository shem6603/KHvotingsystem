// Kingston High Voting System - Storage Management
class VoteStorage {
    constructor() {
        this.dbName = 'KingstonVotingDB';
        this.dbVersion = 1;
        this.db = null;
        this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create votes store
                if (!db.objectStoreNames.contains('votes')) {
                    const votesStore = db.createObjectStore('votes', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    votesStore.createIndex('timestamp', 'timestamp', { unique: false });
                    votesStore.createIndex('synced', 'synced', { unique: false });
                }
                
                // Create sync queue store
                if (!db.objectStoreNames.contains('syncQueue')) {
                    const syncStore = db.createObjectStore('syncQueue', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    syncStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    async saveVote(voteData) {
        const transaction = this.db.transaction(['votes'], 'readwrite');
        const store = transaction.objectStore('votes');
        
        const vote = {
            ...voteData,
            timestamp: new Date().toISOString(),
            synced: false
        };
        
        return new Promise((resolve, reject) => {
            const request = store.add(vote);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllVotes() {
        const transaction = this.db.transaction(['votes'], 'readonly');
        const store = transaction.objectStore('votes');
        
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getUnsyncedVotes() {
        const transaction = this.db.transaction(['votes'], 'readonly');
        const store = transaction.objectStore('votes');
        const index = store.index('synced');
        
        return new Promise((resolve, reject) => {
            const request = index.getAll(false);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async markVoteAsSynced(voteId) {
        const transaction = this.db.transaction(['votes'], 'readwrite');
        const store = transaction.objectStore('votes');
        
        return new Promise((resolve, reject) => {
            const getRequest = store.get(voteId);
            getRequest.onsuccess = () => {
                const vote = getRequest.result;
                if (vote) {
                    vote.synced = true;
                    const putRequest = store.put(vote);
                    putRequest.onsuccess = () => resolve();
                    putRequest.onerror = () => reject(putRequest.error);
                } else {
                    reject(new Error('Vote not found'));
                }
            };
            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    async getVoteStats() {
        const votes = await this.getAllVotes();
        const stats = {
            totalVotes: votes.length,
            president: {},
            vicePresident: {},
            secretary: {}
        };

        votes.forEach(vote => {
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

        return stats;
    }

    async clearAllVotes() {
        const transaction = this.db.transaction(['votes'], 'readwrite');
        const store = transaction.objectStore('votes');
        
        return new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

// Initialize storage
const voteStorage = new VoteStorage();
