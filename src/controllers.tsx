import { Game, Board } from "./model/entities";
import { BoardConfig } from "./model/configs";

export function chooseConfig(game: Game, config: BoardConfig) {
  // Create a new board with the given dimensions
  game.board = new Board(parseInt(config.size, 10));

  // Fill the board with white squares
  for (let i = 0; i < game.board.size; i++) {
    game.board.grid[i] = [];
    for (let j = 0; j < game.board.size; j++) {
      game.board.grid[i][j] = "white";
    }
  }

  // Place the ninja
  // TODO: Cleanup?
  /*for (let i = 0; i < game.ninjaSize; i++) {
    for (let j = 0; j < game.ninjaSize; j++) {
      game.board.grid[rowToNum(config.ninjaRow) + i][
        columnToNum(config.ninjaColumn) + j
      ] = "ninja";
    }
  }*/

  // Save the ninja's position
  game.ninjaRow = rowToNum(config.ninjaRow);
  game.ninjaColumn = columnToNum(config.ninjaColumn);

  // Place the initial squares
  for (let i = 0; i < config.initial.length; i++) {
    game.board.grid[rowToNum(config.initial[i].row)][
      columnToNum(config.initial[i].column)
    ] = config.initial[i].color;
  }

  // Unlock the board
  game.board.locked = false;

  // Reset the move and score counters
  game.moves = 0;
  game.score = 0;

  // Redraw the board
  // TODO: Implement this
}

function rowToNum(str: string) {
  return parseInt(str, 10) - 1;
}

function columnToNum(str: string) {
  return str.charCodeAt(0) - "A".charCodeAt(0);
}
