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
    // Loop until the next square is white
    for (let c = 0; c < game.ninjaSize; c++) {
      let lastColoredRow = game.ninjaRow - 1;
      while (
        game.board.grid[wrapIndex(lastColoredRow, game.board.size)][
          game.ninjaColumn + c
        ] !== "white"
      ) {
        lastColoredRow--;
      }

      // Shift the squares
      for (let i = lastColoredRow; i < game.ninjaRow; i++) {
        game.board.grid[wrapIndex(i, game.board.size)][game.ninjaColumn + c] =
          game.board.grid[wrapIndex(i + 1, game.board.size)][
            game.ninjaColumn + c
          ];
      }

      // Increase the score
      game.score += game.ninjaRow - lastColoredRow - 1;
    }
  } else if (direction === Direction.Down) {
    // Loop until the next square is white
    for (let c = 0; c < game.ninjaSize; c++) {
      let lastColoredRow = game.ninjaRow + game.ninjaSize;
      while (
        game.board.grid[wrapIndex(lastColoredRow, game.board.size)][
          game.ninjaColumn + c
        ] !== "white"
      ) {
        lastColoredRow++;
      }

      // Shift the squares
      for (
        let i = lastColoredRow;
        i > game.ninjaRow + game.ninjaSize - 1;
        i--
      ) {
        game.board.grid[wrapIndex(i, game.board.size)][game.ninjaColumn + c] =
          game.board.grid[wrapIndex(i - 1, game.board.size)][
            game.ninjaColumn + c
          ];
      }

      // Increase the score
      game.score += lastColoredRow - game.ninjaRow - 2;
    }
  } else if (direction === Direction.Left) {
    // Loop until the next square is white
    for (let r = 0; r < game.ninjaSize; r++) {
      let lastColoredColumn = game.ninjaColumn - 1;
      while (
        game.board.grid[game.ninjaRow + r][
          wrapIndex(lastColoredColumn, game.board.size)
        ] !== "white"
      ) {
        lastColoredColumn--;
      }

      // Shift the squares
      for (let i = lastColoredColumn; i < game.ninjaColumn; i++) {
        game.board.grid[game.ninjaRow + r][wrapIndex(i, game.board.size)] =
          game.board.grid[game.ninjaRow + r][wrapIndex(i + 1, game.board.size)];
      }

      // Increase the score
      game.score += game.ninjaColumn - lastColoredColumn - 1;
    }
  } else if (direction === Direction.Right) {
    // Loop until the next square is white
    for (let r = 0; r < game.ninjaSize; r++) {
      let lastColoredColumn = game.ninjaColumn + game.ninjaSize;
      while (
        game.board.grid[game.ninjaRow + r][
          wrapIndex(lastColoredColumn, game.board.size)
        ] !== "white"
      ) {
        lastColoredColumn++;
      }

      // Shift the squares
      for (
        let i = lastColoredColumn;
        i > game.ninjaColumn + game.ninjaSize - 1;
        i--
      ) {
        game.board.grid[game.ninjaRow + r][wrapIndex(i, game.board.size)] =
          game.board.grid[game.ninjaRow + r][wrapIndex(i - 1, game.board.size)];
      }

      // Increase the score
      game.score += lastColoredColumn - game.ninjaColumn - 2;
    }
  }
}

function wrapIndex(index: number, size: number) {
  while (index < 0) {
    index += size;
  }
  return index % size;
}

export function removeGroups(game: Game) {
  // Make sure board isn't locked
  if (game.board.locked) {
    return false;
  }

  // Keep track of if any groups were removed
  let groupsRemoved = false;

  // Check for groups
  for (let r = 0; r < game.board.size - 1; r++) {
    for (let c = 0; c < game.board.size - 1; c++) {
      // If the top left square is not white
      // and the other three squares are the same color,
      // then we have a group
      if (
        game.board.isASquare(r, c) &&
        game.board.grid[r][c] === game.board.grid[r + 1][c] &&
        game.board.grid[r][c] === game.board.grid[r][c + 1] &&
        game.board.grid[r][c] === game.board.grid[r + 1][c + 1]
      ) {
        // Remove the group
        game.board.grid[r][c] = "white";
        game.board.grid[r + 1][c] = "white";
        game.board.grid[r][c + 1] = "white";
        game.board.grid[r + 1][c + 1] = "white";

        // Increment the score
        game.score += 4;

        // Note that a group was removed
        groupsRemoved = true;
      }
    }
  }

  // Increase the move counter (if a group was removed)
  if (groupsRemoved) {
    game.moves++;
  }

  // Lock the board if the board is complete
  if (game.board.isComplete()) {
    game.board.locked = true;
    return true;
  }
  return false;
}

export function resetGame(game: Game) {
  chooseConfig(game, game.currentConfig);
}

export function solveGame(game: Game) {
  // TODO: Implement
}
