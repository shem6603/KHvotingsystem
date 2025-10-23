// Kingston High Voting System - Main Voting Logic
class VotingSystem {
    constructor() {
        this.currentScreen = 'welcome';
        this.timerInterval = null;
        this.countdownSeconds = 60;
        this.init();
    }

    init() {
        this.bindEvents();
        this.showScreen('welcome');
    }

    bindEvents() {
        // Start voting button
        document.getElementById('start-voting-btn').addEventListener('click', () => {
            this.showScreen('voting');
        });

        // Back button
        document.getElementById('back-btn').addEventListener('click', () => {
            this.showScreen('welcome');
        });

        // Submit vote form
        document.getElementById('voting-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitVote();
        });

        // Manual sync button (if exists)
        const manualSyncBtn = document.getElementById('manual-sync-btn');
        if (manualSyncBtn) {
            manualSyncBtn.addEventListener('click', () => {
                syncManager.manualSync();
            });
        }
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        document.getElementById(`${screenName}-screen`).classList.add('active');
        this.currentScreen = screenName;

        // Reset form when showing voting screen
        if (screenName === 'voting') {
            document.getElementById('voting-form').reset();
        }

        // Start timer when showing thank you screen
        if (screenName === 'thank-you') {
            this.startThankYouTimer();
        }
    }

    async submitVote() {
        try {
            const formData = new FormData(document.getElementById('voting-form'));
            
            const voteData = {
                president: formData.get('president'),
                vicePresident: formData.get('vice-president'),
                secretary: formData.get('secretary')
            };

            // Validate that all positions are selected
            if (!voteData.president || !voteData.vicePresident || !voteData.secretary) {
                alert('Please select a candidate for all positions before submitting.');
                return;
            }

            // Save vote to local storage
            await voteStorage.saveVote(voteData);
            
            console.log('Vote saved:', voteData);
            
            // Show thank you screen
            this.showScreen('thank-you');
            
            // Try to sync if online
            if (syncManager.isOnline) {
                syncManager.syncVotes();
            }

        } catch (error) {
            console.error('Error submitting vote:', error);
            alert('There was an error submitting your vote. Please try again.');
        }
    }

    startThankYouTimer() {
        this.countdownSeconds = 60;
        const countdownElement = document.getElementById('countdown');
        const progressFill = document.getElementById('progress-fill');
        
        // Clear any existing timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Update display immediately
        countdownElement.textContent = this.countdownSeconds;
        progressFill.style.width = '100%';

        // Start countdown
        this.timerInterval = setInterval(() => {
            this.countdownSeconds--;
            countdownElement.textContent = this.countdownSeconds;
            
            // Update progress bar
            const progress = (this.countdownSeconds / 60) * 100;
            progressFill.style.width = `${progress}%`;

            if (this.countdownSeconds <= 0) {
                clearInterval(this.timerInterval);
                this.resetToWelcome();
            }
        }, 1000);
    }

    resetToWelcome() {
        this.showScreen('welcome');
        
        // Clear any existing timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // Method to get current vote statistics (for admin use)
    async getVoteStatistics() {
        return await voteStorage.getVoteStats();
    }

    // Method to clear all votes (for admin use)
    async clearAllVotes() {
        if (confirm('Are you sure you want to clear all votes? This action cannot be undone.')) {
            await voteStorage.clearAllVotes();
            console.log('All votes cleared');
        }
    }
}

// Initialize voting system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const votingSystem = new VotingSystem();
    
    // Make voting system globally available for admin functions
    window.votingSystem = votingSystem;
});

// Register service worker
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
