const headlines = document.querySelectorAll('h1.post-title');

headlines.forEach((headline) => {
  const headlineText = headline.textContent?.trim();
  if (headlineText) {
    const characterCount = headlineText.length;
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const fontSize = vw / characterCount;
    // @ts-ignore
    headline.style.setProperty('--headline-font-size', `${fontSize}px`);
  }
});
