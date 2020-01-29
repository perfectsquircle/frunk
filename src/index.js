import { mount, h } from './frunk.js';

const app = function App() {
  return (
    <div class="foo">
      <p>Hello, world!</p>
      <a href="http://example.org">Linky link link</a>
      <Thing yes={true} />
    </div>
  );
};

function Thing({ yes }) {
  if (yes) {
    return h('div', {}, 'ZOINKS!');
  }
}

mount(app, document.querySelector('#root'));
