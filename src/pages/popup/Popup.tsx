import React from "react";
import logo from "@assets/img/logo.svg";
import "@pages/popup/Popup.css";
import withSuspense from "@src/shared/hoc/withSuspense";

const Popup = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2 className="mt-3">WELCOME TO THE BROWSER BUDDY CHALLENGE!</h2>
      </header>
    </div>
  );
};

export default withSuspense(Popup);
