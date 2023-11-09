/** Redraw entire canvas from model. */

import { Game } from "../entities/entities";

export function redrawCanvas(game: Game, canvasObj: HTMLCanvasElement | null) {
  // Don't render if app doesn't exist
  if (canvasObj === null) {
    return;
  }

  // Get the context
  const ctx = canvasObj.getContext("2d");
  if (ctx === null) {
    return;
  } // Don't render if context doesn't exist

  // Clear the canvas area before rendering the coordinates held in state
  ctx.clearRect(0, 0, canvasObj.width, canvasObj.height);

  // Calculate the size of each square
  const labelBorderWidth = 25;
  const squareSize = (canvasObj.width - labelBorderWidth) / game.board.size;
  const lineWidth = 2;

  // Add lettering/numbering
  drawLettering(ctx, game, labelBorderWidth, squareSize);

  // Draw the grid
  drawGrid(ctx, game, labelBorderWidth, squareSize, lineWidth);

  // Color the squares
  colorSquares(ctx, game, labelBorderWidth, squareSize, lineWidth);

  // Draw Ninja-Se
  drawNinjaSe(ctx, game, labelBorderWidth, squareSize);

  // If the board is locked, draw a win message
  if (game.board.locked) {
    drawWinMessage(ctx, labelBorderWidth);
  }
}

function drawLettering(
  ctx: CanvasRenderingContext2D,
  game: Game,
  labelBorderWidth: number,
  squareSize: number
) {
  ctx.font = "20px Segoe UI";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < game.board.size; i++) {
    ctx.fillText(
      String.fromCharCode("A".charCodeAt(0) + i),
      labelBorderWidth + i * squareSize + squareSize / 2,
      labelBorderWidth / 2
    );

    ctx.fillText(
      String(i + 1),
      labelBorderWidth / 2,
      labelBorderWidth + i * squareSize + squareSize / 2
    );
  }
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  game: Game,
  labelBorderWidth: number,
  squareSize: number,
  lineWidth: number
) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = lineWidth;
  for (let i = 0; i <= game.board.size; i++) {
    ctx.beginPath();
    ctx.moveTo(labelBorderWidth + i * squareSize, labelBorderWidth);
    ctx.lineTo(
      labelBorderWidth + i * squareSize,
      labelBorderWidth + game.board.size * squareSize
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(labelBorderWidth, labelBorderWidth + i * squareSize);
    ctx.lineTo(
      labelBorderWidth + game.board.size * squareSize,
      labelBorderWidth + i * squareSize
    );
    ctx.stroke();
  }
}

function colorSquares(
  ctx: CanvasRenderingContext2D,
  game: Game,
  labelBorderWidth: number,
  squareSize: number,
  lineWidth: number
) {
  for (let r = 0; r < game.board.size; r++) {
    for (let c = 0; c < game.board.size; c++) {
      ctx.fillStyle = game.board.grid[r][c];
      ctx.fillRect(
        labelBorderWidth + lineWidth / 2 + c * squareSize,
        labelBorderWidth + lineWidth / 2 + r * squareSize,
        squareSize - lineWidth,
        squareSize - lineWidth
      );
    }
  }
}

function drawNinjaSe(
  ctx: CanvasRenderingContext2D,
  game: Game,
  labelBorderWidth: number,
  squareSize: number
) {
  const image = document.getElementById("ninja-se");
  if (image !== null) {
    ctx.drawImage(
      image as HTMLImageElement,
      labelBorderWidth + game.ninjaColumn * squareSize,
      labelBorderWidth + game.ninjaRow * squareSize,
      game.ninjaSize * squareSize,
      game.ninjaSize * squareSize
    );
  }
}

function drawWinMessage(
  ctx: CanvasRenderingContext2D,
  labelBorderWidth: number
) {
  const winMessageHeight = 100;
  const winMessageWidth = 300;
  const borderWidth = 10;
  ctx.fillStyle = "black";
  ctx.fillRect(
    labelBorderWidth +
      (400 - labelBorderWidth - winMessageWidth) / 2 -
      borderWidth,
    labelBorderWidth +
      (400 - labelBorderWidth - winMessageHeight) / 2 -
      borderWidth,
    winMessageWidth + 2 * borderWidth,
    winMessageHeight + 2 * borderWidth
  );
  ctx.fillStyle = "yellow";
  ctx.fillRect(
    labelBorderWidth + (400 - labelBorderWidth - winMessageWidth) / 2,
    labelBorderWidth + (400 - labelBorderWidth - winMessageHeight) / 2,
    winMessageWidth,
    winMessageHeight
  );

  ctx.font = "70px Segoe UI";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "You win!",
    labelBorderWidth + (400 - labelBorderWidth) / 2,
    labelBorderWidth + (400 - labelBorderWidth) / 2
  );
}
