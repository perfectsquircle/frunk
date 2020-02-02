const eq = Object.is;
const defer = window.requestAnimationFrame;
const emptyObject = Object.freeze({});
const emptyArray = Object.freeze([]);

/**
 * Mount!
 * @param {Function} node
 * @param {Node} node
 */
export function mount(app, node, initialState = {}) {
  const listeners = [];
  const state = new Proxy(initialState, {
    get(obj, prop) {
      // return obj[prop];
      return listener => {
        if (listener) listeners.push(listener);
        return obj[prop];
      };
    },
    set(obj, prop, nextValue) {
      if (prop in obj) {
        const prevValue = obj[prop];
        const changed = !eq(prevValue, nextValue);
        if (changed) {
          obj[prop] = nextValue;
          triggerRender();
        }
        return true;
      }
    }
  });

  const render = () => app({}, state);
  const toDom = rootNode => nodeToElement(rootNode, state);

  const triggerRender = () => {
    defer(() => {
      listeners.forEach(l => l());
    });
  };

  let prevRoot = render();
  let prevDom = toDom(prevRoot);
  node.appendChild(prevDom);
}

/**
 *
 * @param {String} name
 * @param {Object} props
 * @param {Array} children
 */
export function h(name, props, ...children) {
  return {
    name,
    props: props ?? emptyObject,
    children: children ?? emptyArray
  };
}

function* nodesToElements(nodes, state) {
  for (const node of nodes) {
    if (typeof node.name === 'function') {
      yield nodeToElement(node.name(node.props, state), state);
    } else {
      yield nodeToElement(node, state);
    }
  }
}

function nodeToElement(node, state) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  } else if (typeof node === 'function') {
    const textNode = document.createTextNode(
      node(() => {
        textNode.data = node();
      })
    );
    return textNode;
  }

  const element = document.createElement(node.name);
  node.element = element;
  for (const prop of Object.keys(node.props)) {
    setAttribute(element, prop, node.props[prop]);
  }
  for (const child of nodesToElements(node.children, state)) {
    element.appendChild(child);
  }
  return element;
}

function setAttribute(element, prop, value) {
  if (prop.startsWith('on') && typeof value === 'function') {
    const eventType = prop.replace('on', '');
    element.addEventListener(eventType, value, {
      capture: false,
      passive: true
    });
  } else if (typeof value === 'function') {
    element.setAttribute(
      prop,
      value(() => {
        element.setAttribute(prop, value());
      })
    );
  } else {
    element.setAttribute(prop, value);
  }
}

function Map() {}

function If() {}
