import { mount } from './frunk.js';

const app = function App(props, { state, h }) {
  return (
    <div class="foo">
      <h2>My todo list:</h2>
      <map
        iterable={state.todos}
        callback={(todo, i) => (
          <div key={i}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onchange={e => (state.todos[i].done = e.currentTarget.checked)}
              />
              {todo.name}
            </label>
          </div>
        )}
      />
      <form
        onsubmit={e => {
          e.preventDefault();
          state.todos.push({ name: e.currentTarget.todo.value, done: false });
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
      done: false,
    },
    { name: 'Get woke.', done: false },
  ],
  nextTodo: '',
});
