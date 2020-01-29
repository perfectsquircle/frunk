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

function* arrayToNodes(nodes) {
  for (const node of nodes) {
    if (typeof node.name === 'function') {
      yield objectToNode(node.name(node.props));
    } else {
      yield objectToNode(node);
    }
  }
}

function objectToNode(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  const element = document.createElement(node.name);
  if (node.props) {
    for (const prop of Object.keys(node.props)) {
      element.setAttribute(prop, node.props[prop]);
    }
  }
  if (node.children) {
    for (const child of arrayToNodes(node.children)) {
      element.appendChild(child);
    }
  }
  return element;
}
