const gameboard = (function () {
  let board = Array(9).fill("");

  const getBoard = () => board;

  const placeMarker = (index, marker) => {
    if (board[index] === "") board[index] = marker;
  };

  const resetBoard = () => {
    board = Array(9).fill("");
  };

  return { getBoard, placeMarker, resetBoard };
})();

function createPlayer(name, marker) {
  return { name, marker };
}

const gameController = (function () {
  const player1 = createPlayer("Player One", "X");
  const player2 = createPlayer("Player Two", "O");

  let currentPlayer = player1;
  let winner = null;

  const playTurn = () => {
    const pos = prompt("Place Marker [0-8]: ");
    gameboard.placeMarker(pos, currentPlayer.marker);
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWinner = () => {
    const b = gameboard.getBoard();
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, bIdx, c] of lines) {
      if (b[a] !== "" && b[a] === b[bIdx] && b[a] === b[c]) {
        winner = b[a] === player1.marker ? player1 : player2;
        return true;
      }
    }
    return false;
  };

  const isBoardFilled = () => {
    const filled = gameboard.getBoard().every((cell) => cell !== "");
    return filled;
  };

  const isGameOver = () => {
    return checkWinner() || isBoardFilled();
  };

  const getWinner = () => winner;

  const reset = () => {
    winner = null;
    currentPlayer = player1;
    gameboard.resetBoard();
  };

  return { playTurn, isGameOver, getCurrentPlayer, getWinner, reset };
})();

const displayController = (function () {
  const boardGrid = document.querySelector(".board-grid");

  // Render the board grid
  for (let i = 0; i < gameboard.getBoard().length; i++) {
    const div = document.createElement("div");
    boardGrid.appendChild(div);
  }
})();

/*
while (!gameController.isGameOver()) {
  gameController.playTurn();
}

const winner = gameController.getWinner();
console.log(winner ? `${winner.name} wins!` : "It's a tie!");
*/
