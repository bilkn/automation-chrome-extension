import React from "react";
import useBot from "../../hooks/useBot";
export default function App() {
  useBot();
  const [step, setStep] = React.useState(1);

  React.useEffect(() => {
    console.log("content view loaded");
  }, []);

  const STEP1 = () => {
    return (
      <div>
        <div className="flex justify-between">
          <h1 className="text-gray-900 text-2xl font-bold leading-[33.60px]">
            Step 1. For loop
          </h1>
          <button>Close</button>
        </div>
        <p className="text-gray-900 font-medium">Select an element</p>
      </div>
    );
  };

  const renderStep = { "1": <STEP1 /> };

  return (
    <div
      className="text-lime-400 fixed bottom-0 p-10 bg-white min-w-[70%] shadow-lg"
      style={{ zIndex: 1000000, left: "50%", transform: "translateX(-50%)" }}
    >
      {renderStep[step]}
    </div>
  );
}
