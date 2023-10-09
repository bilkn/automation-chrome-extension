import _ from "lodash";
import React from "react";

function useBot() {
  const lastHoveredElement = React.useRef(null);

  const createSelectorTemplate = React.useCallback((node, count) => {
    let currentNode = node;
    const parentSelectors = [];
    for (let i = 0; i < count; i++) {
      if (!currentNode) break;
      parentSelectors.push({
        className: Array.from(currentNode.classList).join("."),
        tagName: currentNode.tagName,
      });
      currentNode = currentNode.parentElement;
    }
    return parentSelectors;
  }, []);

  const createSelectorFromTemplate = React.useCallback((template) => {
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
  }, []);

  React.useEffect(() => {
    console.log("USE EFFECT");
    const addClassBySelector = (selector) => {
      const predictedElements = document.querySelectorAll(selector);
      predictedElements.forEach((elt) =>
        elt.classList.add("predicted-element")
      );
    };

    const removeClassBySelector = (selector) => {
      const predictedElements = document.querySelectorAll(selector);
      predictedElements.forEach((elt) =>
        elt.classList.remove("predicted-element")
      );
    };

    const handleMouseMove = (e) => {
      const lastElementCurrent = lastHoveredElement.current;
      e.stopPropagation();

      const selectors = createSelectorTemplate(e.target, 5);
      console.log({ selectors });
      const selector = createSelectorFromTemplate(selectors);
      console.log({ selector });
      addClassBySelector(selector);

      if (lastElementCurrent && !e.target.isSameNode(lastElementCurrent)) {
        removeClassBySelector(".predicted-element");
        lastHoveredElement.current.classList.remove("hovered-element");
      } else {
        e.target.classList.add("hovered-element");
      }
      lastHoveredElement.current = e.target;
      console.log("HANDLE MOUSE MOVE");
    };

    const throttledMouseMoveHandler = _.throttle(handleMouseMove, 30);

    const listener = document.addEventListener(
      "mousemove",
      throttledMouseMoveHandler
    );
    return () => removeEventListener("mousemove", listener as any);
  }, [createSelectorFromTemplate, createSelectorTemplate]);
  return null;
}

export default useBot;
