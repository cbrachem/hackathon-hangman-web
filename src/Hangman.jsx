import { useState, useEffect, useRef } from "react";
import { socket } from "./socket";
import { useTime } from "./time";

function Hangman({ secret }) {
  // word is the current guessed word with underscores as placesholders for unknown letters.
  // the actual word may include more letters before and after the guessed part.
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const callbackRef = useRef();
  const now = useTime();
  const [roundStart, setRoundStart] = useState(now);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    socket.connect();

    function onConnect() {
      socket.emit("authenticate", secret);
      setWord("");
      setGuessedLetters([]);
    }

    function onData(data, cb) {
      if (data.type == "ROUND" || data.type == "RESULT") {
        setWord(data.word);
        setGuessedLetters(data.guessed);
        if (data.type == "ROUND") {
          callbackRef.current = cb;
          setDisabled(false);
          setRoundStart(Date.now());
          setFinished(false);
        } else {
          setFinished(true);
        }
      }
    }

    socket.on("connect", onConnect);
    socket.on("data", onData);
    return () => {
      socket.off("connect", onConnect);
      socket.off("data", onData);
    };
  }, [secret]);

  const handleGuess = (letter) => {
    if (disabled) return;
    if (guessedLetters.includes(letter)) return;

    setDisabled(true);
    setGuessedLetters([...guessedLetters, letter]);
    callbackRef.current(letter);
  };

  const timeLeft = 5000 - (now - roundStart);

  if (timeLeft < 500 && !disabled) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const letters = alphabet.split("");
    const randomLetter = letters.filter(
      (letter) => !guessedLetters.includes(letter),
    )[Math.floor(Math.random() * letters.length)];
    handleGuess(randomLetter);
  }

  return (
    <div
      className={
        "hangman " +
        (disabled ? "disabled " : " ") +
        (finished ? "finished" : "")
      }
    >
      <div className="time-left">{timeLeft / 1000}</div>
      <Word word={word} />
      <Alphabet onClick={handleGuess} guessedLetters={guessedLetters} />
    </div>
  );
}

function Word({ word }) {
  return <div className="word">{word || "_"}</div>;
}

function Alphabet({ onClick, guessedLetters }) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const letters = alphabet.split("");
  return (
    <div className="alphabet">
      {letters.map((letter) => (
        <button
          key={letter}
          onClick={() => onClick(letter)}
          disabled={guessedLetters.includes(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}

function WrongGuesses({ wrongGuesses }) {
  return <div className="wrong-guesses">Wrong guesses: {wrongGuesses}</div>;
}

export default Hangman;
