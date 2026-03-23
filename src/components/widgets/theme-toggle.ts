import { LitElement, css, html } from 'lit'

type Theme = 'dark' | 'light'

export class SiteThemeToggle extends LitElement {
  static properties = {
    theme: { state: true },
  }

  declare theme: Theme

  static styles = css`
    :host {
      display: inline-flex;
    }

    button {
      font: inherit;
      font-family: "JetBrains Mono", "Courier New", monospace;
      font-size: 0.8rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--base06);
      background-color: var(--base00);
      border: 2px solid var(--base07);
      border-radius: 999px;
      padding: 0;
      width: 3.5rem;
      height: 1.9rem;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      transition:
        color 0.2s ease,
        background-color 0.2s ease,
        border-color 0.2s ease;
    }

    button::before {
      content: '';
      position: absolute;
      inset: 4px;
      border-radius: 999px;
      background: linear-gradient(
        135deg,
        var(--base07) 0%,
        var(--base07) 50%,
        transparent 50%,
        transparent 100%
      );
    }

    button[data-theme='light']::before {
      background: linear-gradient(
        135deg,
        transparent 0%,
        transparent 50%,
        var(--base07) 50%,
        var(--base07) 100%
      );
    }

    button:hover {
      color: var(--base07);
      border-color: var(--base03);
    }

    button:focus-visible {
      outline: 2px solid var(--base0D);
      outline-offset: 3px;
    }

    .label {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `

  constructor() {
    super()
    this.theme = 'dark'
  }

  connectedCallback() {
    super.connectedCallback()
    const storedTheme = window.localStorage.getItem('theme')
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
    this.theme = storedTheme === 'light' || storedTheme === 'dark'
      ? storedTheme
      : prefersLight
        ? 'light'
        : 'dark'
    this.applyTheme()
  }

  private applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme)
    document.documentElement.style.colorScheme = this.theme
  }

  private toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light'
    window.localStorage.setItem('theme', this.theme)
    this.applyTheme()
  }

  render() {
    const isLight = this.theme === 'light'
    return html`
      <button
        type="button"
        data-theme=${this.theme}
        aria-pressed=${String(isLight)}
        aria-label=${`Switch to ${isLight ? 'dark' : 'light'} mode`}
        @click=${this.toggleTheme}
      >
        <span class="label">${isLight ? 'Dark' : 'Light'}</span>
      </button>
    `
  }
}

customElements.define('site-theme-toggle', SiteThemeToggle)
