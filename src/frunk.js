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

  const state = (window.state = { ...initialState });

  const context = {
    // state,
    getState(cb) {
      const accessor = new StateAccessor(cb, state);
      listeners.push(accessor);
      return accessor;
    },
    setState(cb) {
      const result = cb(state);
      triggerRender();
      return result;
    }
  };
  context.h = h.bind(context);

  const triggerRender = () => {
    defer(() => {
      listeners.forEach(l => l.update());
    });
  };

  let rootNode = app({}, context);
  let rootDom = nodeToElement(rootNode, context);
  node.appendChild(rootDom);
}

export class StateAccessor {
  constructor(accessor, state) {
    this.accessor = accessor;
    this.state = state;
  }

  subscribe(sideEffect) {
    this.sideEffect = sideEffect;
    this.update();
  }

  update() {
    this.sideEffect(this.getValue());
  }

  getValue() {
    return this.accessor(this.state);
  }
}

/**
 *
 * @param {String|Function} name
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

function* nodesToElements(nodes, context) {
  for (const node of nodes) {
    if (typeof node === 'string') {
      yield document.createTextNode(node);
    } else if (node instanceof StateAccessor) {
      const textNode = document.createTextNode(node.getValue());
      node.subscribe(nextValue => {
        textNode.textContent = nextValue;
      });
      yield textNode;
    } else {
      yield createElement(node, context);
    }
  }
}

function createElement(node, context) {
  switch (typeof node.name) {
    case 'string':
      // This is a normal node. Create an element.
      return nodeToElement(node, context);
    case 'function':
      // If name is a function, it's another component.
      const rendered = node.name(node.props, context);
      return nodeToElement(rendered, context);
  }
}

function nodeToElement(node, context) {
  const element = document.createElement(node.name);
  node.element = element;
  for (const prop of Object.keys(node.props)) {
    setAttribute(element, prop, node.props[prop]);
  }
  for (const child of nodesToElements(node.children, context)) {
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
  } else if (prop === 'style') {
    for (let key of Object.keys(value)) {
      element.style[key] = value[key];
    }
  } else if (value instanceof StateAccessor) {
    value.subscribe(nextValue => {
      element.setAttribute(prop, nextValue);
    });
  } else {
    element.setAttribute(prop, value);
  }
}

export function* OldMap({ iterable, callback }) {
  for (const element of iterable) {
    yield callback(element);
  }
}

export function Map({ iterable, callback }) {
  const mapRoot = document.createElement('div');
  if (iterable instanceof StateAccessor) {
    // iterable will be a StateAccessor if it came from state.
    iterable.subscribe(nextValue => {});
  }
  // for (const element of iterable) {
  //   yield callback(element);
  // }
  return mapRoot;
}

export function If({ condition, children }) {
  const display = condition ? 'initial' : 'block';
  // return <div style={{ display }}>{children}</div>;
  return h();
}
