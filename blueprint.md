
# Project Blueprint

## Overview

This project is a simple website with a "Free Fire Team Challenge" tap game. The main goal is to create an interactive and engaging experience for users, encouraging teamwork to unlock a collective reward.

## Current State

The project currently consists of a basic website structure with a few static pages.

## Plan for "Free Fire Team Challenge"

### 1. Create the Game Page (`tap-game.html`)

-   **HTML:**
    -   Create the main structure with a container for the game.
    -   Add a heading "Free Fire Team Challenge – 150,000 Taps" and a sub-heading.
    -   Create a large, clickable circle for tapping.
    -   Add a progress bar and a text element to display the current tap count.
    -   Create a section to display the locked/unlocked redeem code.
    -   Add social media sharing buttons (WhatsApp and Facebook).
-   **CSS (`tap-game.css`):**
    -   Style the page with a visually appealing and responsive layout.
    -   Design a colorful and interactive tap circle.
    -   Style the progress bar to reflect the current progress.
    -   Ensure the design is mobile-friendly.
-   **JavaScript (`tap-game.js`):**
    -   Integrate the Firebase SDK.
    -   Initialize a Firestore database connection.
    -   Implement a function to increment a `total` field in a `tapCounter` document within a `game` collection in Firestore.
    -   Use `onSnapshot` to listen for real-time updates to the tap count and update the UI accordingly.
    -   Implement logic to fetch and display a redeem code from Firestore once the tap count reaches 150,000.
    -   Add event listeners for the tap circle and social media share buttons.

### 2. Update Navigation

-   Add a link to the "Team Tap Challenge" in the main navigation menu of the website (`index.html`).

### 3. Firebase Setup

-   The Firestore database will have the following structure:
    -   Collection: `game`
    -   Document: `tapCounter`
    -   Field: `total` (Number)
    -   Document: `reward`
    -   Field: `redeemCode` (String)

