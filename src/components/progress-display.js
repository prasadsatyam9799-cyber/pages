
class ProgressDisplay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .progress-container {
                    margin: 25px 0;
                }
                .progress-bar-circular {
                    width: 160px;
                    height: 160px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0 auto;
                    background: conic-gradient(#4caf50 0%, #e0e0e0 0%);
                    transition: background 0.5s ease-in-out;
                }
                .progress-value {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #333;
                }
            </style>
            <div class="progress-container">
                <div id="progress-bar" class="progress-bar-circular" role="progressbar">
                    <span id="progress-value">Loading...</span>
                </div>
            </div>
        `;
    }

    updateProgress(percentage) {
        const progressBar = this.shadowRoot.getElementById('progress-bar');
        const progressValue = this.shadowRoot.getElementById('progress-value');
        if (progressBar && progressValue) {
            progressValue.textContent = `${Math.floor(percentage)}%`;
            progressBar.style.background = `conic-gradient(#4caf50 ${percentage}%, #e0e0e0 ${percentage}%)`;
        }
    }
}

customElements.define('progress-display', ProgressDisplay);
