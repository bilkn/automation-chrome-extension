import _ from "lodash";
import React from "react";
import templator from "../helpers/templator";

function useBot() {
  const lastHoveredElement = React.useRef(null);
  const [selectedElements, setSelectedElements] = React.useState(null);

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

      const selectors = templator.createSelectorTemplate(e.target, 5);
      console.log({ selectors });
      const selector = templator.createSelectorFromTemplate(selectors);
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
  }, []);
  return { selectedElements };
}

export default useBot;
