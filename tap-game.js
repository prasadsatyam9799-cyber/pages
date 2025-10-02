
// Replace with your Firebase project configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
} catch (e) {
    console.error("Firebase initialization failed. Please check your configuration.", e);
    alert("This application is not configured correctly. Please contact the administrator.");
}

const db = firebase.firestore();

const tapCircle = document.getElementById('tap-circle');
const tapCountElement = document.getElementById('tap-count');
const redeemCodeElement = document.getElementById('redeem-code');
const rewardSection = document.getElementById('reward-section');
const nextMessage = document.getElementById('next-message');
const progressValue = document.querySelector('.progress-value');
const progressBar = document.querySelector('.progress-bar-circular');
const shareModal = document.getElementById('share-modal');
const shareCountElement = document.getElementById('share-count');
const whatsappShareModal = document.getElementById('whatsapp-share-modal');
const facebookShareModal = document.getElementById('facebook-share-modal');

const firstMilestone = 150000;
const secondMilestone = 175000;
const shareMilestone = 1000;
const requiredShares = 5;

let firstMilestoneReached = false;
let individualTaps = 0;
let shares = 0;

// Listen for tap events
tapCircle.addEventListener('click', () => {
    if (individualTaps < shareMilestone || shares >= requiredShares) {
        addTap();
        individualTaps++;
        if (typeof trackTap === 'function') {
            trackTap();
        }
    }
    if (individualTaps === shareMilestone && shares < requiredShares) {
        shareModal.style.display = "block";
        tapCircle.disabled = true;
    }
});

whatsappShareModal.addEventListener('click', () => {
    trackShare('WhatsApp');
});

facebookShareModal.addEventListener('click', () => {
    trackShare('Facebook');
});

function trackShare(platform) {
    shares++;
    shareCountElement.textContent = `${shares}/${requiredShares}`;
    gtag('event', 'share', {
        'event_category': 'Game',
        'event_label': platform
    });
    if (shares >= requiredShares) {
        shareModal.style.display = "none";
        tapCircle.disabled = false;
    }
}

// Function to increment tap count in Firestore
function addTap() {
    if (!db) return;
    const tapCounterRef = db.collection('game').doc('tapCounter');
    tapCounterRef.update({
        total: firebase.firestore.FieldValue.increment(1)
    }).catch(error => {
        console.error("Error updating tap count: ", error);
        // If the document doesn't exist, we can try to create it.
        if (error.code === 'not-found') {
            tapCounterRef.set({ total: 24690 });
        }
    });
}

// Listen for real-time updates on the tap counter
if (db) {
    db.collection('game').doc('tapCounter')
        .onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                const currentTaps = data.total || 0;
                updateUI(currentTaps);

                if (currentTaps >= firstMilestone && !firstMilestoneReached) {
                    unlockFirstReward();
                    firstMilestoneReached = true;
                }
            } else {
                console.log("Tap counter document does not exist. Please create it in Firestore.");
                updateUI(24690); // Set UI to initial value
            }
        }, error => {
            console.error("Error getting tap counter: ", error);
        });
}


// Function to update the UI with the current tap count
function updateUI(currentTaps) {
    const percentage = Math.min((currentTaps / secondMilestone) * 100, 100);
    tapCountElement.textContent = currentTaps;
    progressValue.textContent = `${Math.floor(percentage)}%`;
    progressBar.style.background = `conic-gradient(#4caf50 ${percentage}%, #ddd 0%)`;
    progressBar.setAttribute('aria-valuenow', currentTaps);
}

// Function to unlock and display the first redeem code
function unlockFirstReward() {
    if (!db) return;
    const rewardRef = db.collection('game').doc('reward');
    rewardRef.get().then(doc => {
        if (doc.exists) {
            const rewardData = doc.data();
            redeemCodeElement.textContent = rewardData.redeemCode || "CODE-UNLOCKED";
            rewardSection.style.backgroundColor = '#ffd700';

            // Send GA4 event for redeem code unlocked
            gtag('event', 'redeem_code_unlocked', {
                'event_category': 'Game',
                'event_label': 'Redeem Code Revealed'
            });

            spawnConfetti();

            // Show the next surprise message
            nextMessage.style.display = 'block';
            setTimeout(() => {
                nextMessage.style.opacity = 1;
                // Send GA4 event for next surprise message
                gtag('event', 'next_surprise_message', {
                    'event_category': 'Game',
                    'event_label': 'Next Surprise Message Displayed'
                });
            }, 100); // Small delay for the transition to take effect

        } else {
            console.log("Reward document not found!");
            redeemCodeElement.textContent = "CODE-NOT-FOUND";
        }
    }).catch(error => {
        console.error("Error getting reward document:", error);
    });
}

// Fun confetti animation
function spawnConfetti() {
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDelay = `${Math.random() * 3}s`;
        
        // Remove the confetti element after the animation completes
        confetti.addEventListener('animationend', () => {
            confetti.remove();
        });
        
        document.body.appendChild(confetti);
    }
}
