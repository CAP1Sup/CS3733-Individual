import React, { KeyboardEvent } from "react";
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
    /** Happens once. */
    redrawCanvas(game, canvasRef.current);
  }, [game, redraw]); // this second argument is CRITICAL, since it declares when to refresh (whenever Game changes)

  // Key press handler
  // TODO: Fix this
  const keyDownHandler = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp") {
      moveNinjaSeHandler(Direction.Up);
    } else if (event.key === "ArrowDown") {
      moveNinjaSeHandler(Direction.Down);
    } else if (event.key === "ArrowLeft") {
      moveNinjaSeHandler(Direction.Left);
    } else if (event.key === "ArrowRight") {
      moveNinjaSeHandler(Direction.Right);
    }
  };

  function chooseConfigHandler(config: BoardConfig) {
    chooseConfig(game, config);
    forceRedraw(redraw + 1);
  }

  function moveNinjaSeHandler(direction: Direction) {
    moveNinjaSe(game, direction);
    forceRedraw(redraw + 1);
  }

  function removeGroupsHandler() {
    if (removeGroups(game)) {
      // TODO: Display win message
    }
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
    //addEventListener("keydown", keyDownHandler);
  };

  return (
    <div className="App" ref={appRef}>
      <link rel="stylesheet" href="./App.css"></link>
      <h1>SquarePush</h1>
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
