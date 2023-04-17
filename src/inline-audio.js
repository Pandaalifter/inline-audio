import { LitElement, html, css } from 'lit';
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";

const logo = new URL('../assets/open-wc-logo.svg', import.meta.url).href;

class InlineAudio extends LitElement {
  static properties = {
    header: { type: String },
    audioFile: { attribute: "audio-file", type: String},
    playerIcon: { type: String},
    isPlaying: { type: Boolean, reflect: true}
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
    .container {
      display: inline-flex;
      align-items: center;
      padding: 4px 4px 4px 0px;
      background-color: grey;
      border-radius: 4px;
      min-width: 64px;
      cursor: pointer;
      font-size: 18px;
    }
    .icon-spacing{
      padding-right: 8px;
    }
  `;

  constructor() {
    super();
    this.header = 'My app';
    this.audioFile = new URL('../assets/software-song.mp3', import.meta.url).href;
    this.playerIcon = "av:play-arrow";
    this.isPlaying = false;
  }

  handleClickEvent(){
    if(this.shadowRoot.querySelector('audio').paused == true){
      this.shadowRoot.querySelector('.player').play();
      this.isPlaying = true;
      this.playerIcon = "av:pause";
      console.log(this.isPlaying);
    }
    else{
      this.shadowRoot.querySelector('.player').pause();
      this.isPlaying = false;
      this.playerIcon = "av:play-arrow";
      console.log(this.isPlaying);
    }
  }

  render() {
    return html`
      <div class="container" @click="${this.handleClickEvent}"> 
        <simple-icon class="icon-spacing" icon="${this.playerIcon}"></simple-icon>
        <slot></slot>
        <audio class="player" src="${this.audioFile}" type="audio/mpeg"></audio>
      <div>
    `;
  }
}

customElements.define('inline-audio', InlineAudio);