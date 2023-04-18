import { LitElement, html, css } from 'lit';
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";

const logo = new URL('../assets/open-wc-logo.svg', import.meta.url).href;

class InlineAudio extends LitElement {
  static properties = {
    audioFile: { attribute: "audio-file", type: String, reflect: true},
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
      background: grey;
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
    this.audioFile = new URL('../assets/software-song.mp3', import.meta.url).href;
    this.playerIcon = "av:play-arrow";
    this.isPlaying = false;
  }

  handleProgressBar(){
    if(this.shadowRoot.querySelector(".player").ended){
      this.isPlaying = false;
      this.playerIcon = "av:play-arrow";
      console.log(this.isPlaying);
    }
    var audioDuration = this.shadowRoot.querySelector(".player").duration;
    var audioCurrentTime = this.shadowRoot.querySelector(".player").currentTime;
    var progressPercentage = (audioCurrentTime / audioDuration)*100;
    this.shadowRoot.querySelector(".container").style.background = `linear-gradient(90deg, orange 0% ${progressPercentage}%, grey ${progressPercentage}% 100%)`;
    console.log("Check: " + progressPercentage);
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
        <audio class="player" src="${this.audioFile}" type="audio/mpeg" @timeupdate="${this.handleProgressBar}"></audio>
      <div>
    `;
  }
}

customElements.define('inline-audio', InlineAudio);