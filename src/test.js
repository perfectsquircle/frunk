import { mount } from './frunk.js';

const app = function App(props, { getState, setState, h }) {
  return (
    <div class="foo">
      <p>{getState(state => state.message)}</p>
      <p title="Hello" style={{ backgroundColor: 'yellow' }}>
        This does work: {getState(state => state.message)}
      </p>
      <a
        href="http://example.org"
        data-title={getState(state => state.message + 'nope')}
      >
        Linky link link!
      </a>
      <br />
      <Thing yes={true} />
    </div>
  );
};

function Thing({ yes }, { getState, setState, h }) {
  return (
    <button
      onclick={e => {
        setState(state => (state.message = 'Ouch!!! ' + Math.random()));
      }}
    >
      Zoinks
    </button>
  );
}

mount(app, document.querySelector('#root'), {
  message: 'Hello, World!'
});
