import React from "react";
import "./App.css";

import { redrawCanvas } from "./boundary/boundary.tsx";
import { Direction, Game } from "./entities/entities.tsx";
import ninjaSe from "./assets/ninjase.svg";
import {
  chooseConfig,
  moveNinjaSe,
  removeGroups,
  resetGame,
  solveGame,
} from "./controllers/controllers.tsx";
import {
  BoardConfig,
  config_4x4,
  config_5x5,
  config_6x6,
} from "./entities/configs.tsx";

function App() {
  // initial instantiation of the Model
  const [game, setGame] = React.useState(new Game()); // only place where Game object is instantiated.
  const [redraw, forceRedraw] = React.useState(0); // change values to force redraw

  const appRef = React.useRef(null); // Later need to be able to refer to App
  const canvasRef = React.useRef<HTMLCanvasElement>(null); // Later need to be able to refer to Canvas

  document.title = "SquarePush";

  /** Ensures initial rendering is performed, and that whenever model changes, it is re-rendered. */
  React.useEffect(() => {
    // Draw the canvas
    redrawCanvas(game, canvasRef.current);

    // Key press handler
    const keyDownHandler = (event: Event) => {
      // Force event to be a keyboard event
      // TODO: Fix this error
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          moveNinjaSeHandler(Direction.Up);
          break;
        case "ArrowDown":
          event.preventDefault();
          moveNinjaSeHandler(Direction.Down);
          break;
        case "ArrowLeft":
          event.preventDefault();
          moveNinjaSeHandler(Direction.Left);
          break;
        case "ArrowRight":
          event.preventDefault();
          moveNinjaSeHandler(Direction.Right);
          break;
        default:
          break;
      }
    };

    // Register the key press handler
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      // Unregister the key press handler
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [game, redraw]); // this second argument is CRITICAL, since it declares when to refresh (whenever Game changes)

  function chooseConfigHandler(config: BoardConfig) {
    chooseConfig(game, config);
    forceRedraw(redraw + 1);
  }

  function moveNinjaSeHandler(direction: Direction) {
    moveNinjaSe(game, direction);
    forceRedraw(redraw + 1);
  }

  function removeGroupsHandler() {
    removeGroups(game);
    forceRedraw(redraw + 1);
  }

  function resetGameHandler() {
    resetGame(game);
    forceRedraw(redraw + 1);
  }

  function solveGameHandler() {
    solveGame(game);
    forceRedraw(redraw + 1);
  }

  onload = () => {
    chooseConfigHandler(config_5x5);
  };

  return (
    <div className="App" ref={appRef}>
      <link rel="stylesheet" href="./App.css"></link>
      <h1>SquarePush</h1>
      <label className="configColumnLabel">Configurations</label>
      <button
        className="fourByFourButton"
        onClick={() => chooseConfigHandler(config_4x4)}
      >
        4x4
      </button>
      <button
        className="fiveByFiveButton"
        onClick={() => chooseConfigHandler(config_5x5)}
      >
        5x5
      </button>
      <button
        className="sixBySixButton"
        onClick={() => chooseConfigHandler(config_6x6)}
      >
        6x6
      </button>
      <img id="ninja-se" src={ninjaSe} alt="hidden" hidden></img>
      <canvas
        tabIndex={1}
        className="App-canvas"
        ref={canvasRef}
        width={400}
        height={400}
      />
      <p className="moveCounter">
        <b>Moves: </b> {game.moves}
      </p>
      <p className="scoreCounter">
        <b>Score: </b> {game.score}
      </p>
      <label className="actionColumnLabel">Actions</label>
      <button
        className="upButton"
        onClick={() => moveNinjaSeHandler(Direction.Up)}
      >
        ^
      </button>
      <button
        className="downButton"
        onClick={() => moveNinjaSeHandler(Direction.Down)}
      >
        v
      </button>
      <button
        className="leftButton"
        onClick={() => moveNinjaSeHandler(Direction.Left)}
      >
        &lt;
      </button>
      <button
        className="rightButton"
        onClick={() => moveNinjaSeHandler(Direction.Right)}
      >
        &gt;
      </button>
      <button
        className="removeGroupsButton"
        onClick={() => removeGroupsHandler()}
      >
        Remove Groups
      </button>
      <button className="resetGameButton" onClick={() => resetGameHandler()}>
        Reset Game
      </button>
      <button className="solveGameButton" onClick={() => solveGameHandler()}>
        Solve Game
      </button>
    </div>
  );
}

export default App;
