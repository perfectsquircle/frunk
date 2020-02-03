function patch(prevNode, nextNode, state) {
  if (typeof prevNode === 'string' && typeof nextNode === 'string') {
    return document.createTextNode(nextNode);
  }

  if (
    typeof prevNode !== typeof nextNode ||
    !eq(prevNode.name, nextNode.name)
  ) {
    if (prevNode && prevNode.element) prevNode.element.remove();
    return nodeToElement(nextNode, state);
  }

  const element = prevNode.element;

  const allKeys = [
    ...Object.keys(prevNode.props),
    ...Object.keys(nextNode.props)
  ];
  for (const key of allKeys) {
    if (key in prevNode.props && !(key in nextNode.props)) {
      element.removeAttribute(key);
    } else if (!eq(prevNode.props[key], nextNode.props[key])) {
      setAttribute(element, key, nextNode.props[key]);
    }
  }

  for (
    let i = 0;
    i < Math.max(prevNode.children.length, nextNode.children.length);
    i++
  ) {
    const prevChild = prevNode.children[i];
    const nextChild = nextNode.children[i];
    if (prevChild && !nextChild) {
      prevChild.element.remove();
    } else if (!prevChild && nextChild) {
      element.appendChild(nodeToElement(nextChild, state));
    } else {
      patch(prevChild, nextChild);
    }
  }

  return element;
}
