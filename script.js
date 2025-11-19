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

  const getCurrentPlayer = () => currentPlayer;

  const playGame = () => {
    displayController.renderBoard();
  };

  const playTurn = (index) => {
    const board = gameboard.getBoard();
    const marker = currentPlayer.marker;

    if (board[index] !== "") return null; // Ignore invalid move

    gameboard.placeMarker(index, marker);

    const winningIndexes = checkWinner();

    if (winningIndexes) {
      console.log(`${winner.name} wins!`);
      displayController.highlightGridCells(winningIndexes);
      displayController.showResultModal(winner.name);
    } else if (isBoardFilled()) {
      console.log("It's a tie!");
      displayController.showResultModal(null);
    }

    switchPlayer();
    return marker;
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWinner = () => {
    const board = gameboard.getBoard();
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

    for (const [a, b, c] of lines) {
      if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
        winner = board[a] === player1.marker ? player1 : player2;
        return [a, b, c];
      }
    }

    return null;
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

  return {
    playGame,
    playTurn,
    switchPlayer,
    isGameOver,
    getCurrentPlayer,
    getWinner,
    reset,
  };
})();

const displayController = (function () {
  const boardGrid = document.querySelector(".board-grid");
  const modal = document.querySelector("#result-modal");
  const gameResult = modal.querySelector("#game-result");
  const winnerName = modal.querySelector("#winner-name");
  const restartBtn = document.querySelector("#btn-restart");

  const renderBoard = () => {
    // Remove existing cells
    while (boardGrid.firstChild) {
      boardGrid.removeChild(boardGrid.firstChild);
    }

    // Render new cells
    for (let i = 0; i < gameboard.getBoard().length; i++) {
      const gridCell = document.createElement("div");
      gridCell.dataset.index = i;
      gridCell.addEventListener("click", () => handleGridCellClick(gridCell));
      boardGrid.appendChild(gridCell);
    }
  };

  const handleGridCellClick = (element) => {
    const index = element.dataset.index;
    const marker = gameController.playTurn(index);
    if (marker) renderMarker(element, marker);
  };

  const renderMarker = (element, currentPlayerMarker) => {
    const svgNS = "http://www.w3.org/2000/svg";
    const playerMarker = document.createElementNS(svgNS, "svg");
    playerMarker.setAttribute("width", "48");
    playerMarker.setAttribute("height", "48");
    playerMarker.setAttribute("viewBox", "0 0 24 24");

    if (currentPlayerMarker === "X") {
      const line1 = document.createElementNS(svgNS, "line");
      line1.setAttribute("x1", "4");
      line1.setAttribute("y1", "4");
      line1.setAttribute("x2", "20");
      line1.setAttribute("y2", "20");
      line1.setAttribute("stroke", "#82AFF3");
      line1.setAttribute("stroke-width", "4");
      playerMarker.appendChild(line1);

      const line2 = document.createElementNS(svgNS, "line");
      line2.setAttribute("x1", "20");
      line2.setAttribute("y1", "4");
      line2.setAttribute("x2", "4");
      line2.setAttribute("y2", "20");
      line2.setAttribute("stroke", "#82AFF3");
      line2.setAttribute("stroke-width", "4");
      playerMarker.appendChild(line2);
    } else {
      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", "12");
      circle.setAttribute("cy", "12");
      circle.setAttribute("r", "10");
      circle.setAttribute("stroke", "#fdac33");
      circle.setAttribute("stroke-width", "4");
      circle.setAttribute("fill", "none");
      playerMarker.appendChild(circle);
    }

    element.appendChild(playerMarker);
  };

  const highlightGridCells = (indexes) => {
    indexes.forEach((index) => {
      const cell = boardGrid.querySelector(`[data-index='${index}']`);
      cell.classList.add("highlight");
    });
  };

  const showResultModal = (winner) => {
    if (winner !== null) {
      gameResult.textContent = "WINNER!";
      winnerName.textContent = winner;
    } else {
      winnerName.textContent = "";
      gameResult.textContent = "IT'S A TIE!";
    }
    modal.style.display = "flex";
  };

  const hideResultModal = () => {
    modal.style.display = "none";
  };

  restartBtn.addEventListener("click", () => {
    hideResultModal();
    gameController.reset();
    gameController.playGame();
  });

  return {
    renderBoard,
    renderMarker,
    handleGridCellClick,
    highlightGridCells,
    showResultModal,
    hideResultModal,
  };
})();

gameController.playGame();
