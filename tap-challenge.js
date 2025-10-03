
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, onValue, set, runTransaction } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCxOxQ49RIvVRTc7dWDLHjtCDJqtnLJuc",
  authDomain: "weathering-ec158.firebaseapp.com",
  projectId: "weathering-ec158",
  storageBucket: "weathering-ec158.firebasestorage.app",
  messagingSenderId: "845842876413",
  appId: "1:845842876413:web:d4dd846e2d9c8325343b94",
  measurementId: "G-HKTVLZ3NME"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);

// DOM Elements
const tapButton = document.getElementById('tap-button');
const currentTapsSpan = document.getElementById('current-taps');
const remainingTapsSpan = document.getElementById('remaining-taps');
const progressBar = document.querySelector('.progress-bar');
const shareModal = document.getElementById('share-modal');
const shareButton = document.getElementById('share-button');
const countdownModal = document.getElementById('countdown-modal');
const countdownTimerSpan = document.getElementById('countdown-timer');
const redeemCodeContainer = document.getElementById('redeem-code-container');
const redeemCodeSpan = document.getElementById('redeem-code');
const redeemMessageSpan = document.getElementById('redeem-message');

let currentUser;
let playerRef;
let settings = {};
let progress = {};

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    playerRef = ref(db, 'players/' + currentUser.uid);

    // Get settings and progress
    const settingsRef = ref(db, 'settings');
    const progressRef = ref(db, 'progress');

    onValue(settingsRef, (snapshot) => {
      settings = snapshot.val();
    });

    onValue(progressRef, (snapshot) => {
      progress = snapshot.val();
    });

    onValue(playerRef, (snapshot) => {
      if (snapshot.exists()) {
        const playerData = snapshot.val();
        updateUI(playerData);
      } else {
        // Initialize player data
        set(playerRef, {
          tapCount: 219000,
          lastSharedAt: 218000,
          revealUnlockAt: null,
          redeemCode: null,
          nextAvailableAt: null,
          completed: false
        });
      }
    });
  } else {
    signInAnonymously(auth).catch((error) => {
      console.error("Anonymous sign-in failed:", error);
    });
  }
});

function updateUI(playerData) {
    const { tapCount, lastSharedAt, revealUnlockAt, redeemCode, nextAvailableAt, completed } = playerData;
    const { tapGoal, startingTaps, shareInterval, countdownMinutes, cooldownDays } = settings;

    currentTapsSpan.textContent = tapCount.toLocaleString();
    remainingTapsSpan.textContent = (tapGoal - tapCount).toLocaleString();

    const progressPercentage = ((tapCount - startingTaps) / (tapGoal - startingTaps)) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    if (completed) {
        tapButton.disabled = true;
        tapButton.textContent = 'Completed';

        if (revealUnlockAt && Date.now() < revealUnlockAt) {
            startCountdown(revealUnlockAt);
        } else {
            showRedeemCode(redeemCode);
        }
    } else {
        if (tapCount >= tapGoal) {
            completeChallenge();
        } else {
            if (tapCount - lastSharedAt >= shareInterval) {
                shareModal.style.display = 'block';
                tapButton.disabled = true;
            }
        }
    }

    if (nextAvailableAt && Date.now() < nextAvailableAt) {
        tapButton.disabled = true;
        const days = Math.ceil((nextAvailableAt - Date.now()) / (1000 * 60 * 60 * 24));
        tapButton.textContent = `Cooldown: ${days} day(s) left`;
    }
}

// Anti-cheating
let tapTimestamp = 0;
const tapDebounce = 100; // Milliseconds

tapButton.addEventListener('click', () => {
    const now = Date.now();
    if (now - tapTimestamp < tapDebounce) {
        return; // Prevent rapid clicking
    }
    tapTimestamp = now;

    runTransaction(playerRef, (playerData) => {
        if (playerData) {
            if (!playerData.completed) {
                playerData.tapCount++;
            }
        }
        return playerData;
    });
    logEvent(analytics, 'tap');
});

shareButton.addEventListener('click', () => {
    runTransaction(playerRef, (playerData) => {
        if (playerData) {
            playerData.lastSharedAt = playerData.tapCount;
        }
        return playerData;
    });
    shareModal.style.display = 'none';
    tapButton.disabled = false;
    logEvent(analytics, 'share_prompt');
});

function completeChallenge() {
    const revealUnlockAt = Date.now() + settings.countdownMinutes * 60 * 1000;

    runTransaction(playerRef, (playerData) => {
        if (playerData && !playerData.completed) {
            playerData.completed = true;
            playerData.revealUnlockAt = revealUnlockAt;
        }
        return playerData;
    });

    runTransaction(ref(db, 'progress'), (progressData) => {
        if (progressData) {
            progressData.totalCompletions++;
        }
        return progressData;
    });

    startCountdown(revealUnlockAt);
    logEvent(analytics, 'goal_complete');
}

function startCountdown(endTime) {
    countdownModal.style.display = 'block';
    const interval = setInterval(() => {
        const now = Date.now();
        const distance = endTime - now;

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownTimerSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (distance < 0) {
            clearInterval(interval);
            countdownModal.style.display = 'none';
            assignAndShowRedeemCode();
        }
    }, 1000);
}

function assignAndShowRedeemCode() {
    const codeRef = ref(db, 'freefire_codes/F3Y4V699UCNW2Z6E');

    if (progress.totalCompletions >= settings.releaseAfterCompletions) {
        runTransaction(codeRef, (codeData) => {
            if (codeData && !codeData.assigned) {
                codeData.assigned = true;
                codeData.assignedTo = currentUser.uid;
                codeData.assignedAt = Date.now();

                runTransaction(playerRef, (playerData) => {
                    if (playerData) {
                        playerData.redeemCode = "F3Y4V699UCNW2Z6E";
                        const cooldownUntil = Date.now() + settings.cooldownDays * 24 * 60 * 60 * 1000;
                        playerData.nextAvailableAt = cooldownUntil;
                    }
                    return playerData;
                });
                logEvent(analytics, 'code_redeemed');
            }
            return codeData;
        });
    } else {
        redeemMessageSpan.textContent = "Congratulations! The redeem code will be unlocked after 5 total completions.";
        redeemCodeContainer.style.display = 'block';
    }
}

function showRedeemCode(code) {
    if (code) {
        redeemCodeSpan.textContent = code;
        redeemMessageSpan.textContent = "Here is your Free Fire redeem code. Enjoy!";
    } else {
        redeemMessageSpan.textContent = "Congratulations! The redeem code will be unlocked after 5 total completions.";
    }
    redeemCodeContainer.style.display = 'block';
}
