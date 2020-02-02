import { mount, h } from './frunk.js';

const app = function App(props, state) {
  return (
    <div class="foo">
      <p>{state.message}</p>
      <p title="Hello">This does work: {state.message}</p>
      <a href="http://example.org" data-title={state.message + 'nope'}>
        Linky link link!
      </a>
      <br />
      <Thing yes={true} />
    </div>
  );
};

function Thing({ yes }, state) {
  return (
    <button
      onclick={e => {
        console.log('Here!', e);
        state.message = 'Ouch!!! ' + Math.random();
      }}
    >
      Zoinks
    </button>
  );
}

mount(app, document.querySelector('#root'), { message: 'Hello, World!' });
