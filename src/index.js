import { mount } from './frunk.js';

const app = function App(props, { getState, setState, h }) {
  return (
    <div class="foo">
      <h2>My todo list:</h2>
      <map
        iterable={getState(state => state.todos)}
        callback={(todo, i) => (
          <div>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onchange={e =>
                  setState(
                    state => (state.todos[i].done = e.currentTarget.checked)
                  )
                }
              />
              {todo.name}
            </label>
          </div>
        )}
      />
      <form
        onsubmit={e => {
          e.preventDefault();
          setState(state =>
            state.todos.push({ name: e.currentTarget.todo.value, done: false })
          );
          e.currentTarget.todo.value = '';
          return false;
        }}
      >
        <input type="text" name="todo" />
        <button>Add Todo</button>
      </form>
    </div>
  );
};

mount(app, document.querySelector('#root'), {
  todos: [
    {
      name: 'Get lit.',
      done: false
    },
    { name: 'Get woke.', done: false }
  ],
  nextTodo: ''
});
