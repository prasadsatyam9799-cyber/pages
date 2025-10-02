
class GameContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 90%;
                    max-width: 420px;
                    margin: 20px 0;
                    background-color: #ffffff;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05);
                    padding: 25px;
                    text-align: center;
                    border: 1px solid #e8e8e8;
                }
                h1 {
                    font-size: 1.8rem;
                    color: #ff4500;
                    font-weight: 700;
                }
                .subtitle {
                    color: #555;
                    margin-bottom: 25px;
                }
                .counter-container {
                    margin: 25px 0;
                    font-size: 1.2rem;
                    color: #444;
                }
            </style>
            <h1>Free Fire Team Challenge</h1>
            <p class="subtitle">Tap the circle to help unlock the final prize!</p>
            <slot name="progress"></slot>
            <slot name="tap-circle"></slot>
            <slot name="share-buttons"></slot>
            <div class="counter-container">
                <p>Total Taps: <span id="tap-count">Loading...</span></p>
            </div>
            <slot name="prize"></slot>
        `;
    }

    updateTapCount(taps, milestone) {
        const tapCountEl = this.shadowRoot.getElementById('tap-count');
        if (tapCountEl) {
            tapCountEl.textContent = `${taps.toLocaleString()} / ${milestone.toLocaleString()}`;
        }
    }
}

customElements.define('game-container', GameContainer);
