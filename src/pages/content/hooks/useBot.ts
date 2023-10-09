import _ from "lodash";
import React from "react";
import templator from "../helpers/templator";
import classHelpers from "../helpers/classHelpers";
import { findCommonAncestor } from "../helpers";
import { BOT_KEYS } from "../constants";

const defaultStep = 1;

function useBot() {
  const lastHoveredElement = React.useRef(null);
  const isElementSelected = React.useRef(null);
  const [userSelectedElements, setUserSelectedElements] = React.useState([]);
  const [allSelectedElements, setAllSelectedElements] = React.useState([]);
  const [isEditModeOpen, setIsEditModeOpen] = React.useState(true);
  const [step, setStep] = React.useState(defaultStep);

  const resetStep = () => setStep(defaultStep);

  // TODO: Handle when the route changes

  const getAllPredictedElements = React.useCallback(
    () => Array.from(document.querySelectorAll(".predicted-element")),
    [userSelectedElements]
  );

  const predictedElementCount = React.useMemo(
    () => getAllPredictedElements().length - userSelectedElements.length,
    [userSelectedElements, getAllPredictedElements]
  );

  const handleDocumentClickEvent = React.useCallback(
    (e) => {
      const rootContainer = document.getElementById("browser-buddy-root");

      if (!isEditModeOpen) {
        return;
      } else if (
        rootContainer.contains(e.target) ||
        e.target.getAttribute(BOT_KEYS.BOT_TARGET)
      )
        return;
      isElementSelected.current = true;
      e.stopPropagation();
      e.preventDefault();
      const isElementAlreadySelected = e.target.classList.contains(
        BOT_KEYS.SELECTED_ELEMENT
      );

      if (
        !e.target.classList.contains(BOT_KEYS.PREDICTED_ELEMENT) ||
        isElementAlreadySelected
      )
        return;
      e.target.classList.add(BOT_KEYS.SELECTED_ELEMENT);
      setUserSelectedElements((prevElements) => [...prevElements, e.target]);
      setAllSelectedElements((prevElements) => [...prevElements, e.target]);
    },
    [isEditModeOpen]
  );

  React.useEffect(() => {
    const isBothElementsSelected = userSelectedElements.length >= 2;
    let commonAncestor;
    const outlinePredictedElements = (clickedElt) => {
      const selectorTemplate = templator.createSelectorTemplateUntilParentNode(
        clickedElt,
        commonAncestor,
        { excludedClasses: [BOT_KEYS.SELECTED_ELEMENT] }
      );
      const selector = templator.createSelectorFromTemplate(selectorTemplate);
      classHelpers.addClassBySelector(selector, BOT_KEYS.PREDICTED_ELEMENT);
    };

    // Finds common ancestor and removes other predicted elements other than ancestor's children
    if (isBothElementsSelected) {
      const [elt1, elt2] = userSelectedElements;
      commonAncestor = findCommonAncestor(elt1, elt2);
      commonAncestor.classList.add(BOT_KEYS.COMMON_ANCESTOR);
      const predictedElements = document.querySelectorAll(
        "." + BOT_KEYS.PREDICTED_ELEMENT
      );
      if (!predictedElements.length) return;
      predictedElements.forEach((elt) =>
        elt.classList.remove(BOT_KEYS.PREDICTED_ELEMENT)
      );

      outlinePredictedElements(elt2);
    }

    document.addEventListener("click", handleDocumentClickEvent, {
      capture: true,
    });
    return () =>
      document.removeEventListener("click", handleDocumentClickEvent, {
        capture: true,
      });
  }, [userSelectedElements, isEditModeOpen]);

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
          "." + BOT_KEYS.PREDICTED_ELEMENT,
          BOT_KEYS.PREDICTED_ELEMENT
        );
        lastHoveredElement.current.classList.remove(BOT_KEYS.HOVERED_ELEMENT);
      } else {
        e.target.classList.add(BOT_KEYS.HOVERED_ELEMENT);
      }
      lastHoveredElement.current = e.target;
    };

    const throttledMouseMoveHandler = _.throttle(handleMouseMove, 30);

    document.addEventListener("mousemove", throttledMouseMoveHandler);
    return () => removeEventListener("mousemove", throttledMouseMoveHandler);
  }, []);

  const onReset = () => {
    isElementSelected.current = null;
    const commonAncestor = document.querySelector(BOT_KEYS.COMMON_ANCESTOR);
    if (commonAncestor) {
      commonAncestor.classList.remove(BOT_KEYS.COMMON_ANCESTOR);
    }
    if (lastHoveredElement.current) {
      lastHoveredElement.current.classList.remove(BOT_KEYS.HOVERED_ELEMENT);
    }
    lastHoveredElement.current = null;
    if (!userSelectedElements.length) return;
    userSelectedElements.forEach((elt) => {
      elt.removeAttribute(BOT_KEYS.BOT_TARGET);
      elt.classList.remove(BOT_KEYS.SELECTED_ELEMENT);
    });
    setUserSelectedElements([]);
    resetStep();
  };

  const run = () => {
    userSelectedElements.forEach((elt: HTMLElement) => {
      elt.setAttribute(BOT_KEYS.BOT_TARGET, "true");
      elt.click();
    });
    onReset();
  };

  const onSave = () => {
    const predictedElements = getAllPredictedElements();
    setAllSelectedElements(predictedElements);
    setStep(2);
  };

  const toggleEditMode = () => setIsEditModeOpen(!isEditModeOpen);

  const handlers = {
    onReset,
    run,
    toggleEditMode,
    onSave,
  };

  return {
    allSelectedElements,
    userSelectedElements,
    handlers,
    isEditModeOpen,
    predictedElementCount,
    step,
  };
}

export default useBot;
