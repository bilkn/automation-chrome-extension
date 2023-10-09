const createSelectorTemplate = (node, count) => {
  let currentNode = node;
  const parentSelectors = [];
  for (let i = 0; i < count; i++) {
    if (!currentNode) break;
    parentSelectors.push({
      // TODO: Add CSS Escape polyfill
      className: Array.from(currentNode.classList).join("."),
      tagName: currentNode.tagName,
    });
    currentNode = currentNode.parentElement;
  }
  return parentSelectors;
};

const createSelectorTemplateUntilParentNode = (node, untilNode, options) => {
  // Added to prevent infinite loop
  const MAX_LIMIT = 1000;
  let currentNode = node;
  const { excludedClasses = [] } = options;
  const parentSelectors = [];
  for (let i = 0; i < MAX_LIMIT; i++) {
    if (!currentNode) break;
    const className = Array.from(currentNode.classList)
      .filter((subClassName) => !excludedClasses.includes(subClassName))
      .join(".");
    parentSelectors.push({
      // TODO: Add CSS Escape polyfill
      className,
      tagName: currentNode.tagName,
    });
    if (currentNode.isSameNode(untilNode)) {
      break;
    }

    currentNode = currentNode.parentElement;
  }
  return parentSelectors;
};

const createSelectorFromTemplate = (template) => {
  return template.reverse().reduce((selector, cur) => {
    let str = "";
    const { tagName, className } = cur;
    str += tagName.toLowerCase();
    if (className) {
      str += `.${className}`;
    }
    selector += str + " ";
    return selector;
  }, "");
};

export default {
  createSelectorFromTemplate,
  createSelectorTemplate,
  createSelectorTemplateUntilParentNode,
};
