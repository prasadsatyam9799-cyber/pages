class BlogMenu extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const menuButton = document.createElement('button');
    menuButton.innerHTML = '&#9776;'; // Unicode for "trigram for heaven" (three horizontal lines)
    menuButton.classList.add('menu-button');

    const nav = document.createElement('nav');
    nav.classList.add('nav-menu');
    nav.innerHTML = `
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Posts</a>
      <a href="#">Contact</a>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .menu-button {
        position: fixed;
        top: 15px;
        left: 15px;
        font-size: 24px;
        background: none;
        border: none;
        cursor: pointer;
        z-index: 1001;
      }

      .nav-menu {
        position: fixed;
        top: 0;
        left: -250px;
        width: 250px;
        height: 100%;
        background-color: #f4f4f4;
        display: flex;
        flex-direction: column;
        padding-top: 60px;
        transition: left 0.3s ease;
        z-index: 1000;
        box-shadow: 2px 0 5px rgba(0,0,0,0.1);
      }

      .nav-menu.open {
        left: 0;
      }

      .nav-menu a {
        padding: 15px 20px;
        text-decoration: none;
        color: #333;
        font-family: sans-serif;
      }

      .nav-menu a:hover {
        background-color: #ddd;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(menuButton);
    shadow.appendChild(nav);

    menuButton.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }
}

customElements.define('blog-menu', BlogMenu);
