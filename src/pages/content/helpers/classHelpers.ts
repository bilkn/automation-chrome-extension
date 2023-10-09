const addClassBySelector = (selector, className) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((elt) => elt.classList.add(className));
};

const removeClassBySelector = (selector, className) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((elt) => elt.classList.remove(className));
};

export default { addClassBySelector, removeClassBySelector };
