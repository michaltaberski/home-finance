import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button } from "@home-finance/components";
import { MyConst, MyEnumm } from "@home-finance/shared";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      {MyConst}
      <br />
      <br />
      {MyEnumm.MY_OPT}
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        Your count is {count}
        <button onClick={() => setCount((prev) => ++prev)} />
        <Button onClick={() => {}}>fasldkj</Button>
      </header>
    </div>
  );
}

export default App;
