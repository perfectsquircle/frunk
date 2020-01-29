/**
 * Mount!
 * @param {Function} node
 * @param {Node} node
 */
export function mount(app, node) {
  const dom = objectToNode(app());
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

function* arrayToNodes(virtualDom) {
  for (const n of virtualDom) {
    if (typeof n.name === 'function') {
      const subN = n.name(n.props);
      yield objectToNode(subN);
    } else {
      yield objectToNode(n);
    }
  }
}

function objectToNode(n) {
  if (typeof n === 'string') {
    return document.createTextNode(n);
  }

  const node = document.createElement(n.name);
  if (n.props) {
    for (const prop of Object.keys(n.props)) {
      node.setAttribute(prop, n.props[prop]);
    }
  }
  if (n.children) {
    for (const child of arrayToNodes(n.children)) {
      node.appendChild(child);
    }
  }
  return node;
}
