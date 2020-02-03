import { mount, h, Map } from './frunk.js';

const app = function App(props, state) {
  return (
    <div class="foo">
      <p>{state.message}</p>
      <p title="Hello" style={{ backgroundColor: 'yellow' }}>
        This does work: {state.message}
      </p>
      <a href="http://example.org" data-title={state.message + 'nope'}>
        Linky link link!
      </a>
      <br />
      <Map
        iterable={state.todos}
        callback={todo => (
          <div>
            <p>{todo.name}</p>
            <input type="checkbox" checked={todo.done} />
          </div>
        )}
      />
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

mount(app, document.querySelector('#root'), {
  message: 'Hello, World!',
  todos: [
    {
      name: 'Get lit.',
      done: false
    },
    { name: 'Get woke.', done: false }
  ]
});
