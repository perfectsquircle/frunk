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
  const rawState = (window.state = { ...initialState });
  const context = {
    state: ObjectProxy(rawState),
  };
  context.h = h.bind(context);

  let rootNode = app({}, context);
  let rootDom = nodeToElement(rootNode, context);
  node.appendChild(rootDom);
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
    children: children ?? emptyArray,
  };
}

function* nodesToElements(nodes, context) {
  for (const node of nodes) {
    if (typeof node === 'string') {
      yield document.createTextNode(node);
    } else if (node.subscribe) {
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
  if (node.name === 'map') {
    const element = document.createElement(node.name);
    const { iterable, callback } = node.props;

    if (iterable.subscribe) {
      iterable.forEach((thing, i) => {
        const nextChild = nodeToElement(callback(thing, i), context);
        element.appendChild(nextChild);
      });
      iterable.subscribe((target, key, value) => {
        let children = [...element.children];
        children[key] = nodeToElement(
          callback(target[key], parseInt(key), context)
        );
        children.forEach(child => element.appendChild(child));
      });
    } else {
      const nextChildren = nodesToElements(
        [...map(iterable, callback)],
        context
      );

      for (const child of nextChildren) {
        element.appendChild(child);
      }
    }

    return element;
  }

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
      passive: false,
    });
  } else if (prop === 'checked') {
    if (value.subscribe) {
      value.subscribe(nextValue => {
        element.checked = !!nextValue;
      });
    } else {
      element.checked = !!value;
    }
  } else if (prop === 'style') {
    for (let key of Object.keys(value)) {
      element.style[key] = value[key];
    }
  } else if (value.subscribe) {
    value.subscribe(nextValue => {
      element.setAttribute(prop, nextValue);
    });
  } else {
    element.setAttribute(prop, value);
  }
}

function* map(iterable, callback) {
  let i = 0;

  for (const element of iterable) {
    yield callback(element, i++);
  }
}

function ObjectProxy(obj) {
  const clone = {};

  for (let key in obj) {
    switch (true) {
      case Array.isArray(obj[key]):
        clone[key] = ArrayProxy(obj[key]);
        break;
      case typeof obj[key] === 'object':
        clone[key] = ObjectProxy(obj[key]);
        break;
      default:
        clone[key] = obj[key];
    }
  }

  const sideEffects = [];
  clone.subscribe = sideEffect => {
    sideEffects.push(sideEffect);
  };
  function update() {
    defer(() => {
      sideEffects.forEach(s);
    });
  }

  const objectProxy = new Proxy(clone, {
    get(target, key) {
      return target[key];
    },

    set(target, key, value) {
      target[key] = value;
      update();
      return true;
    },
  });

  return objectProxy;
}

function ArrayProxy(array) {
  const clone = [...array];
  const sideEffects = [];
  clone.subscribe = sideEffect => {
    sideEffects.push(sideEffect);
  };
  function update(target, key, value) {
    defer(() => {
      sideEffects.forEach(s => s(target, key, value));
    });
  }

  return new Proxy(clone, {
    get(target, key) {
      return target[key];
    },

    set(target, key, value) {
      console.log(target, key, value);
      target[key] = value;
      update(target, key, value);
      return true;
    },
  });
}
