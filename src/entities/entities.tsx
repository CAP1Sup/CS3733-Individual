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
}

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}
