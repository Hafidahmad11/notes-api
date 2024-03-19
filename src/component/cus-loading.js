class CustomLoadingIndicator extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const shadow = this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = `
            <style>
                .loading-indicator {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(255, 255, 255, 0.8); /* Transparansi */
                    z-index: 9999;
                }

                .spinner {
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    border-left-color: #333;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 10s linear infinite;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            </style>
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p> Loading . . .</p>
            </div>
        `;

    shadow.appendChild(template.content.cloneNode(true));

    setTimeout(() => {
      const loadingIndicator = shadow.querySelector(".loading-indicator");
      if (loadingIndicator) {
        loadingIndicator.remove();
      }
    }, 10000);
  }
}

customElements.define("custom-loading-indicator", CustomLoadingIndicator);
