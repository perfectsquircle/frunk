import { mount, h } from './frunk.js';

const app = function App(props, state) {
  return (
    <div class="foo">
      <p>{state.message}</p>
      <a href="http://example.org">Linky link link!</a>
      <br />
      <Thing yes={true} />
    </div>
  );
};

function Thing({ yes }, state) {
  if (yes) {
    return (
      <button
        onclick={e => {
          console.log('Here!', e);
          state.message = 'Ouch!!!';
        }}
      >
        Zoinks
      </button>
    );
  }
}

mount(app, document.querySelector('#root'), { message: 'Hello, World!' });
