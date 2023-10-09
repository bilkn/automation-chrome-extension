import { useEffect } from "react";
import useBot from "../../hooks/useBot";
import "./app.scss";
export default function App() {
  useBot();
  useEffect(() => {
    console.log("content view loaded");
  }, []);

  return (
    <div className="text-lime-400 fixed bottom-0 left-0">
      <p className="my-title">content view #2</p>
    </div>
  );
}
