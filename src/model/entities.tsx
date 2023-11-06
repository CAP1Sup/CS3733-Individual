import { chooseConfig } from "../controllers";
import { config_5x5 } from "./configs";

export class Game {
  board: Board;
  moves: number;
  score: number;
  ninjaRow: number;
  ninjaColumn: number;
  ninjaSize: number = 2;

  constructor() {
    this.board = new Board(5);
    this.ninjaRow = 0;
    this.ninjaColumn = 0;
    this.moves = 0;
    this.score = 0;

    // Configure the board to a 5x5 by default
    // Must come last
    chooseConfig(this, config_5x5);
  }
}

export class Board {
  size: number;
  grid: string[][];
  locked: boolean = false;

  constructor(size: number) {
    this.size = size;
    this.grid = [];
  }
}

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}
