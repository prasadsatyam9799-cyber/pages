
# Project Blueprint

## Overview

This project is a responsive website for "Weathering Online," a source for weather information, news, and interactive games. The current focus is on building a "Tap Challenge" game on the "Free Fire Challenge" page.

## Implemented Styles, Designs, and Features

*   **Responsive Design:** The website is fully responsive and adapts to different screen sizes, including desktops, tablets, and mobile devices.
*   **Modern CSS:** Uses modern CSS features like Flexbox and Grid for layout, relative units for sizing, and media queries for breakpoints.
*   **Web Components:** Utilizes Web Components for creating reusable UI elements.
*   **Accessibility:** Implements accessibility features to ensure the website is usable by everyone.

## Current Task: Build the "Tap Challenge" Page

### Plan:

1.  **Firebase Setup**:
    *   Install the Firebase SDK.
    *   Create a `tap-challenge.js` file.
    *   Add Firebase configuration and initialize the Firebase app and Analytics.
    *   Enable Anonymous Authentication in the Firebase console.
    *   Set up Firebase Realtime Database.

2.  **Frontend Development (`free-fire-challenge.html` & `free-fire-challenge.css`)**:
    *   Create the UI for the tap challenge, including:
        *   A main tap button.
        *   A progress bar showing taps from 219,000 to 375,000.
        *   Tap counters (current and remaining).
        *   A modal for the share requirement.
        *   A countdown timer.
        *   A section to display the final redeem code.

3.  **Game Logic (`tap-challenge.js`)**:
    *   Implement anonymous user sign-in.
    *   Handle tap events and update the player's `tapCount` in Firebase.
    *   Implement the sharing requirement every 1,000 taps.
    *   Trigger the countdown timer when the tap goal is reached.
    *   Reveal the redeem code after the countdown.
    *   Track `totalCompletions` in Firebase.
    *   Assign the `redeemCode` to the player only after 5 total completions.
    *   Implement a 3-day cooldown period for players who have redeemed a code.

4.  **Google Analytics & AdSense**:
    *   Add the GA4 tracking script to the HTML.
    *   Set up custom event tracking for key actions (e.g., `tap`, `share_prompt`, `goal_complete`, `code_redeemed`).
    *   Integrate AdSense placeholders for monetization.

5.  **Firebase Security Rules**:
    *   Define security rules for the Realtime Database to ensure data integrity and prevent cheating.

