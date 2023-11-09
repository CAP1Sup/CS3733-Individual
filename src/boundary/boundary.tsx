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
  ctx.font = "20px Segoe UI";
  ctx.fillStyle = "black";
  const letterXOffset = -6;
  const letterYOffset = 6;
  for (let i = 0; i < game.board.size; i++) {
    ctx.fillText(
      String.fromCharCode("A".charCodeAt(0) + i),
      labelBorderWidth + i * squareSize + squareSize / 2 + letterXOffset,
      labelBorderWidth / 2 + letterYOffset
    );

    ctx.fillText(
      String(i + 1),
      labelBorderWidth / 2 + letterXOffset,
      labelBorderWidth + i * squareSize + squareSize / 2 + letterYOffset
    );
  }

  // Draw the grid
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

  // Color the squares
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

  // Draw Ninja-Se
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
