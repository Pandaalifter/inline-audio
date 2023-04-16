import { LitElement, html, css } from 'lit';

const logo = new URL('../assets/open-wc-logo.svg', import.meta.url).href;

class InlineAudio extends LitElement {
  static properties = {
    header: { type: String },
    audioFile: { attribute: "audio-file", type: String},
    bob: { type: Boolean}
  }

  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: var(--inline-audio-background-color);
    }
    .container {
      background-color: blue;
      width: 400px;
    }
    :host([bob]) .container{
      background-color: red;
    }
  `;

  constructor() {
    super();
    this.header = 'My app';
    this.audioFile = new URL('../assets/software-song.mp3', import.meta.url).href;
    this.bob = false;
  }

  handleClickEvent(){
    var audiop = document.querySelector('.audio-player')
    audiop.play();
    this.bob = true;
  }

  render() {
    return html`
      <div class="container" onclick="${this.handleClickEvent}"> Kevin Spacey's Chihuhua
      <button @click="${this.handleClickEvent}"> Steve </button>
      <audio controls class="audio-player" src="${this.audioFile}" type="audio/mpeg"></audio>
      <div>
    `;
  }
}

customElements.define('inline-audio', InlineAudio);