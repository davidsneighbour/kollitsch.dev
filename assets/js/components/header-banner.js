window.customElements.define(
  "cookie-banner",
  class extends HTMLElement {
    connectedCallback() {

      let savedKey = localStorage.getItem("cookie-policy");

      if (savedKey) {
        this.classList.add("hidden");
      }

      let button = this.getButton();
      if (button) {
        button.addEventListener("click", () => {
          this.savePreference();
          this.close();
        });
      }
    }

    getButton() {
      return this.querySelector("[data-banner-close]");
    }

    savePreference() {
      localStorage.setItem("cookie-policy", true);
    }

    close() {
      this.setAttribute("hidden", true);
      this.setAttribute("aria-hidden", true);
      this.classList.add("hidden");
    }
  }
);
