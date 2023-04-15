import { html } from 'lit';
import '../src/inline-audio.js';

export default {
  title: 'InlineAudio',
  component: 'inline-audio',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ title, backgroundColor }) {
  return html`
    <inline-audio
      style="--inline-audio-background-color: ${backgroundColor || 'white'}"
      .title=${title}
    >
    </inline-audio>
  `;
}

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
