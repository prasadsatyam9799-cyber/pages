
class ShareModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .modal {
                    display: none;
                    position: fixed;
                    z-index: 1000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    background-color: rgba(0, 0, 0, 0.65);
                    justify-content: center;
                    align-items: center;
                }
                .modal-content {
                    background-color: #fefefe;
                    padding: 25px;
                    border: none;
                    width: 85%;
                    max-width: 380px;
                    text-align: center;
                    border-radius: 15px;
                    animation: fade-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                 @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: scale(0.85);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .share-btn {
                    display: inline-block;
                    margin: 8px;
                    padding: 12px 20px;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 500;
                    transition: transform 0.2s;
                }

                .share-btn:hover {
                    transform: translateY(-2px);
                }

                .whatsapp {
                    background-color: #25D366;
                }

                .facebook {
                    background-color: #3b5998;
                }
            </style>
            <div id="share-modal" class="modal">
              <div class="modal-content">
                <h2>Share to Continue!</h2>
                <p>You've tapped 1,000 times! Share the game with 5 friends to keep tapping.</p>
                <p>Your Shares: <span id="share-count">0</span>/5</p>
                <a href="https://api.whatsapp.com/send?text=Join the Free Fire Team Challenge! https://www.weathering.online/tap-game.html" target="_blank" class="share-btn whatsapp" id="whatsapp-share-modal">Share on WhatsApp</a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=https://www.weathering.online/tap-game.html" target="_blank" class="share-btn facebook" id="facebook-share-modal">Share on Facebook</a>
              </div>
            </div>
        `;
    }

    show() {
        this.shadowRoot.getElementById('share-modal').style.display = 'flex';
    }

    hide() {
        this.shadowRoot.getElementById('share-modal').style.display = 'none';
    }

    updateShareCount(shares, required) {
        const shareCount = this.shadowRoot.getElementById('share-count');
        if(shareCount) {
            shareCount.textContent = `${shares}/${required}`;
        }
    }
}

customElements.define('share-modal', ShareModal);
