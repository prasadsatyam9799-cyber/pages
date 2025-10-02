
# Tap Game Application Blueprint

## 1. Overview

**Purpose:** A real-time, collaborative "tap-to-win" game designed to drive community engagement. Players tap a central button to collectively reach a target number of taps, unlocking a grand prize after a time-delayed reveal.

**Core Features:**
- Real-time global tap counter synchronized with Firebase Firestore.
- A single grand prize milestone at 350,000 taps.
- A 10-minute delayed prize reveal to build anticipation.
- A "Share to Continue" gate to encourage organic growth.
- Google Analytics (GA4) integration for event tracking.

## 2. Implemented Design & Features (v2)

This section documents the current state of the application after the latest overhaul.

### Architecture:
- **Frontend:** HTML, CSS, and modern JavaScript.
- **UI Components:** Refactored into standards-based Web Components (Custom Elements with Shadow DOM) for better encapsulation and maintainability. Key components include `<game-container>`, `<progress-display>`, `<tap-circle>`, and `<prize-display>`.
- **Backend:** Firebase Firestore for real-time database capabilities.
- **Analytics:** Firebase Analytics integrated with GA4.

### Visual Design:
- **Layout:** A clean, centered, "lifted" card-based layout on a textured background.
- **Color Palette:** A vibrant and energetic theme with a prominent call-to-action color (`#ff4500`) and deeper, richer background tones.
- **Typography:** Expressive, sans-serif fonts with a strong visual hierarchy to guide the user.
- **Texture & Depth:** A subtle noise texture on the main background gives a premium, tactile feel. Multi-layered drop shadows create a strong sense of depth, making the main container appear to float.
- **Interactivity:** The tap circle has a "glow" effect and provides tactile feedback. The progress bar is a smooth, circular indicator.
- **Animations:** Subtle, refined animations for modal popups and prize reveals.

## 3. Current Plan: UI & Structural Overhaul (v2)

**Objective:** Refactor the application to use a modern Web Component architecture and implement a more sophisticated, "bold" visual design in line with the project's core development guidelines.

**Actionable Steps:**

1.  **Refactor to Web Components:** Convert all major UI sections (`container`, `progress-bar`, `tap-circle`, `prize-section`) into self-contained Custom Elements.
    -   `game-container.js`: The main application wrapper.
    -   `progress-display.js`: The circular progress bar and counter.
    -   `tap-circle.js`: The primary interactive button.
    -   `prize-display.js`: The section for revealing the final prize.
    -   `share-modal.js`: The popup for the sharing gate.
2.  **Implement Bold Visual Redesign:** Update `style.css` to introduce a more premium aesthetic.
    -   Add a full-screen background with a subtle noise texture.
    -   Redesign the main container as a "lifted" card with deep, multi-layered drop shadows.
    -   Enhance the tap circle with a "glow" effect.
    -   Refine the color palette and typography for a more polished look.
3.  **Update Main Logic:** Modify `tap-game.js` to manage the state and orchestrate the new Web Components. The core Firebase logic will remain but will now pass data into the components via properties and attributes.
4.  **Update HTML:** Streamline `tap-game.html` to be a clean shell that loads the necessary modules and uses the new custom element tags (e.g., `<game-container></game-container>`).
