
class PrizeDisplay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .prize-section {
                    background-color: #f9f9f9;
                    padding: 20px;
                    border-radius: 10px;
                    margin-top: 25px;
                    border: 1px dashed #ddd;
                }
                .prize {
                    opacity: 0;
                    transition: opacity 1s ease-in-out, max-height 0.5s ease-in-out;
                    max-height: 0;
                    overflow: hidden;
                    margin: 0;
                    padding: 0;
                }
                .visible {
                    opacity: 1;
                    max-height: 100px;
                    margin: 10px 0;
                }
            </style>
            <div class="prize-section">
                <div id="final-prize-message" class="prize">Congratulations! The final prize will be revealed in <span id="countdown-timer">10:00</span>!</div>
                <div id="final-prize" class="prize">Final Prize Code: <span id="prize-code"></span></div>
            </div>
        `;
    }

    showCountdown(time) {
        const prizeMessage = this.shadowRoot.getElementById('final-prize-message');
        if (prizeMessage) {
            prizeMessage.classList.add('visible');
            const countdownTimer = this.shadowRoot.getElementById('countdown-timer');
            if (countdownTimer) {
                countdownTimer.textContent = time;
            }
        }
    }

    revealPrize(code) {
        const prizeMessage = this.shadowRoot.getElementById('final-prize-message');
        if (prizeMessage) {
            prizeMessage.style.display = 'none';
        }
        const finalPrize = this.shadowRoot.getElementById('final-prize');
        if (finalPrize) {
            finalPrize.classList.add('visible');
            const prizeCode = this.shadowRoot.getElementById('prize-code');
            if (prizeCode) {
                prizeCode.textContent = code;
            }
        }
    }
}

customElements.define('prize-display', PrizeDisplay);
