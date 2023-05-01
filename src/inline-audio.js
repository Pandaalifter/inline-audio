import { LitElement, html, css } from 'lit';
import { SimpleColors } from '@lrnwebcomponents/simple-colors';
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";

class InlineAudio extends SimpleColors {
  static get properties(){
    return{
      ...super.properties,
      source: { type: String, reflect: true},
      icon: { type: String},
      aria: { type: String},
      title: { type: String},
      playing: { type: Boolean, reflect: true},
      canPlay: { type: Boolean}
    }
  }

  static get styles(){ 
    return [...super.styles, css`
    :host {
      --inline-audio-padding: 4px 4px 4px 4px;
      --inline-audio-margin: 8px 2px 8px;
      --inline-audio-border: 0;
      --inline-audio-icon-padding: 0px 4px 0px 0px;

      vertical-align: middle;
    }
    .container {
      display: inline-flex;
      align-items: center;
      min-width: 40px;
      border-radius: 4px;
      cursor: pointer;

      padding: var(--inline-audio-padding);
      background: var(--simple-colors-default-theme-grey-4);
      border: var(--inline-audio-border);
      margin: var(--inline-audio-margin);
    }
    .container:focus-within{
      outline: 2px solid var(--simple-colors-default-theme-accent-4)
    }
    .icon{
      --simple-icon-color: black;
      --simple-icon-button-focus-color: black;
      --simple-icon-button-focus-opacity: 70%;
      --simple-icon-width: 24px;
      --simple-icon-height: 24px;

      padding: var(--inline-audio-icon-padding);
    }
    simple-icon-button::part(button){
      outline: none;
    }
  `];
  }

  constructor() {
    super();
    this.source = '';
    this.icon = "av:play-arrow";
    this.aria = "Select to play a related audio clip";
    this.title = "Play";
    this.playing = false;
    this.canPlay = false;
  }

  handleProgress(){
    const audio = this.shadowRoot.querySelector(".player");
    const container = this.shadowRoot.querySelector(".container");

    if(audio.ended){
      this.audioController(false);
      container.style.background = `linear-gradient(90deg, var(--simple-colors-default-theme-accent-4) 0% 100%, var(--simple-colors-default-theme-grey-4) 100% 100%)`;
    }
    if(!audio.paused){
      var audioDuration = audio.duration;
      var audioCurrentTime = audio.currentTime;
      var progressPercentage = (audioCurrentTime / audioDuration)*100;
      container.style.background = `linear-gradient(90deg, var(--simple-colors-default-theme-accent-4) 0% ${progressPercentage}%, var(--simple-colors-default-theme-grey-4) ${progressPercentage}% 100%)`;
    }
  }

  loadAudio(source) {
    const audioFile = this.shadowRoot.querySelector('.player');
    audioFile.src = source;
    audioFile.load();
  }

  handlePlaythrough(){
    setTimeout(() => {
      console.log("Loading finished");
      this.canPlay = true;
      this.audioController(true);
    }, 500); 
  }

  audioController(playState){
    const audio = this.shadowRoot.querySelector('.player');
    if(playState){
      audio.play();
      this.playing = true;
      this.icon = "av:pause";
      this.aria = "Select to pause a related audio clip";
      this.title = "Pause";
      console.log(this.playing);
    }
    else{
      audio.pause();
      this.playing = false;
      this.icon = "av:play-arrow";
      this.aria = "Select to play a related audio clip";
      this.title = "Play"
      console.log(this.playing);
    }
  }

  handleClickEvent(){
    const audio = this.shadowRoot.querySelector('.player');
    const selection = this.shadowRoot.getSelection();

    if(!selection.toString()){
      if(!audio.hasAttribute("src")){
        this.icon = "hax:loading";
        this.loadAudio(this.source);
      } 
      else if(this.canPlay){
        if(audio.paused){
          this.audioController(true);
        }
        else{
          this.audioController(false);
        }
      }
    }
  }

  updated(changedProperties){
    changedProperties.forEach((oldValue, propName)=>{
      if(propName === "playing"){
        this.dispatchEvent(new CustomEvent('opened-changed', {
          composed: true,
          bubbles: true,
          cancelable: false,
          detail:{
            value: this[propName]
          }
        }));
        console.log(`"${propName}" property has changed. oldValue: ${oldValue}`);
      }
    });
  }

  render() {
    return html`
        <div class="container" @click="${this.handleClickEvent}"> 
          <simple-icon-button class="icon" title="${this.title}" aria-label="${this.aria}" icon="${this.icon}"></simple-icon-button>
          <slot></slot>
          <audio class="player" type="audio/mpeg" @canplaythrough="${this.handlePlaythrough}" @timeupdate="${this.handleProgress}"></audio>
        </div>
    `;
  }
}

customElements.define('inline-audio', InlineAudio);