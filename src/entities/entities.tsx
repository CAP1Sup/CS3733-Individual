import { BoardConfig, config_5x5 } from "./configs";

export class Game {
  board: Board;
  moves: number;
  score: number;
  ninjaRow: number;
  ninjaColumn: number;
  ninjaSize: number = 2;
  currentConfig: BoardConfig = config_5x5;

  constructor() {
    this.board = new Board(5);
    this.ninjaRow = 0;
    this.ninjaColumn = 0;
    this.moves = 0;
    this.score = 0;
  }
}

export class Board {
  size: number;
  grid: string[][];
  locked: boolean = false;

  constructor(size: number) {
    this.size = size;
    this.grid = [];

    // Fill the board with white squares
    for (let i = 0; i < this.size; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.grid[i][j] = "white";
      }
    }
  }

  /**
   * Checks if the board is completely white (i.e. no colored squares)
   *
   * @returns true if the board is completely white, false otherwise
   */
  public isComplete() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] !== "white") {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Returns if the square at the given row and column is colored or not
   * @param r Row of the square
   * @param c Column of the square
   * @returns If the square is colored or not
   */
  public isASquare(r: number, c: number) {
    // Check the row is valid
    if (r < 0 || r >= this.size) {
      return false;
    }

    // Check the column is valid
    if (c < 0 || c >= this.size) {
      return false;
    }

    // Check the actual square
    return this.grid[r][c] !== "white";
  }
}

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}
