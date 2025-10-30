'use client';

import { useRef, useState, useEffect } from 'react';

enum Piece {
  WP = 0,
  BP = 1,
  WN = 2,
  BN = 3,
  WB = 4,
  BB = 5,
  WR = 6,
  BR = 7,
  WQ = 8,
  BQ = 9,
  WK = 10,
  BK = 11,
  NP = -1, // No piece.
}

type DraggedPiece = {
  x: number;
  y: number;
  piece: Piece;
  fromSquare: number;
};

const BOARD: number = 560; // Board size.
const SQUARE: number = BOARD / 8; // Square size.
const PIECE: number = 32; // Piece size in the source image.

type BoardState = {
  squares: [];
  selectedSquare: number;
  draggedPiece: DraggedPiece | null;
};

export default function Board() {
  // Refs to access DOM elements.
  const sheet = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  const [board, setBoard] = useState<BoardState>({
    // prettier-ignore
    squares: [
      Piece.WR, Piece.WN, Piece.WB, Piece.WQ, Piece.WK, Piece.WB, Piece.WN, Piece.WR,
	  Piece.WP, Piece.WP, Piece.WP, Piece.WP, Piece.WP, Piece.WP, Piece.WP, Piece.WP,
	  Piece.NP, Piece.NP, Piece.NP, Piece.NP, Piece.NP, Piece.NP, Piece.NP, Piece.NP,
      Piece.NP, Piece.NP, Piece.NP, Piece.NP, Piece.NP, Piece.NP, Piece.NP, Piece.NP,
      Piece.NP, Piece.NP, Piece.NP, Piece.NP, Piece.NP, Piece.NP, Piece.NP, Piece.NP,
      Piece.NP, Piece.NP, Piece.NP, Piece.NP, Piece.NP, Piece.NP, Piece.NP, Piece.NP,
      Piece.BP, Piece.BP, Piece.BP, Piece.BP, Piece.BP, Piece.BP, Piece.BP, Piece.BP,
      Piece.BR, Piece.BN, Piece.BB, Piece.BQ, Piece.BK, Piece.BB, Piece.BN, Piece.BR,
    ],
    draggedPiece: null,
    selectedSquare: -1,
  });

  /*
  Called once when the Board component mounts.
  */
  useEffect(() => {
    const canvas = canvasRef.current;
    ctx.current = canvas.getContext('2d');

    const img = new Image();
    img.src = '/sheet.png';

    const onSheetLoad = () => {
      sheet.current = img;
      draw();
    };

    // Add event listeners.
    img.addEventListener('load', onSheetLoad);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);

    // Remove event listeners.
    return () => {
      img.removeEventListener('load', onSheetLoad);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
    };
  });

  /*
  Called when the user interacts with the board (drags a piece or clicks on a square).
  */
  useEffect(() => {
    if (sheet.current !== null) {
      // Redraw the board.
      draw();
    }
  }, [board]);

  /*
  draw draws the chessboard on the canvas.
  */
  function draw() {
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        // Draw board squares.
        ctx.current.fillStyle = 'white';
        if (
          (rank % 2 !== 0 && file % 2 !== 0) ||
          (rank % 2 === 0 && file % 2 === 0)
        ) {
          ctx.current.fillStyle = 'black';
        }
        const x = file * SQUARE;
        const y = BOARD - SQUARE - rank * SQUARE;
        ctx.current.fillRect(x, y, SQUARE, SQUARE);

        const ind = 8 * rank + file;
        // Draw selected square.
        if (ind === board.selectedSquare) {
          ctx.current.fillStyle = 'green';
          ctx.current.fillRect(x, y, SQUARE, SQUARE);
        }

        // Draw dragged piece.
        if (board.draggedPiece !== null) {
          ctx.current.drawImage(
            sheet.current,
            Math.floor(board.draggedPiece.piece / 2) * PIECE,
            board.draggedPiece.piece % 2 === 0 ? 0 : 32,
            PIECE,
            PIECE,
            board.draggedPiece.x,
            board.draggedPiece.y,
            SQUARE,
            SQUARE
          );
        }

        // Draw pieces.
        if (board.squares[ind] !== Piece.NP) {
          ctx.current.drawImage(
            sheet.current,
            Math.floor(board.squares[ind] / 2) * PIECE,
            board.squares[ind] % 2 === 0 ? 0 : 32,
            PIECE,
            PIECE,
            x,
            y,
            SQUARE,
            SQUARE
          );
        }
      }
    }
  }

  /*
  onMouseDown updates selectedSquare and begins piece drag if the user clicks
  on piece.
  */
  function onMouseDown(e: MouseEvent) {
    const rect = e.originalTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const file = Math.floor(x / SQUARE);
    const rank = Math.floor((BOARD - y) / SQUARE);

    const selected = 8 * rank + file;

    // Begin piece drag.
    if (board.squares[board.selectedSquare] !== Piece.NP) {
      // Temporary remove the piece from its square while its being dragged.
      const squares = board.squares;
      const piece = squares[selected];
      squares[selected] = Piece.NP;

      setBoard((curr) => ({
        draggedPiece: {
          x: x - SQUARE / 2,
          y: y - SQUARE / 2,
          fromSquare: selected,
          piece: piece,
        },
        squares: squares,
        selectedSquare: selected,
      }));
    } else {
      setBoard((curr) => ({
        ...curr,
        selectedSquare: selected,
      }));
    }
  }

  /*
  onMouseMove updates the draggedPiece position.
  */
  function onMouseMove(e: MouseEvent) {
    if (board.draggedPiece !== null) {
      const rect = e.originalTarget.getBoundingClientRect();
      // Align dragged piece to the cursor.
      setBoard((curr) => ({
        ...curr,
        draggedPiece: {
          ...curr.draggedPiece,
          x: e.clientX - rect.left - SQUARE / 2,
          y: e.clientY - rect.top - SQUARE / 2,
        },
      }));
    }
  }

  /*
  onMouseUp handles the piece drop.
  */
  function onMouseUp(e: MouseEvent) {
    const rect = e.originalTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const file = Math.floor(x / SQUARE);
    const rank = Math.floor((BOARD - y) / SQUARE);

    if (board.draggedPiece !== null) {
      const squares = board.squares;
      squares[8 * rank + file] = board.draggedPiece.piece;

      setBoard((curr) => ({
        squares: squares,
        selectedSquare: -1,
        draggedPiece: null,
      }));
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={560}
      height={560}
      className="mx-auto mt-45 cursor-pointer"
    ></canvas>
  );
}
