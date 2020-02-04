import { mount, h, Map } from './frunk.js';

const app = function App(props, state) {
  return (
    <div class="foo">
      <h2>Todo list:</h2>
      <Map
        iterable={state.todos}
        callback={todo => (
          <div>
            <span>{todo.name}</span>
            <input
              type="checkbox"
              value={todo.done}
              onchange={e => (todo.done = e.currentTarget.checked)}
            />
          </div>
        )}
      />
      <button
        onclick={e => state.todos().push({ name: 'Get rich', done: false })}
      >
        Add Todo
      </button>
      <hr />
      <p>{state.message}</p>
      <p title="Hello" style={{ backgroundColor: 'yellow' }}>
        This does work: {state.message}
      </p>
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
