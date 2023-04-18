import { LitElement, html, css } from 'lit';
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "./inline-audio.js"

const logo = new URL('../assets/open-wc-logo.svg', import.meta.url).href;

class AudioApp extends LitElement {
  static properties = {
    
  }

  static styles = css`
    :host {
      min-height: 100vh;
      display: inline;
      vertical-align:middle;
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      background-color: var(--inline-audio-background-color);
    }
  `;

  constructor() {
    super();
  }

  render() {
    return html`
          The King of Burgers made a decree. The decree came in the form of a song. Not just any song, but a legendary song that bellowed to the world. This song was of <inline-audio audio-file="${new URL('../assets/whopper.mp3', import.meta.url).href}">whoppers</inline-audio> and toppers.
    `;
  }
}

customElements.define('audio-app', AudioApp);