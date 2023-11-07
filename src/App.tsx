import React from "react";
import "./App.css";

import { redrawCanvas } from "./boundary/boundary.tsx";
import { Direction, Game } from "./model/entities.tsx";
import ninjaSe from "./assets/ninjase.svg";
import fourByFour from "./assets/4x4.jpg";
import { chooseConfig } from "./controllers.tsx";
import { config_4x4 } from "./model/configs.tsx";

function App() {
  // initial instantiation of the Model
  const [game, setGame] = React.useState(new Game()); // only place where Model object is instantiated.
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

        // Increase the score
        game.score += game.ninjaRow - lastColoredRow - 1;
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

        // Increase the score
        game.score += lastColoredRow - game.ninjaRow - 2;
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

        // Increase the score
        game.score += game.ninjaColumn - lastColoredColumn - 1;
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

        // Increase the score
        game.score += lastColoredColumn - game.ninjaColumn - 2;
      }

      game.ninjaColumn++;
    }

    // Increment the number of moves
    game.moves++;

    // Refresh the display
    forceRedraw(redraw + 1);
  }

  function removeGroups() {
    // Make sure board isn't locked
    if (game.board.locked) {
      return;
    }

    // Check for groups
    for (let r = 0; r < game.board.size; r++) {
      for (let c = 0; c < game.board.size; c++) {
        if (
          isASquare(r, c) &&
          isASquare(r + 1, c) &&
          isASquare(r, c + 1) &&
          isASquare(r + 1, c + 1)
        ) {
          // Remove the group
          game.board.grid[r][c] = "white";
          game.board.grid[r + 1][c] = "white";
          game.board.grid[r][c + 1] = "white";
          game.board.grid[r + 1][c + 1] = "white";

          // Increment the score
          game.score += 4;
        }
      }
    }

    // TODO: Check if all squares are white (meaning the user won!)

    // Refresh the display
    forceRedraw(redraw + 1);
  }

  function isASquare(r: number, c: number) {
    // Check the row is valid
    if (r < 0 || r >= game.board.size) {
      return false;
    }

    // Check the column is valid
    if (c < 0 || c >= game.board.size) {
      return false;
    }

    return (
      game.board.grid[r][c] !== "white" && game.board.grid[r][c] !== "ninja"
    );
  }

  return (
    <div className="App" ref={appRef}>
      <link rel="stylesheet" href="./App.css"></link>
      <h1>SquarePush</h1>
      <button
        className="fourByFourButton"
        onClick={() => chooseConfig(game, config_4x4)}
      >
        4x4
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
      <button className="upButton" onClick={() => moveNinjaSe(Direction.Up)}>
        ^
      </button>
      <button
        className="downButton"
        onClick={() => moveNinjaSe(Direction.Down)}
      >
        v
      </button>
      <button
        className="leftButton"
        onClick={() => moveNinjaSe(Direction.Left)}
      >
        &lt;
      </button>
      <button
        className="rightButton"
        onClick={() => moveNinjaSe(Direction.Right)}
      >
        &gt;
      </button>
      <button className="removeGroupsButton" onClick={() => removeGroups()}>
        Remove Groups
      </button>
    </div>
  );
}

function remapIndex(index: number, size: number) {
  while (index < 0) {
    index += size;
  }
  return index % size;
}

export default App;
