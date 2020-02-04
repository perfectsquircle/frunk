import { mount } from './frunk.js';

const app = function App(props, { getState, setState, h }) {
  return (
    <div class="foo">
      <h2>Todo list:</h2>
      <map
        iterable={getState(state => state.todos)}
        callback={(todo, i) => (
          <div>
            <span>{todo.name}</span>
            <input
              type="checkbox"
              checked={todo.done}
              onchange={e =>
                setState(
                  state => (state.todos[i].done = e.currentTarget.checked)
                )
              }
            />
          </div>
        )}
      />
      <button
        onclick={e =>
          setState(state => state.todos.push({ name: 'Get rich', done: false }))
        }
      >
        Add Todo
      </button>
      <hr />
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
  message: 'Hello, World!',
  todos: [
    {
      name: 'Get lit.',
      done: false
    },
    { name: 'Get woke.', done: false }
  ]
});
