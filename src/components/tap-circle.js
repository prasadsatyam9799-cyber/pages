
class TapCircle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .tap-circle {
                    width: 130px;
                    height: 130px;
                    border-radius: 50%;
                    background: linear-gradient(145deg, #ff5e1a, #ff4500);
                    color: #ffffff;
                    font-size: 1.3rem;
                    font-weight: bold;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                    -webkit-tap-highlight-color: transparent;
                    box-shadow: 0 5px 15px rgba(255, 69, 0, 0.4), 0 0 20px rgba(255, 107, 61, 0.7);
                }
                .tap-circle:active {
                    transform: scale(0.92);
                    box-shadow: 0 2px 10px rgba(255, 69, 0, 0.5);
                }
                .tap-circle:disabled {
                    background: #c5c5c5;
                    cursor: not-allowed;
                    box-shadow: none;
                }
            </style>
            <button id="tap-button" class="tap-circle" aria-label="Tap to increase the count">
                <span id="tap-text">Tap Me!</span>
            </button>
        `;
    }

    set disabled(value) {
        const button = this.shadowRoot.getElementById('tap-button');
        if (button) {
            button.disabled = value;
            if(value) {
                 this.shadowRoot.getElementById('tap-text').textContent = "Goal Reached!";
            }
        }
    }

    get disabled() {
        const button = this.shadowRoot.getElementById('tap-button');
        return button ? button.disabled : false;
    }
}

customElements.define('tap-circle', TapCircle);
