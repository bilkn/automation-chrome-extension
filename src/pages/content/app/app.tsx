import React from "react";
import useBot from "../hooks/useBot";
import { Button, IconButton } from "../components";
import SVG_ICON from "../assets/icons/close-icon.svg";

export default function App() {
  const {
    handlers,
    isEditModeOpen,
    userSelectedElements,
    allSelectedElements,
    predictedElementCount,
  } = useBot();
  const [step, setStep] = React.useState(1);

  React.useEffect(() => {
    console.log("content view loaded");
  }, []);

  const atLeastTwoElementsIsSelected = userSelectedElements.length >= 2;

  const STEP1 = () => {
    return (
      <div>
        <div className="flex justify-between">
          <div>
            <h1 className="text-gray-900 text-2xl font-bold leading-[33.60px]">
              Step 1. For loop
            </h1>
            {atLeastTwoElementsIsSelected ? (
              <p className="text-gray-900 font-medium mt-6">
                Great! You selected {userSelectedElements.length} elements, we
                predicted {predictedElementCount - userSelectedElements.length}{" "}
                additional element. In total {allSelectedElements.length}{" "}
                elements are selected
              </p>
            ) : (
              <p className="text-gray-900 font-medium mt-6">
                Select two element
              </p>
            )}

            {/*     <button onClick={handlers.toggleEditMode} className="p-4 bg-black">
              Toggle edit mode
            </button> */}
          </div>
          <div className="flex flex-col justify-between items-end">
            <IconButton>
              <span className="text-[1.2rem]">X</span>
            </IconButton>
            <div className="flex gap-4 mt-10">
              <Button onClick={handlers.reset} variant="secondary">
                Reset
              </Button>
              {/*    {atLeastTwoElementsIsSelected && (
                <button onClick={handlers.run} className="p-4 bg-black">
                  Run bot
                </button>
              )} */}
              <Button onClick={handlers.save}>Save</Button>
            </div>
          </div>
        </div>
        {/*   <p className="text-red-900">
          Edit mode is {isEditModeOpen ? "On" : "Off"}
        </p> */}
      </div>
    );
  };

  const renderStep = { "1": <STEP1 /> };

  return (
    <div
      className="text-lime-400 fixed bottom-0 p-6 bg-white min-w-[70%] shadow-lg"
      style={{ zIndex: 1000000, left: "50%", transform: "translateX(-50%)" }}
      onClick={(e) => e.stopPropagation()}
    >
      {renderStep[step]}
    </div>
  );
}
