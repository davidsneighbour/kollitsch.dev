export function themeSwitcher(this: any) {
  let _this = this;
  return {
    theme: 'dark',
    init: function () {
      _this = this;
      this.theme = this.getColorPreference();
      this.reflectPreference();
      this.changeGiscusTheme();
      setTimeout(function () {
        return _this.changeGiscusTheme();
      }, 2000);
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        _this.theme = e.matches ? 'dark' : 'light';
        _this.setPreference();
      });
    },
    toggleTheme: function () {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      this.setPreference();
      this.changeGiscusTheme();
      setTimeout(function () {
        return _this.changeGiscusTheme();
      }, 2000);
    },
    getColorPreference: function () {
      return localStorage.getItem('dnb-theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    },
    setPreference: function () {
      localStorage.setItem('dnb-theme', this.theme);
      this.reflectPreference();
    },
    reflectPreference: function () {
      if (document.firstElementChild) {
        document.firstElementChild.setAttribute('data-bs-theme', this.theme);
      }
      //document.body.className = '';
      document.body.classList.add(this.theme);
      document.body.classList.remove(this.theme === 'dark' ? 'light' : 'dark');
    },
    changeGiscusTheme: function () {
      const giscusTheme = this.theme === 'dark' ? 'dark' : 'light';
      let iframe = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ giscus: { setConfig: { theme: giscusTheme } } }, 'https://giscus.app');
      }
    }
  };
}
