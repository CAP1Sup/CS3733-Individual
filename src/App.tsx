import React from "react";
import "./App.css";

import { redrawCanvas } from "./boundary/boundary.tsx";
import { Direction, Game } from "./model/entities.js";
import ninjaSe from "./assets/ninjase.svg";

function App() {
  // initial instantiation of the Model
  const [game, setGame] = React.useState(new Game()); // only place where Model object is instantiated.
  const [redraw, forceRedraw] = React.useState(0); // change values to force redraw

  const appRef = React.useRef(null); // Later need to be able to refer to App
  const canvasRef = React.useRef<HTMLCanvasElement>(null); // Later need to be able to refer to Canvas

  /** Ensures initial rendering is performed, and that whenever model changes, it is re-rendered. */
  React.useEffect(() => {
    /** Happens once. */
    redrawCanvas(game, canvasRef.current /*, appRef.current*/);
  }, [game, redraw]); // this second argument is CRITICAL, since it declares when to refresh (whenever Game changes)

  // Key press handler
  // TODO: Fix this
  const keyDownHandler = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp") {
      moveNinjaSe(Direction.Up);
    } else if (event.key === "ArrowDown") {
      moveNinjaSe(Direction.Down);
    } else if (event.key === "ArrowLeft") {
      moveNinjaSe(Direction.Left);
    } else if (event.key === "ArrowRight") {
      moveNinjaSe(Direction.Right);
    }
    console.log(event.key);
  };

  // Controller for moving Ninja-Se
  function moveNinjaSe(direction: Direction) {
    // TODO: Fix occasional bug where Ninja-Se becomes claustrophobic and doesn't want to move when surrounded by squares

    // Make sure board isn't locked
    if (game.board.locked) {
      return;
    }

    // Decide where to move Ninja-Se
    if (direction === Direction.Up) {
      if (game.ninjaRow <= 0) {
        return; // Exit if already at the top
      }

      // Loop until the next square is white
      for (let c = 0; c < game.ninjaSize; c++) {
        let lastColoredRow = game.ninjaRow - 1;
        while (
          game.board.grid[remapIndex(lastColoredRow, game.board.size)][
            game.ninjaColumn + c
          ] !== "white"
        ) {
          lastColoredRow--;
        }

        // Shift the squares
        for (let i = lastColoredRow; i < game.ninjaRow; i++) {
          game.board.grid[remapIndex(i, game.board.size)][
            game.ninjaColumn + c
          ] =
            game.board.grid[remapIndex(i + 1, game.board.size)][
              game.ninjaColumn + c
            ];
        }
      }

      // Move the ninja
      game.ninjaRow--;
    } else if (direction === Direction.Down) {
      if (game.ninjaRow >= game.board.size - game.ninjaSize) {
        return; // Exit if already at the bottom
      }

      // Loop until the next square is white
      for (let c = 0; c < game.ninjaSize; c++) {
        let lastColoredRow = game.ninjaRow + game.ninjaSize;
        while (
          game.board.grid[remapIndex(lastColoredRow, game.board.size)][
            game.ninjaColumn + c
          ] !== "white"
        ) {
          lastColoredRow++;
        }

        // Shift the squares
        for (let i = lastColoredRow; i > game.ninjaRow; i--) {
          game.board.grid[remapIndex(i, game.board.size)][
            game.ninjaColumn + c
          ] =
            game.board.grid[remapIndex(i - 1, game.board.size)][
              game.ninjaColumn + c
            ];
        }
      }

      game.ninjaRow++;
    } else if (direction === Direction.Left) {
      if (game.ninjaColumn <= 0) {
        return; // Exit if already at the left edge
      }

      // Loop until the next square is white
      for (let r = 0; r < game.ninjaSize; r++) {
        let lastColoredColumn = game.ninjaColumn - 1;
        while (
          game.board.grid[game.ninjaRow + r][
            remapIndex(lastColoredColumn, game.board.size)
          ] !== "white"
        ) {
          lastColoredColumn--;
        }

        // Shift the squares
        for (let i = lastColoredColumn; i < game.ninjaColumn; i++) {
          game.board.grid[game.ninjaRow + r][remapIndex(i, game.board.size)] =
            game.board.grid[game.ninjaRow + r][
              remapIndex(i + 1, game.board.size)
            ];
        }
      }

      game.ninjaColumn--;
    } else if (direction === Direction.Right) {
      if (game.ninjaColumn >= game.board.size - game.ninjaSize) {
        return; // Exit if already at the right edge
      }

      // Loop until the next square is white
      for (let r = 0; r < game.ninjaSize; r++) {
        let lastColoredColumn = game.ninjaColumn + game.ninjaSize;
        while (
          game.board.grid[game.ninjaRow + r][
            remapIndex(lastColoredColumn, game.board.size)
          ] !== "white"
        ) {
          lastColoredColumn++;
        }

        // Shift the squares
        for (let i = lastColoredColumn; i > game.ninjaColumn; i--) {
          game.board.grid[game.ninjaRow + r][remapIndex(i, game.board.size)] =
            game.board.grid[game.ninjaRow + r][
              remapIndex(i - 1, game.board.size)
            ];
        }
      }

      game.ninjaColumn++;
    }

    // Increment the number of moves
    game.moves++;

    // Refresh the display
    forceRedraw(redraw + 1);
  }
  return (
    <div className="App" ref={appRef}>
      <h1>SquarePush</h1>
      <img id="ninja-se" src={ninjaSe} alt="hidden" hidden></img>
      <canvas
        tabIndex={1}
        data-testid="canvas"
        className="App-canvas"
        ref={canvasRef}
        width={400}
        height={400}
      />
      <button
        className="upButton"
        data-testid="upButton"
        onClick={() => moveNinjaSe(Direction.Up)}
      >
        ^
      </button>
      <button
        className="downButton"
        data-testid="downButton"
        onClick={() => moveNinjaSe(Direction.Down)}
      >
        v
      </button>
      <button
        className="leftButton"
        data-testid="leftButton"
        onClick={() => moveNinjaSe(Direction.Left)}
      >
        &lt;
      </button>
      <button
        className="rightButton"
        data-testid="rightButton"
        onClick={() => moveNinjaSe(Direction.Right)}
      >
        &gt;
      </button>
    </div>
  );
}

// Helper functions
function rowToNum(str: string) {
  return parseInt(str, 10) - 1;
}

function columnToNum(str: string) {
  return str.charCodeAt(0) - "A".charCodeAt(0);
}

function remapIndex(index: number, size: number) {
  while (index < 0) {
    index += size;
  }
  return index % size;
}

export default App;
