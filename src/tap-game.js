
import './components/game-container.js';
import './components/progress-display.js';
import './components/tap-circle.js';
import './components/prize-display.js';
import './components/share-modal.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Firebase Configuration ---
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        measurementId: "G-506933386"
    };

    // --- Firebase Initialization ---
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            firebase.analytics();
        }
    } catch (e) {
        console.error("Firebase initialization failed:", e);
        alert("This application is not configured correctly. Please update the firebaseConfig object in tap-game.js.");
        return;
    }

    // --- Firestore Database & DOM Elements ---
    const db = firebase.firestore();
    const gameContainer = document.querySelector('game-container');
    const progressDisplay = document.querySelector('progress-display');
    const tapCircle = document.querySelector('tap-circle');
    const prizeDisplay = document.querySelector('prize-display');
    const shareModal = document.querySelector('share-modal');

    // --- Milestones & Constants ---
    const STARTING_TAPS = 193300;
    const FINAL_MILESTONE = 350000;
    const COUNTDOWN_DURATION = 10 * 60 * 1000; // 10 minutes
    const SHARE_MILESTONE = 1000;
    const REQUIRED_SHARES = 5;

    // --- Local State ---
    let individualTaps = parseInt(localStorage.getItem('individualTaps')) || 0;
    let shares = parseInt(localStorage.getItem('shares')) || 0;
    let milestoneReached = false;
    let countdownInterval;

    // --- Event Listeners ---
    const handleTap = (e) => {
        e.preventDefault();
        if (individualTaps >= SHARE_MILESTONE && shares < REQUIRED_SHARES) {
            shareModal.show();
            return;
        }
        individualTaps++;
        localStorage.setItem('individualTaps', individualTaps);
        gtag('event', 'tap', { 'event_category': 'Game', 'event_label': 'Tap Circle' });
        incrementTapCounter();
    };

    tapCircle.shadowRoot.getElementById('tap-button').addEventListener('click', handleTap);
    tapCircle.shadowRoot.getElementById('tap-button').addEventListener('touchstart', handleTap, { passive: true });

    shareModal.shadowRoot.getElementById('whatsapp-share-modal').addEventListener('click', () => trackShare('WhatsApp'));
    shareModal.shadowRoot.getElementById('facebook-share-modal').addEventListener('click', () => trackShare('Facebook'));

    document.getElementById('whatsapp-share-main').addEventListener('click', () => trackShare('WhatsApp'));
    document.getElementById('facebook-share-main').addEventListener('click', () => trackShare('Facebook'));

    // --- Core Functions ---
    function incrementTapCounter() {
        if (!db) return;
        const tapCounterRef = db.collection('game').doc('tapCounter');
        tapCounterRef.update({ total: firebase.firestore.FieldValue.increment(1) })
            .catch(error => {
                if (error.code === 'not-found') {
                    tapCounterRef.set({ total: STARTING_TAPS + 1 });
                }
            });
    }

    function trackShare(platform) {
        shares++;
        localStorage.setItem('shares', shares);
        shareModal.updateShareCount(shares, REQUIRED_SHARES);
        gtag('event', 'share', { 'event_category': 'Game', 'event_label': platform });
        if (shares >= REQUIRED_SHARES) {
            shareModal.hide();
        }
    }

    // --- Firestore Snapshot Listener ---
    db.collection('game').doc('tapCounter').onSnapshot(doc => {
        let currentTaps = STARTING_TAPS;
        let finalMilestoneTimestamp = null;

        if (doc.exists) {
            const data = doc.data();
            currentTaps = data.total > STARTING_TAPS ? data.total : STARTING_TAPS;
            finalMilestoneTimestamp = data.finalMilestoneTimestamp || null;
        } else {
             console.warn(`'tapCounter' document not found. It will be created on the first tap with a value of ${STARTING_TAPS + 1}.`);
        }
        
        updateUI(currentTaps);
        checkFinalMilestone(currentTaps, finalMilestoneTimestamp);

    }, error => {
        console.error("Error listening to tap counter:", error);
    });

    // --- UI & Milestone Logic ---
    function updateUI(taps) {
        const percentage = Math.min((taps / FINAL_MILESTONE) * 100, 100);
        gameContainer.updateTapCount(taps, FINAL_MILESTONE);
        progressDisplay.updateProgress(percentage);
        
        if (taps >= FINAL_MILESTONE) {
            tapCircle.disabled = true;
        }
    }

    function checkFinalMilestone(taps, timestamp) {
        if (taps >= FINAL_MILESTONE && !timestamp) {
            gtag('event', 'final_prize_countdown_started', { 'event_category': 'Game' });
            db.collection('game').doc('tapCounter').update({ finalMilestoneTimestamp: firebase.firestore.FieldValue.serverTimestamp() });
        }
        
        if (timestamp && !milestoneReached) {
            prizeDisplay.showCountdown();
            const timeRemaining = timestamp.toMillis() + COUNTDOWN_DURATION - Date.now();
            
            if (timeRemaining <= 0) {
                milestoneReached = true;
                revealFinalPrize();
            } else {
                startCountdown(timeRemaining);
                setTimeout(() => {
                     if (!milestoneReached) {
                        milestoneReached = true;
                        revealFinalPrize();
                    }
                }, timeRemaining);
            }
        }
    }
    
    function fetchAndDisplayPrize() {
        db.collection('game').doc('finalPrize').get().then(doc => {
            let code = "Prize not found";
            if (doc.exists) {
                code = doc.data().code;
            }
            prizeDisplay.revealPrize(code);
        });
    }
    
    function revealFinalPrize() {
        gtag('event', 'final_prize_revealed', { 'event_category': 'Game' });
        fetchAndDisplayPrize();
    }

    function startCountdown(duration) {
        clearInterval(countdownInterval);
        let timer = duration;
        
        const update = () => {
            const minutes = Math.floor((timer / 1000 / 60) % 60).toString().padStart(2, '0');
            const seconds = Math.floor((timer / 1000) % 60).toString().padStart(2, '0');
            prizeDisplay.showCountdown(`${minutes}:${seconds}`);
        };

        update();
        countdownInterval = setInterval(() => {
            timer -= 1000;
            update();
            if (timer < 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);
    }
});
