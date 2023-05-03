import { html, css } from 'lit';
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

  // Listens for changes in audio object's time position through "timeUpdate" property, constantly fires
  handleProgress(){
    const audio = this.shadowRoot.querySelector(".player");
    const container = this.shadowRoot.querySelector(".container");

    // If audio object has finished, flags audioController as false to reset assets
    if(audio.ended){
      this.audioController(false);
      container.style.background = "var(--simple-colors-default-theme-grey-4)";
    }
    // If audio object is playing, uses duration and current position to generate completion percentage
    if(!audio.paused){
      var audioDuration = audio.duration;
      var audioCurrentTime = audio.currentTime;
      var progressPercentage = (audioCurrentTime / audioDuration)*100;
      // Provides a blur to ease the gradient transition
      var progressBlur = progressPercentage + 3;
      // Percentage used to change progress of gradient on component's background
      container.style.background = `linear-gradient(90deg, var(--simple-colors-default-theme-accent-4) 0% ${progressPercentage}%, var(--simple-colors-default-theme-grey-4) ${progressBlur}% 100%)`;
    }
  }

  // Function applies external source to audio object and starts the load process
  loadAudio(source) {
    const audioFile = this.shadowRoot.querySelector('.player');
    audioFile.src = source;
    console.log("Source set");
    audioFile.load();
    console.log("Actually loaded");
  }

  // Listens for audio object to flag "canplaythrough" property once source has fully loaded to prevent buffering
  handlePlaythrough(){
    console.log("Steve is alive")
    setTimeout(() => {
      console.log("Loading finished");
      this.canPlay = true;
      this.audioController(true);
    }, 500); 
  }

  // Function takes in boolean to determine action, used across other functions
  audioController(playState){
    const audio = this.shadowRoot.querySelector('.player');

    // Flags playing boolean as true, starts audio object, and matches states of icons and accessibility
    if(playState){
      audio.play();
      this.playing = true;
      this.icon = "av:pause";
      this.aria = "Select to pause a related audio clip";
      this.title = "Pause";
      console.log(this.playing);
    }
    // Flags playing boolean as false, stops audio object, and matches state of icons and accessibility
    else{
      audio.pause();
      this.playing = false;
      this.icon = "av:play-arrow";
      this.aria = "Select to play a related audio clip";
      this.title = "Play"
      console.log(this.playing);
    }
  }

  // When click event is flagged, listens for the state of audio object
  handleClickEvent(){
    const audio = this.shadowRoot.querySelector('.player');
    const selection = window.getSelection();

    // Function will only propagate if there is no selected content
    if(!selection.toString()){
      // Icon state changed to loading, and loadAudio will run on first execution
      if(!audio.hasAttribute("src")){
        this.icon = "hax:loading";
        this.loadAudio(this.source);
      } 
      // Subsequent executions will trigger audioController based on state of audio object
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

  // Updated lifecycle dispatches a custom event listener when play boolean changes state
  updated(changedProperties){
    changedProperties.forEach((oldValue, propName)=>{
      if(propName === "playing"){
        this.dispatchEvent(new CustomEvent('playing-changed', {
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
        <!-- Clickable div containing audio player elements -->
        <div class="container" @click="${this.handleClickEvent}"> 
          <!-- A11y accessible -->
          <simple-icon-button class="icon" title="${this.title}" aria-label="${this.aria}" icon="${this.icon}"></simple-icon-button>
          <slot></slot>
          <audio class="player" type="audio/mpeg" @canplaythrough="${this.handlePlaythrough}" @timeupdate="${this.handleProgress}"></audio>
        </div>
    `;
  }
}

customElements.define('inline-audio', InlineAudio);