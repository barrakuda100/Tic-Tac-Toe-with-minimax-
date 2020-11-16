let originBoard;
const humanPlayer = 'O';
const computerPlayer = 'X';
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

const cells = document.querySelectorAll('.cell');

startGame();

function startGame() {
  document.querySelector('.endGame').style.display = 'none';
  // set indexes in cells
  originBoard = Array.from(Array(9).keys());

  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
}

function turnClick(cell) {
  if (typeof originBoard[cell.target.id] == 'number') {
    turn(cell.target.id, humanPlayer);
    if (!checkWin(originBoard, humanPlayer) && !checkTie())
      turn(bestSpot(), computerPlayer);
  }
}

function turn(cellId, player) {
  originBoard[cellId] = player;
  document.getElementById(cellId).innerText = player;

  let gameWon = checkWin(originBoard, player);

  gameWon && gameOver(gameWon);
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;

  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index, player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == humanPlayer ? 'blue' : 'red';
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  declareWinner(gameWon.player == humanPlayer ? 'You win!' : 'You lose.');
}

function declareWinner(who) {
  document.querySelector('.endGame').style.display = 'block';
  document.querySelector('.endGame .text').innerText = who;
}

function emptySquares() {
  return originBoard.filter((s) => typeof s == 'number');
}

function bestSpot() {
  return minimax(originBoard, computerPlayer).index;
  // return emptySquares()[0];
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = 'green';
      cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner('Tie Game!');
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  let availableSpots = emptySquares();

  if (checkWin(newBoard, humanPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, computerPlayer)) {
    return { score: 10 };
  } else if (availableSpots.length === 0) {
    return { score: 0 };
  }
  let moves = [];
  for (let i = 0; i < availableSpots.length; i++) {
    let move = {};
    move.index = newBoard[availableSpots[i]];
    newBoard[availableSpots[i]] = player;

    if (player == computerPlayer) {
      let result = minimax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, computerPlayer);
      move.score = result.score;
    }

    newBoard[availableSpots[i]] = move.index;

    moves.push(move);
  }

  let bestMove;
  if (player === computerPlayer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
