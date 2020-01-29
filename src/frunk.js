/**
 * Mount!
 * @param {Function} node
 * @param {Node} node
 */
export function mount(app, node, initialState = {}) {
  const state = new Proxy(initialState, {
    get(obj, prop) {
      return obj[prop];
    },
    set(obj, prop, nextValue) {
      if (prop in obj) {
        const prevValue = obj[prop];
        const changed = !Object.is(prevValue, nextValue);
        if (changed) {
          obj[prop] = nextValue;
          triggerRender();
        }
        return true;
      }
    }
  });

  const render = () => objectToNode(app({}, state), state);

  const triggerRender = () => {
    window.requestAnimationFrame(() => {
      const nextDom = render();
      // const diff = diff(dom, nextDom);
      node.removeChild(dom);
      node.appendChild(nextDom);
    });
  };

  const dom = render();
  node.appendChild(dom);
}

const template = document.createElement('template');

export function html(text) {
  template.innerHTML = text;
  return template.content.cloneNode(true);
}

/**
 *
 * @param {String} name
 * @param {Object} props
 * @param {Array} children
 */
export function h(name = 'div', props = {}, ...children) {
  return { name, props, children };
}

function* arrayToNodes(nodes, state) {
  for (const node of nodes) {
    if (typeof node.name === 'function') {
      yield objectToNode(node.name(node.props, state), state);
    } else {
      yield objectToNode(node, state);
    }
  }
}

function objectToNode(node, state) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  const element = document.createElement(node.name);
  if (node.props) {
    for (const prop of Object.keys(node.props)) {
      if (prop.startsWith('on') && typeof node.props[prop] === 'function') {
        const eventType = prop.replace('on', '');
        element.addEventListener(eventType, node.props[prop], {
          capture: false,
          passive: true
        });
        continue;
      }
      element.setAttribute(prop, node.props[prop]);
    }
  }
  if (node.children) {
    for (const child of arrayToNodes(node.children, state)) {
      element.appendChild(child);
    }
  }
  return element;
}
