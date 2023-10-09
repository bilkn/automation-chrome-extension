import _ from "lodash";
import React from "react";
import templator from "../helpers/templator";
import classHelpers from "../helpers/classHelpers";
import { findCommonAncestor } from "../helpers";
import { BOT_KEYS } from "../constants";

function useBot() {
  const lastHoveredElement = React.useRef(null);
  const isElementSelected = React.useRef(null);
  const [selectedElements, setSelectedElements] = React.useState([]);
  const [isEditModeOpen, setIsEditModeOpen] = React.useState(true);
  console.log({ lastHoveredElement, isElementSelected, selectedElements });

  // TODO: Handle when the route changes

  const handleDocumentClickEvent = React.useCallback(
    (e) => {
      const rootContainer = document.getElementById("browser-buddy-root");
      console.log(isEditModeOpen);
      console.log("DOCUMENT CLICK");
      if (!isEditModeOpen) {
        return;
      } else if (
        rootContainer.contains(e.target) ||
        e.target.getAttribute(BOT_KEYS.BOT_TARGET)
      )
        return;
      console.log("STOP PROPAGATION");
      isElementSelected.current = true;
      e.stopPropagation();
      e.preventDefault();
      if (!e.target.classList.contains(BOT_KEYS.PREDICTED_ELEMENT)) return;
      e.target.classList.add(BOT_KEYS.SELECTED_ELEMENT);
      setSelectedElements((prevElements) => [...prevElements, e.target]);
    },
    [isEditModeOpen]
  );

  React.useEffect(() => {
    const isBothElementsSelected = selectedElements.length >= 2;
    const outlinePredictedElements = (clickedElt) => {
      console.log({ clickedElt });
      const selectorTemplate = templator.createSelectorTemplateUntilParentNode(
        clickedElt,
        commonAncestor,
        { excludedClasses: [BOT_KEYS.SELECTED_ELEMENT] }
      );
      console.log({ selectorTemplate });
      const selector = templator.createSelectorFromTemplate(selectorTemplate);
      console.log("selector", selector);
      classHelpers.addClassBySelector(selector, BOT_KEYS.PREDICTED_ELEMENT);
    };

    let commonAncestor;
    // Finds common ancestor and removes other predicted elements other than ancestor's children
    if (isBothElementsSelected) {
      const [elt1, elt2] = selectedElements;
      commonAncestor = findCommonAncestor(elt1, elt2);
      commonAncestor.classList.add(BOT_KEYS.COMMON_ANCESTOR);
      const predictedElements = document.querySelectorAll(".predicted-element");
      if (!predictedElements.length) return;
      predictedElements.forEach((elt) =>
        elt.classList.remove(BOT_KEYS.PREDICTED_ELEMENT)
      );
      outlinePredictedElements(elt2);
      console.log({ commonAncestor });
    }
    /*    document.removeEventListener("click", handleDocumentClickEvent, {
      capture: true,
    });
 */
    document.addEventListener("click", handleDocumentClickEvent, {
      capture: true,
    });
    return () =>
      document.removeEventListener("click", handleDocumentClickEvent, {
        capture: true,
      });
  }, [selectedElements, isEditModeOpen]);

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      if (isElementSelected.current) return;

      const lastElementCurrent = lastHoveredElement.current;
      e.stopPropagation();

      const selectorTemplate = templator.createSelectorTemplate(e.target, 5);
      const selector = templator.createSelectorFromTemplate(selectorTemplate);
      classHelpers.addClassBySelector(selector, BOT_KEYS.PREDICTED_ELEMENT);

      if (lastElementCurrent && !e.target.isSameNode(lastElementCurrent)) {
        classHelpers.removeClassBySelector(
          ".predicted-element",
          BOT_KEYS.PREDICTED_ELEMENT
        );
        lastHoveredElement.current.classList.remove(BOT_KEYS.HOVERED_ELEMENT);
      } else {
        e.target.classList.add(BOT_KEYS.HOVERED_ELEMENT);
      }
      lastHoveredElement.current = e.target;
      console.log("HANDLE MOUSE MOVE");
    };

    const throttledMouseMoveHandler = _.throttle(handleMouseMove, 30);

    document.addEventListener("mousemove", throttledMouseMoveHandler);
    return () => removeEventListener("mousemove", throttledMouseMoveHandler);
  }, []);

  const reset = () => {
    isElementSelected.current = null;
    const commonAncestor = document.querySelector(BOT_KEYS.COMMON_ANCESTOR);
    if (commonAncestor) {
      commonAncestor.classList.remove(BOT_KEYS.COMMON_ANCESTOR);
    }
    if (lastHoveredElement.current) {
      lastHoveredElement.current.classList.remove(BOT_KEYS.HOVERED_ELEMENT);
    }
    lastHoveredElement.current = null;
    if (!selectedElements.length) return;
    selectedElements.forEach((elt) => {
      elt.removeAttribute(BOT_KEYS.BOT_TARGET);
      elt.classList.remove(BOT_KEYS.SELECTED_ELEMENT);
    });
    setSelectedElements([]);
  };

  const run = () => {
    console.log("RUN BOT");
    selectedElements.forEach((elt: HTMLElement) => {
      elt.setAttribute(BOT_KEYS.BOT_TARGET, "true");
      elt.click();
    });
    reset();
  };

  const toggleEditMode = () => setIsEditModeOpen(!isEditModeOpen);

  const handlers = {
    reset,
    run,
    toggleEditMode,
  };

  return { selectedElements, handlers, isEditModeOpen };
}

export default useBot;
