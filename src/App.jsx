import { useState } from "react";
import "./App.css";
import Hangman from "./Hangman";
import SecretChooser from "./SecretChooser";

function App() {
  const [secret, setSecret] = useState("");

  return (
    <>
      {secret != "" ? (
        <Hangman secret={secret} />
      ) : (
        <SecretChooser setSecret={setSecret} />
      )}
    </>
  );
}

export default App;
