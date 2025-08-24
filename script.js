class VideoTimer {
    constructor() {
        this.subscribeButton = document.getElementById('subscribeButton');
        this.likeButton = document.getElementById('likeButton');
        this.finalWatchButton = document.getElementById('finalWatchButton');
        this.timerSection = document.getElementById('timerSection');
        this.passwordSection = document.getElementById('passwordSection');
        this.timeRemaining = document.getElementById('timeRemaining');
        this.progressFill = document.getElementById('progressFill');
        this.progressRing = document.querySelector('.progress-ring-progress');
        this.passwordValue = document.getElementById('passwordValue');
        this.copyButton = document.getElementById('copyButton');
        this.pauseNotice = document.getElementById('pauseNotice');
        
        this.totalTime = 40; // 40 seconds
        this.currentTime = this.totalTime;
        this.timer = null;
        this.finalWatchButtonClickedCount = 0; // Tracks final watch button clicks
        
        this.init();
    }
    
    init() {
        this.subscribeButton.addEventListener('click', () => this.handleSubscribeClick());
        this.likeButton.addEventListener('click', () => this.handleLikeClick());
        this.finalWatchButton.addEventListener('click', () => this.handleFinalWatchClick());
        this.copyButton.addEventListener('click', () => this.copyPassword());
        
        // Calculate circle circumference for progress ring
        const radius = 52;
        this.circumference = 2 * Math.PI * radius;
        this.progressRing.style.strokeDasharray = this.circumference;
        this.progressRing.style.strokeDashoffset = this.circumference;
        document.addEventListener('visibilitychange', () => this.onVisibilityChange());
    }

    // New method to inject the pop-under ad script
    injectPopUnderAd() {
        // Check if the script has already been added to avoid duplicates
        if (!document.querySelector('script[src*="//pl27317160.profitableratecpm.com"]')) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = '//pl27317160.profitableratecpm.com/2e/d5/0d/2ed50d8e7a4c7e301371faafd774e925.js';
            document.body.appendChild(script);
        }
    }

    handleSubscribeClick() {
        this.injectPopUnderAd(); // Ad before action
        
        window.open('https://youtube.com/@roblxmods?si=QD0aGBwgdQVg8G3P', '_blank', 'noopener,noreferrer');
        this.subscribeButton.disabled = true;
        this.likeButton.disabled = false;
        this.subscribeButton.innerHTML = '<span>Subscribed</span>';
    }

    handleLikeClick() {
        this.injectPopUnderAd(); // Ad before action
        
        window.open('https://youtu.be/glnkn2BtYfQ', '_blank', 'noopener,noreferrer');
        this.likeButton.disabled = true;
        this.finalWatchButton.disabled = false;
        this.likeButton.innerHTML = '<span>Liked</span>';
    }
    
    handleFinalWatchClick() {
        this.injectPopUnderAd(); // Ad before action for both clicks

        this.finalWatchButtonClickedCount++;

        if (this.finalWatchButtonClickedCount === 1) {
            // First click: Open only the advertisement link
            window.open('https://www.profitableratecpm.com/jxn3eb514?key=6190bee5dd50481bd84dd51bdb987985', '_blank', 'noopener,noreferrer');
            // Change button text to indicate next action
            this.finalWatchButton.innerHTML = `
                <span>Click to Watch Video</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15 3H21V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;
        } else if (this.finalWatchButtonClickedCount === 2) {
            // Second click: Open YouTube video and start timer
            window.open('https://youtu.be/glnkn2BtYfQ', '_blank', 'noopener,noreferrer');
            
            // Show timer section
            this.timerSection.classList.remove('hidden');
            this.finalWatchButton.style.display = 'none'; // Hide the button after the second click
            this.startTimer();
        }
    }
    
    ensureTimer() {
        // reflect visibility status: show notice when user is on this page
        this.toggleNotice(document.visibilityState === 'visible');
    }
    
    startTimer() {
        if (this.timer) return;
        this.timer = setInterval(() => {
            const isHidden = document.visibilityState === 'hidden';
            const isVisible = !isHidden;
            if (isHidden && this.currentTime > 0) { // Timer counts down ONLY when page is hidden (user presumably on YouTube)
                this.currentTime--; 
                this.updateDisplay(); 
            }
            this.toggleNotice(isVisible); // Show pause notice if visible
            if (this.currentTime <= 0) this.completeTimer();
        }, 1000);
        
        // Initial display update
        this.updateDisplay();
    }
    
    updateDisplay() {
        // Update time display
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        this.timeRemaining.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Update progress bar
        const progressPercent = ((this.totalTime - this.currentTime) / this.totalTime) * 100;
        this.progressFill.style.width = `${progressPercent}%`;
        
        // Update progress ring
        const offset = this.circumference - (progressPercent / 100) * this.circumference;
        this.progressRing.style.strokeDashoffset = offset;
        
        // Change color as time progresses
        if (this.currentTime <= 10) { // Last 10 seconds
            this.progressRing.style.stroke = '#FF5722';
            this.timeRemaining.style.color = '#FF5722';
        } else if (this.currentTime <= 25) { // Last 25 seconds
            this.progressRing.style.stroke = '#FF9800';
            this.timeRemaining.style.color = '#FF9800';
        } else { // Initial color
            this.progressRing.style.stroke = '#4CAF50';
            this.timeRemaining.style.color = '#4CAF50';
        }
    }
    
    completeTimer() {
        clearInterval(this.timer);
        
        // Hide timer section
        this.timerSection.classList.add('hidden');
        
        // Show password section
        setTimeout(() => {
            this.passwordSection.classList.remove('hidden');
            // Now that 'passwordSection' is visible, its child elements (passwordValue and copyButton)
            // will also be visible, as they no longer have 'hidden' applied directly.
        }, 300);
    }

    async copyPassword() {
        const password = document.getElementById('passwordValue').textContent;
        
        try {
            await navigator.clipboard.writeText(password);
            this.showCopyFeedback('Code Copied!');
        } catch (err) {
            // Fallback for older browsers
            this.fallbackCopyTextToClipboard(password);
        }
    }
    
    fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showCopyFeedback('Code Copied!');
            } else {
                this.showCopyFeedback('Failed to Copy');
            }
        } catch (err) {
            this.showCopyFeedback('Failed to Copy');
        }
        
        document.body.removeChild(textArea);
    }
    
    showCopyFeedback(message) {
        const originalText = this.copyButton.innerHTML;
        this.copyButton.style.background = '#45a049'; // Keep background consistent for feedback
        this.copyButton.innerHTML = `<span>${message}</span>`;
        
        setTimeout(() => {
            this.copyButton.innerHTML = originalText;
            this.copyButton.style.background = '#4CAF50';
        }, 2000);
    }
    
    onVisibilityChange() {
        this.ensureTimer();
    }
    
    toggleNotice(show) {
        this.pauseNotice.classList.toggle('hidden', !show);
    }
}

// Initialize the application when page loads
document.addEventListener('DOMContentLoaded', () => {
    new VideoTimer();
});