import React from "react";
import useBot from "../hooks/useBot";
import { Button, IconButton } from "../components";
import { CursorIcon } from "../components/Icons";

export default function App() {
  const { handlers, userSelectedElements, step } = useBot();

  const [showBotUI, setShowBotUI] = React.useState(true);

  const closeBotUI = () => setShowBotUI(false);

  if (!showBotUI) return null;
  const atLeastTwoElementsIsSelected = userSelectedElements.length >= 2;

  React.useEffect(() => {
    window.addEventListener("locationchange", handlers.onReset);
    return () => window.removeEventListener("locationchange", handlers.onReset);
  }, []);

  const STEP1 = () => {
    return (
      <div>
        <div className="flex justify-between">
          <div>
            <h1 className="text-gray-900 text-2xl font-bold leading-[33.60px]">
              Step 1. For loop
            </h1>
            <div className="mt-10">
              {atLeastTwoElementsIsSelected ? (
                <p className="text-gray-900 font-medium">
                  Great! You selected {userSelectedElements.length} elements,
                </p>
              ) : (
                <p className="text-gray-900 font-medium">Select two element</p>
              )}
            </div>
            {/*     <button onClick={handlers.toggleEditMode} className="p-4 bg-black">
              Toggle edit mode
            </button> */}
          </div>
          <div className="flex flex-col justify-between items-end">
            <div className="flex gap-4 mt-auto">
              <Button onClick={handlers.onReset} variant="secondary">
                Reset
              </Button>
              <Button
                onClick={handlers.onSave}
                disabled={!atLeastTwoElementsIsSelected}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
        {/*   <p className="text-red-900">
          Edit mode is {isEditModeOpen ? "On" : "Off"}
        </p> */}
      </div>
    );
  };

  const STEP2 = () => {
    return (
      <div>
        <div>
          <h1 className="text-gray-900 text-2xl font-bold leading-[33.60px]">
            Step 2. Choose an action on each element
          </h1>
          <button
            onClick={handlers.onClickAllElements}
            className="flex items-center justify-center p-8 bg-gray-200 rounded-md mt-4"
          >
            <CursorIcon />
            <p className="text-[#0e1726] text-center text-lg font-semibold">
              Click all the selected elements
            </p>
          </button>
        </div>
      </div>
    );
  };

  const renderStep = { "1": <STEP1 />, "2": <STEP2 /> };

  return (
    <div
      className="text-lime-400 fixed bottom-0 p-6 bg-white min-w-[70%] shadow-lg"
      style={{ zIndex: 1000000, left: "50%", transform: "translateX(-50%)" }}
      onClick={(e) => e.stopPropagation()}
    >
      <IconButton
        className="absolute top-[8px] right-[8px]"
        onClick={closeBotUI}
      >
        <span className="text-[1.2rem]">X</span>
      </IconButton>
      {renderStep[step]}
    </div>
  );
}
