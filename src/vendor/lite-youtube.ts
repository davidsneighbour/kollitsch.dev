const TAG_NAME = 'lite-youtube';

class LiteYouTubeElement extends HTMLElement {
  private static warmedConnections = false;

  private readonly handleClick = (): void => {
    this.activate();
  };

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.activate();
  };

  private readonly warmup = (): void => {
    LiteYouTubeElement.preconnect();
  };

  public connectedCallback(): void {
    if (!this.videoId) {
      console.error('lite-youtube: missing required "videoid" attribute.', this);
      return;
    }

    this.classList.add('lyt-host');
    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', this.getAttribute('tabindex') ?? '0');
    this.setAttribute('aria-label', this.playLabel);

    if (!this.style.backgroundImage) {
      this.style.backgroundImage = `url("${this.posterUrl}")`;
    }

    if (!this.querySelector('.lyt-playbtn')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'lyt-playbtn';
      button.setAttribute('aria-label', this.playLabel);

      const visuallyHidden = document.createElement('span');
      visuallyHidden.className = 'lyt-visually-hidden';
      visuallyHidden.textContent = this.playLabel;

      button.append(visuallyHidden);
      this.append(button);
    }

    if (this.titleText && !this.querySelector('.lyt-title')) {
      const title = document.createElement('span');
      title.className = 'lyt-title';
      title.textContent = this.titleText;
      this.append(title);
    }

    this.addEventListener('click', this.handleClick);
    this.addEventListener('keydown', this.handleKeyDown);
    this.addEventListener('pointerover', this.warmup, { once: true });
    this.addEventListener('focusin', this.warmup, { once: true });
    this.addEventListener('touchstart', this.warmup, { once: true });
  }

  public disconnectedCallback(): void {
    this.removeEventListener('click', this.handleClick);
    this.removeEventListener('keydown', this.handleKeyDown);
    this.removeEventListener('pointerover', this.warmup);
    this.removeEventListener('focusin', this.warmup);
    this.removeEventListener('touchstart', this.warmup);
  }

  private get videoId(): string {
    return this.getAttribute('videoid')?.trim() ?? '';
  }

  private get titleText(): string {
    return this.getAttribute('title')?.trim() ?? '';
  }

  private get playLabel(): string {
    return (
      this.getAttribute('playlabel')?.trim() ||
      this.titleText ||
      'Play video'
    );
  }

  private get params(): URLSearchParams {
    const rawParams = this.getAttribute('params')?.trim() ?? '';
    const searchParams = new URLSearchParams(rawParams);

    if (!searchParams.has('autoplay')) {
      searchParams.set('autoplay', '1');
    }

    if (!searchParams.has('playsinline')) {
      searchParams.set('playsinline', '1');
    }

    if (!searchParams.has('rel')) {
      searchParams.set('rel', '0');
    }

    return searchParams;
  }

  private get posterUrl(): string {
    return `https://i.ytimg.com/vi/${encodeURIComponent(this.videoId)}/hqdefault.jpg`;
  }

  private get embedUrl(): string {
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(this.videoId)}?${this.params.toString()}`;
  }

  private activate(): void {
    if (this.classList.contains('lyt-activated')) {
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.className = 'lyt-iframe';
    iframe.width = '560';
    iframe.height = '315';
    iframe.title = this.titleText || 'YouTube video player';
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.loading = 'eager';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.src = this.embedUrl;

    this.classList.add('lyt-activated');
    this.replaceChildren(iframe);
    iframe.focus();
  }

  private static preconnect(): void {
    if (LiteYouTubeElement.warmedConnections) {
      return;
    }

    LiteYouTubeElement.warmedConnections = true;

    LiteYouTubeElement.addPrefetch('preconnect', 'https://www.youtube-nocookie.com');
    LiteYouTubeElement.addPrefetch('preconnect', 'https://www.google.com');
    LiteYouTubeElement.addPrefetch('preconnect', 'https://i.ytimg.com');
    LiteYouTubeElement.addPrefetch('preconnect', 'https://s.ytimg.com');
  }

  private static addPrefetch(
    rel: 'preconnect' | 'preload',
    href: string
  ): void {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;

    if (rel === 'preconnect') {
      link.crossOrigin = '';
    }

    document.head.append(link);
  }
}

if (!customElements.get(TAG_NAME)) {
  customElements.define(TAG_NAME, LiteYouTubeElement);
}

export { };
