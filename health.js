class HealthSection extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            .section {
                background-color: #ffffff;
                border: 1px solid #e0e0e0;
                border-radius: 12px;
                margin-bottom: 1.5rem;
                padding: 1.5rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                transition: box-shadow 0.3s ease;
            }
            .section:hover {
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
            }
            h2 {
                color: #005a4d;
                font-size: 1.8rem;
                margin-top: 0;
                cursor: pointer;
            }
            ::slotted(.summary) {
                font-style: italic;
                color: #00897b;
                margin-top: 1rem;
                border-left: 3px solid #00897b;
                padding-left: 1rem;
                font-weight: bold;
            }
        `;

        const section = document.createElement('div');
        section.classList.add('section');

        const title = document.createElement('h2');
        title.textContent = this.getAttribute('title');

        const content = document.createElement('div');
        content.classList.add('content');
        content.style.display = 'none'; // Initially hidden
        
        content.innerHTML = '<slot></slot>';
        
        section.appendChild(title);
        section.appendChild(content);

        shadow.appendChild(style);
        shadow.appendChild(section);

        title.addEventListener('click', () => {
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
        });
    }
}

customElements.define('health-section', HealthSection);

// Back to top button
const backToTopButton = document.querySelector('.back-to-top');

if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
