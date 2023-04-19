import { LitElement, html, css } from 'lit';
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";

class InlineAudio extends LitElement {
  static properties = {
    source: { type: String, reflect: true},
    icon: { type: String},
    playing: { type: Boolean, reflect: true},
    canPlay: { type: Boolean, reflect: true}
  }

  static styles = css`
    :host {
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
      font-size: 18px;
      /* cursor: pointer; */
    }
    .icon-spacing{
      padding-right: 8px;
    }
  `;

  constructor() {
    super();
    this.source = '';
    this.icon = "av:play-arrow";
    this.playing = false;
    this.canPlay = false;
  }

  handleProgress(){
    if(this.shadowRoot.querySelector(".player").ended){
      this.audioController();
    }
    var audioDuration = this.shadowRoot.querySelector(".player").duration;
    var audioCurrentTime = this.shadowRoot.querySelector(".player").currentTime;
    var progressPercentage = (audioCurrentTime / audioDuration)*100;
    this.shadowRoot.querySelector(".container").style.background = `linear-gradient(90deg, orange 0% ${progressPercentage}%, grey ${progressPercentage}% 100%)`;
  }

  loadAudio(source) {
    const audioFile = this.shadowRoot.querySelector('.player');
    audioFile.src = source;
    audioFile.load();
  }

  handlePlaythrough(){
    console.log("Loading finished");
    this.canPlay = true;
    this.audioController();
  }

  audioController(){
    var audio = this.shadowRoot.querySelector('.player');
    if(audio.paused){
      audio.play();
      this.playing = true;
      this.icon = "av:pause";
      console.log(this.playing);
    }
    else{
      audio.pause();
      this.playing = false;
      this.icon = "av:play-arrow";
      console.log(this.playing);
    }
  }

  handleClickEvent(){
    if(!this.shadowRoot.querySelector('.player').hasAttribute("src")){
      this.icon = "hax:loading";
      this.loadAudio(this.source);
    }

    if(this.canPlay){
      this.audioController();
    }
  }

  render() {
    return html`
      <div class="container"> 
        <simple-icon-button class="icon-spacing" icon="${this.icon}" @click="${this.handleClickEvent}"></simple-icon-button>
        <slot></slot>
        <audio class="player" type="audio/mpeg" @canplaythrough="${this.handlePlaythrough}" @timeupdate="${this.handleProgress}"></audio>
      <div>
    `;
  }
}

customElements.define('inline-audio', InlineAudio);