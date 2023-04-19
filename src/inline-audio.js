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
    .kevin{
      pointer-events: none;
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
      this.playing = false;
      this.icon = "av:play-arrow";
      console.log(this.playing);
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

  bufferListener(){
    console.log("Loading finished");
    this.canPlay = true;
    this.shadowRoot.querySelector('.player').play();
    this.playing = true;
    this.icon = "av:pause";
    console.log(this.playing);
  }

  handleClickEvent(){
    var audio = this.shadowRoot.querySelector('.player');
    if(!audio.hasAttribute("src")){
      this.icon = "hax:loading";
      this.loadAudio(this.source);
    }

    if(this.canPlay){
        if(this.shadowRoot.querySelector('audio').paused){
          this.shadowRoot.querySelector('.player').play();
          this.playing = true;
          this.icon = "av:pause";
          console.log(this.playing);
        }
        else{
          this.shadowRoot.querySelector('.player').pause();
          this.playing = false;
          this.icon = "av:play-arrow";
          console.log(this.playing);
        }
      }
  }

  render() {
    return html`
      <div class="container"> 
        <simple-icon-button class="icon-spacing" icon="${this.icon}" @click="${this.handleClickEvent}"></simple-icon-button>
        <slot class="kevin"></slot>
        <audio class="player" type="audio/mpeg" @canplaythrough="${this.bufferListener}" @timeupdate="${this.handleProgress}"></audio>
      <div>
    `;
  }
}

customElements.define('inline-audio', InlineAudio);