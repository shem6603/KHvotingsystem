// Kingston High Voting System - Admin Dashboard Logic
class AdminDashboard {
    constructor() {
        this.chart = null;
        this.refreshInterval = null;
        this.init();
    }

    async init() {
        await this.bindEvents();
        await this.loadData();
        this.startAutoRefresh();
    }

    bindEvents() {
        // Refresh button
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.loadData();
        });

        // Sync button
        document.getElementById('sync-btn').addEventListener('click', () => {
            syncManager.manualSync();
        });

        // Clear votes button
        document.getElementById('clear-votes-btn').addEventListener('click', () => {
            this.clearAllVotes();
        });
    }

    async loadData() {
        try {
            // Try to get stats from Google Cloud first, fallback to local storage
            let stats, allVotes, unsyncedVotes;
            
            try {
                // Fetch from Google Cloud API
                const response = await fetch('/api/stats');
                if (response.ok) {
                    stats = await response.json();
                    // For admin dashboard, we'll use cloud data
                    allVotes = []; // We don't need individual votes for admin
                    unsyncedVotes = []; // All votes are synced when using cloud
                } else {
                    throw new Error('Cloud API not available');
                }
            } catch (error) {
                console.log('Using local storage data:', error.message);
                // Fallback to local storage
                stats = await voteStorage.getVoteStats();
                allVotes = await voteStorage.getAllVotes();
                unsyncedVotes = await voteStorage.getUnsyncedVotes();
            }

            this.updateOverviewStats(stats, unsyncedVotes.length);
            this.updateResults(stats);
            this.updateRecentVotes(allVotes);
            this.updateChart(stats);
            this.updateLastUpdateTime();

        } catch (error) {
            console.error('Error loading admin data:', error);
        }
    }

    updateOverviewStats(stats, unsyncedCount) {
        document.getElementById('total-votes').textContent = stats.totalVotes;
        document.getElementById('unsynced-votes').textContent = unsyncedCount;
    }

    updateResults(stats) {
        this.updatePositionResults('president', stats.president);
        this.updatePositionResults('vice-president', stats.vicePresident);
        this.updatePositionResults('secretary', stats.secretary);
    }

    updatePositionResults(positionId, votes) {
        const container = document.getElementById(`${positionId}-results`);
        container.innerHTML = '';

        if (!votes || Object.keys(votes).length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No votes yet</p>';
            return;
        }

        // Sort candidates by vote count
        const sortedCandidates = Object.entries(votes)
            .sort(([,a], [,b]) => b - a);

        const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);

        sortedCandidates.forEach(([candidateId, voteCount], index) => {
            const candidateName = this.getCandidateName(positionId, candidateId);
            const percentage = totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(1) : 0;
            const isWinner = index === 0;

            const resultElement = document.createElement('div');
            resultElement.className = `candidate-result ${isWinner ? 'winner' : ''}`;
            
            resultElement.innerHTML = `
                <span class="candidate-name">${candidateName}</span>
                <div>
                    <span class="vote-count">${voteCount}</span>
                    <span class="vote-percentage">(${percentage}%)</span>
                </div>
            `;

            container.appendChild(resultElement);
        });
    }

    getCandidateName(position, candidateId) {
        const candidates = {
            president: {
                candidate1: 'Alex Johnson',
                candidate2: 'Sarah Williams',
                candidate3: 'Michael Brown'
            },
            'vice-president': {
                candidate1: 'Emma Davis',
                candidate2: 'James Wilson',
                candidate3: 'Olivia Martinez'
            },
            secretary: {
                candidate1: 'David Lee',
                candidate2: 'Sophia Garcia',
                candidate3: 'Ryan Taylor'
            }
        };

        return candidates[position]?.[candidateId] || candidateId;
    }

    updateRecentVotes(allVotes) {
        const container = document.getElementById('recent-votes-list');
        container.innerHTML = '';

        // Sort by timestamp (most recent first) and take last 10
        const recentVotes = allVotes
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 10);

        if (recentVotes.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No votes yet</p>';
            return;
        }

        recentVotes.forEach(vote => {
            const voteElement = document.createElement('div');
            voteElement.className = 'vote-item';
            
            const time = new Date(vote.timestamp).toLocaleTimeString();
            const selections = [
                `Pres: ${this.getCandidateName('president', vote.president)}`,
                `VP: ${this.getCandidateName('vice-president', vote.vicePresident)}`,
                `Sec: ${this.getCandidateName('secretary', vote.secretary)}`
            ].join(', ');

            voteElement.innerHTML = `
                <span class="vote-time">${time}</span>
                <span class="vote-selections">${selections}</span>
            `;

            container.appendChild(voteElement);
        });
    }

    updateChart(stats) {
        const ctx = document.getElementById('results-chart').getContext('2d');
        
        // Destroy existing chart
        if (this.chart) {
            this.chart.destroy();
        }

        const positions = ['President', 'Vice President', 'Secretary'];
        const datasets = [];

        // Create datasets for each candidate
        const candidateColors = ['#667eea', '#764ba2', '#f093fb'];
        
        Object.keys(stats).forEach((position, posIndex) => {
            if (position === 'totalVotes') return;
            
            const positionVotes = stats[position];
            if (!positionVotes || Object.keys(positionVotes).length === 0) return;

            Object.keys(positionVotes).forEach((candidateId, candidateIndex) => {
                const candidateName = this.getCandidateName(position, candidateId);
                const voteCount = positionVotes[candidateId];
                
                datasets.push({
                    label: `${positions[posIndex]}: ${candidateName}`,
                    data: [voteCount],
                    backgroundColor: candidateColors[candidateIndex % candidateColors.length],
                    borderColor: candidateColors[candidateIndex % candidateColors.length],
                    borderWidth: 1
                });
            });
        });

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Vote Counts'],
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        document.getElementById('last-update').textContent = timeString;
    }

    startAutoRefresh() {
        // Refresh data every 30 seconds
        this.refreshInterval = setInterval(() => {
            this.loadData();
        }, 30000);
    }

    async clearAllVotes() {
        if (confirm('Are you sure you want to clear all votes? This action cannot be undone.')) {
            try {
                // Try to clear from Google Cloud first
                try {
                    const response = await fetch('/api/votes', {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        await this.loadData();
                        alert('All votes have been cleared from Google Cloud.');
                        return;
                    }
                } catch (error) {
                    console.log('Cloud clear failed, using local storage:', error.message);
                }
                
                // Fallback to local storage
                await voteStorage.clearAllVotes();
                await this.loadData();
                alert('All votes have been cleared from local storage.');
                
            } catch (error) {
                console.error('Error clearing votes:', error);
                alert('Error clearing votes. Please try again.');
            }
        }
    }

    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        if (this.chart) {
            this.chart.destroy();
        }
    }
}

// Initialize admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const adminDashboard = new AdminDashboard();
    
    // Make admin dashboard globally available
    window.adminDashboard = adminDashboard;
});

// Register service worker for admin page
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
