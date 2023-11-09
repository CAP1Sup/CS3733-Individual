import { Game, Board, Direction } from "../entities/entities";
import { BoardConfig } from "../entities/configs";

export function chooseConfig(game: Game, config: BoardConfig) {
  // Create a new board with the given dimensions
  // Automatically fills the board with white squares
  // Also sets the board's locked property to false
  game.board = new Board(parseInt(config.size, 10));

  // Save the ninja's position
  game.ninjaRow = rowToNum(config.ninjaRow);
  game.ninjaColumn = columnToNum(config.ninjaColumn);

  // Place the initial squares
  for (let i = 0; i < config.initial.length; i++) {
    game.board.grid[rowToNum(config.initial[i].row)][
      columnToNum(config.initial[i].column)
    ] = config.initial[i].color;
  }

  // Reset the move and score counters
  game.moves = 0;
  game.score = 0;

  // Save the current config
  game.currentConfig = config;
}

function rowToNum(str: string) {
  return parseInt(str, 10) - 1;
}

function columnToNum(str: string) {
  return str.charCodeAt(0) - "A".charCodeAt(0);
}

// Controller for moving Ninja-Se
export function moveNinjaSe(game: Game, direction: Direction) {
  // Make sure board isn't locked
  if (game.board.locked) {
    return;
  }

  // Make sure that Ninja-Se is not attempting to move off of the board
  if (movingOffBoard(game, direction)) {
    return;
  }

  // Shift the squares
  pushSquares(game, direction);

  // Move Ninja-Se
  switch (direction) {
    case Direction.Up:
      game.ninjaRow--;
      break;
    case Direction.Down:
      game.ninjaRow++;
      break;
    case Direction.Left:
      game.ninjaColumn--;
      break;
    case Direction.Right:
      game.ninjaColumn++;
      break;
  }

  // Increment the number of moves
  game.moves++;
}

function movingOffBoard(game: Game, direction: Direction) {
  switch (direction) {
    case Direction.Up:
      return game.ninjaRow <= 0;
    case Direction.Down:
      return game.ninjaRow > game.board.size - game.ninjaSize - 1;
    case Direction.Left:
      return game.ninjaColumn <= 0;
    case Direction.Right:
      return game.ninjaColumn > game.board.size - game.ninjaSize - 1;
  }
}

function pushSquares(game: Game, direction: Direction) {
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
        game.board.grid[remapIndex(i, game.board.size)][game.ninjaColumn + c] =
          game.board.grid[remapIndex(i + 1, game.board.size)][
            game.ninjaColumn + c
          ];
      }

      // Increase the score
      game.score += game.ninjaRow - lastColoredRow - 1;
    }
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
        game.board.grid[remapIndex(i, game.board.size)][game.ninjaColumn + c] =
          game.board.grid[remapIndex(i - 1, game.board.size)][
            game.ninjaColumn + c
          ];
      }

      // Make the previously last colored row white
      // TODO: Somewhat inefficient... maybe rewrite later?
      game.board.grid[remapIndex(lastColoredRow + 1, game.board.size)][
        game.ninjaColumn + c
      ] = "white";

      // Increase the score
      game.score += lastColoredRow - game.ninjaRow - 2;
    }
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

      // Make the previously last colored column white
      // TODO: Somewhat inefficient... maybe rewrite later?
      game.board.grid[game.ninjaRow + r][
        remapIndex(lastColoredColumn + 1, game.board.size)
      ] = "white";

      // Increase the score
      game.score += lastColoredColumn - game.ninjaColumn - 2;
    }
  }
}

function remapIndex(index: number, size: number) {
  while (index < 0) {
    index += size;
  }
  return index % size;
}

export function removeGroups(game: Game) {
  // Make sure board isn't locked
  if (game.board.locked) {
    return;
  }

  // Check for groups
  for (let r = 0; r < game.board.size; r++) {
    for (let c = 0; c < game.board.size; c++) {
      if (
        isASquare(game, r, c) &&
        isASquare(game, r + 1, c) &&
        isASquare(game, r, c + 1) &&
        isASquare(game, r + 1, c + 1)
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
  return false;
}

function isASquare(game: Game, r: number, c: number) {
  // Check the row is valid
  if (r < 0 || r >= game.board.size) {
    return false;
  }

  // Check the column is valid
  if (c < 0 || c >= game.board.size) {
    return false;
  }

  return game.board.grid[r][c] !== "white" && game.board.grid[r][c] !== "ninja";
}

export function resetGame(game: Game) {
  chooseConfig(game, game.currentConfig);
}

export function solveGame(game: Game) {
  // TODO: Implement
}
