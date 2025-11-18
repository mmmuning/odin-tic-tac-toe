function gameboard() {
  let board = Array(9).fill("");

  const getBoard = () => board;

  const placeMarker = (index, currentPlayer) => {
    if (board[index] === "") board[index] = currentPlayer.marker;
  };

  return { getBoard, placeMarker };
}

function createPlayer(name, marker) {
  return { name, marker };
}

function gameController() {
  const gb = gameboard();

  // Create Players
  const player1 = createPlayer("Player One", "X");
  const player2 = createPlayer("Player Two", "O");

  // Keep track of the player
  let currentPlayer = player1;
  let winner;

  const playTurn = () => {
    // Get player marker position
    const markerPos = prompt("Place Marker [0-8]: ");

    // Tell gameboard to place marker
    gb.placeMarker(markerPos, currentPlayer);

    // Switch players at the end of every turn
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  // Check if there's 3-in-a-row/column/diagonal win
  const checkWinner = () => {
    const winningCombinations = [
      [0, 1, 2], // Rows
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6], // Columns
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8], // Diagonals
      [2, 4, 6],
    ];

    // First check if there's a winner
    // Check if X or O has the winning combinations
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        gb.getBoard()[a] !== "" &&
        gb.getBoard()[a] === gb.getBoard()[b] &&
        gb.getBoard()[a] === gb.getBoard()[c]
      ) {
        winner = gb.getBoard()[a] === player1.marker ? player1 : player2;
        return true;
      }
    }

    return false;
  };

  // Check if board is filled
  const isBoardFilled = () => {
    const filledCount = gb
      .getBoard()
      .reduce((acc, index) => (index !== "" ? acc + 1 : acc), 0);
    return filledCount === gb.getBoard().length;
  };

  const isGameOver = () => {
    return checkWinner() || isBoardFilled();
  };

  const getWinner = () => winner;

  const resetGame = () => {
    // Clear the board
    gb.getBoard().fill("");
    // Reset winner
    winner = undefined;
    // Reset current player
    currentPlayer = player1;
  };

  return {
    playTurn,
    checkWinner,
    isBoardFilled,
    isGameOver,
    getWinner,
    resetGame,
  };
}

const game = gameController();

// Check if board is all filled or when there's a win instead of looping
while (!game.isGameOver()) {
  game.playTurn();
}

if (game.getWinner() !== undefined) {
  console.log(game.getWinner());
} else {
  console.log("It's a TIE!!");
}

game.resetGame();
