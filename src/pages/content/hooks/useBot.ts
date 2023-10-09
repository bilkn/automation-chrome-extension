import _ from "lodash";
import React from "react";
import templator from "../helpers/templator";
import classHelpers from "../helpers/classHelpers";
import { findCommonAncestor } from "../helpers";

function useBot() {
  const lastHoveredElement = React.useRef(null);
  const isElementSelected = React.useRef(null);
  const [selectedElements, setSelectedElements] = React.useState([]);
  // TODO: Handle when the route changes
  React.useEffect(() => {
    const isBothElementsSelected = selectedElements.length >= 2;
    const outlinePredictedElements = (clickedElt) => {
      console.log({ clickedElt });
      const selectorTemplate = templator.createSelectorTemplateUntilParentNode(
        clickedElt,
        commonAncestor,
        { excludedClasses: ["selected-element"] }
      );
      console.log({ selectorTemplate });
      const selector = templator.createSelectorFromTemplate(selectorTemplate);
      console.log("selector", selector);
      classHelpers.addClassBySelector(selector, "predicted-element");
    };

    let commonAncestor;
    if (isBothElementsSelected) {
      const [elt1, elt2] = selectedElements;
      commonAncestor = findCommonAncestor(elt1, elt2);
      commonAncestor.classList.add("common-ancestor");
      const predictedElements = document.querySelectorAll(".predicted-element");
      if (!predictedElements.length) return;
      predictedElements.forEach((elt) =>
        elt.classList.remove("predicted-element")
      );
      outlinePredictedElements(elt2);
      console.log({ commonAncestor });
    }

    const handleClickEvent = (e) => {
      isElementSelected.current = true;
      e.stopPropagation();
      e.preventDefault();
      if (!e.target.classList.contains("predicted-element")) return;
      e.target.classList.add("selected-element");
      setSelectedElements((prevElements) => [...prevElements, e.target]);
    };
    document.addEventListener("click", handleClickEvent, { capture: true });
    return () => removeEventListener("click", handleClickEvent);
  }, [selectedElements]);

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      if (isElementSelected.current) return;

      const lastElementCurrent = lastHoveredElement.current;
      e.stopPropagation();

      const selectorTemplate = templator.createSelectorTemplate(e.target, 5);
      const selector = templator.createSelectorFromTemplate(selectorTemplate);
      classHelpers.addClassBySelector(selector, "predicted-element");

      if (lastElementCurrent && !e.target.isSameNode(lastElementCurrent)) {
        classHelpers.removeClassBySelector(
          ".predicted-element",
          "predicted-element"
        );
        lastHoveredElement.current.classList.remove("hovered-element");
      } else {
        e.target.classList.add("hovered-element");
      }
      lastHoveredElement.current = e.target;
      console.log("HANDLE MOUSE MOVE");
    };

    const throttledMouseMoveHandler = _.throttle(handleMouseMove, 30);

    document.addEventListener("mousemove", throttledMouseMoveHandler);
    return () => removeEventListener("mousemove", throttledMouseMoveHandler);
  }, []);

  return { selectedElements };
}

export default useBot;
