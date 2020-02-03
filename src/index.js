import { mount, h } from './frunk.js';

const app = function App(props, state) {
  return (
    <div class="foo">
      <p>{state.message}</p>
      <a href="http://example.org">Linky link link!</a>
      <br />
      <Thing yes={state.yes} />
    </div>
  );
};

function Thing({ yes }, state) {
  return (
    <button
      onclick={e => {
        console.log('Here!', e);
        state.message = 'Ouch!!! ' + Math.random();
        state.yes = !state.yes;
      }}
    >
      Zoinks
      {yes && <strong>YASSS! YASSS!</strong>}
    </button>
  );
}

mount(app, document.querySelector('#root'), { message: 'Hello, World!' });
