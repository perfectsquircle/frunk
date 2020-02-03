const CREATE_ELEMENT = Symbol('CREATE_ELEMENT');
const REPLACE_ELEMENT = Symbol('REPLACE_ELEMENT');
const REMOVE_ELEMENT = Symbol('REMOVE_ELEMENT');
const SET_TEXT = Symbol('SET_TEXT');
const SET_ATTRIBUTE = Symbol('SET_ATTRIBUTE');
const REMOVE_ATTRIBUTE = Symbol('REMOVE_ATTRIBUTE');
const eq = Object.is;

export function* diff(prevNode, nextNode, path = '0') {
  if (!nextNode) {
    yield action(REMOVE_ELEMENT, path);
    return;
  }

  if (typeof prevNode !== typeof nextNode || prevNode.name !== nextNode.name) {
    yield action(REPLACE_ELEMENT, path, nextNode);
  } else if (typeof prevNode === 'string' && typeof nextNode === 'string') {
    if (prevNode !== nextNode) {
      yield action(SET_TEXT, path, nextNode);
    }
    return;
  }

  yield action(CREATE_ELEMENT, path, nextNode);

  const allKeys = new Set([
    ...Object.keys(prevNode.props),
    ...Object.keys(nextNode.props)
  ]);
  for (const key of allKeys) {
    if (key in prevNode.props && !(key in nextNode.props)) {
      yield action(REMOVE_ATTRIBUTE, path, { key });
    } else if (!eq(prevNode.props[key], nextNode.props[key])) {
      yield action(SET_ATTRIBUTE, path, nextNode.props[key], {
        key,
        value: nextNode.props[key]
      });
    }
  }
  for (
    let i = Math.max(prevNode.children.length, nextNode.children.length);
    i >= 0;
    i--
  ) {
    const prevChild = prevNode.children[i];
    const nextChild = nextNode.children[i];
    yield* diff(prevChild, nextChild, `${path}/${i}`);
  }
}

function action(type, path, payload) {
  return { type, path, payload };
}
