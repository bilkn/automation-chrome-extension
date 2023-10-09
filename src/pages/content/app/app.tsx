import React from "react";
import useBot from "../hooks/useBot";
import { Button } from "../components";
import CLOSE_ICON from "../../../assets/icons/close-icon.svg";

export default function App() {
  const { handlers, isEditModeOpen, selectedElements } = useBot();
  const [step, setStep] = React.useState(1);

  React.useEffect(() => {
    console.log("content view loaded");
  }, []);

  const STEP1 = () => {
    return (
      <div>
        <div className="flex justify-between">
          <div>
            <h1 className="text-gray-900 text-2xl font-bold leading-[33.60px]">
              Step 1. For loop
            </h1>
            <p className="text-gray-900 font-medium">Select an element</p>
            <button onClick={handlers.toggleEditMode} className="p-4 bg-black">
              Toggle edit mode
            </button>
          </div>
          <div className="flex flex-col">
            <Button variant="secondary">
              <img src={CLOSE_ICON} />
            </Button>
            <Button onClick={handlers.reset}>Reset</Button>
            {selectedElements.length >= 2 && (
              <button onClick={handlers.run} className="p-4 bg-black">
                Run bot
              </button>
            )}
          </div>
        </div>
        <p className="text-red-900">
          Edit mode is {isEditModeOpen ? "On" : "Off"}
        </p>
      </div>
    );
  };

  const renderStep = { "1": <STEP1 /> };

  return (
    <div
      className="text-lime-400 fixed bottom-0 p-10 bg-white min-w-[70%] shadow-lg"
      style={{ zIndex: 1000000, left: "50%", transform: "translateX(-50%)" }}
      onClick={(e) => e.stopPropagation()}
    >
      {renderStep[step]}
    </div>
  );
}
