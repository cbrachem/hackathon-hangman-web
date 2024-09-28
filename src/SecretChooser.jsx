import { useState } from "react";

function SecretChooser({ setSecret }) {
  const [s, setS] = useState("");
  return (
    <div className="secret-chooser">
      <input
        type="text"
        placeholder="Enter a secret"
        value={s}
        onChange={(ev) => setS(ev.target.value)}
      />
      <button onClick={() => setSecret(s)}>Let's go!</button>
    </div>
  );
}

export default SecretChooser;
