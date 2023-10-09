function findCommonAncestor(element1, element2) {
  const ancestors1 = [];
  let currentElement = element1;

  // Store all ancestors of element1 in an array
  while (currentElement !== document.body) {
    ancestors1.push(currentElement.parentNode);
    currentElement = currentElement.parentNode;
  }

  currentElement = element2;

  // Traverse the ancestors of element2 and check if any match element1's ancestors
  while (currentElement !== document.body) {
    if (ancestors1.includes(currentElement.parentNode)) {
      return currentElement.parentNode;
    }
    currentElement = currentElement.parentNode;
  }

  // If no common ancestor is found, return null
  return null;
}

export default findCommonAncestor;
