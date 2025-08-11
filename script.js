(function () {
    const board = document.querySelector('.board');
    const cells = Array.from(document.querySelectorAll('.cell'));
    const status = document.querySelector('.status');
    const restartBtn = document.getElementById('restartBtn');
    const modeRadios = document.querySelectorAll('input[name="mode"]');

    // Win combinations by cell indexes
    const winCombinations = [
      [0,1,2], [3,4,5], [6,7,8], // rows
      [0,3,6], [1,4,7], [2,5,8], // columns
      [0,4,8], [2,4,6]           // diagonals
    ];

    // Game state variables
    let boardState; // Array(9) to hold 'X', 'O' or null
    let currentPlayer; // 'X' or 'O'
    let isGameActive;
    let mode; // "two-players" or "vs-computer"

    // Initialize or reset the game
    function init() {
      boardState = Array(9).fill(null);
      currentPlayer = 'X';
      isGameActive = true;
      cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('disabled');
      });
      status.textContent = "Player X's turn";
    }

    // Switch players for two-player mode
    function switchPlayer() {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      status.textContent = `Player ${currentPlayer}'s turn`;
    }

    // Check if anyone won or the game is draw
    function checkWin() {
      for (const combo of winCombinations) {
        const [a, b, c] = combo;
        if (
          boardState[a] &&
          boardState[a] === boardState[b] &&
          boardState[a] === boardState[c]
        ) {
          return boardState[a];
        }
      }
      if (boardState.every(cell => cell !== null)) {
        return 'draw';
      }
      return null;
    }

    // Mark a move on the board and update visuals & state
    function makeMove(index) {
      if (!isGameActive || boardState[index]) return false;
      boardState[index] = currentPlayer;
      cells[index].textContent = currentPlayer;
      cells[index].classList.add('disabled');
      return true;
    }

    // Computer AI: Simple random choice available cells
    function computerMove() {
      if(!isGameActive) return;
      const availableIndexes = boardState.reduce((acc, val, idx) => {
        if(val === null) acc.push(idx);
        return acc;
      }, []);

      if (availableIndexes.length === 0) return;

      // Basic AI - random move
      const choice = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
      makeMove(choice);

      const winner = checkWin();
      if (winner) {
        endGame(winner);
      } else {
        currentPlayer = 'X';
        status.textContent = "Player X's turn";
      }
    }

    // End the game with result
    function endGame(winner) {
      isGameActive = false;
      if (winner === 'draw') {
        status.textContent = "It's a draw!";
      } else {
        status.textContent = `Player ${winner} wins!`;
        // Highlight winning cells
        for (const combo of winCombinations) {
          const [a, b, c] = combo;
          if (
            boardState[a] === winner &&
            boardState[b] === winner &&
            boardState[c] === winner
          ) {
            cells[a].style.backgroundColor = '#ff6600ff';
            cells[b].style.backgroundColor = '#ff6600ff';            
            cells[c].style.backgroundColor = '#ff6600ff';
            cells.forEach(cell => cell.classList.add('disabled'));
            break;
          }
        }
      }
    }

    // On cell click handler
    function onCellClick(e) {
      const index = Number(e.target.dataset.index);
      if(!isGameActive || boardState[index]) return;
      if (!makeMove(index)) return;

      const winner = checkWin();
      if (winner) {
        endGame(winner);
        return;
      }
      if (mode === 'two-players') {
        switchPlayer();
      } else if (mode === 'vs-computer') {
        currentPlayer = 'O';
        status.textContent = "Computer's turn";
        cells.forEach(cell => cell.classList.add('disabled'));
        // Delay computer move for UX
        setTimeout(() => {
          computerMove();
          if (isGameActive) cells.forEach(cell => {
            if (!cell.textContent) cell.classList.remove('disabled');
          });
        }, 500);
      }
    }
    // Handle mode change
    function onModeChange() {
      mode = document.querySelector('input[name="mode"]:checked').value;
  console.log("Game mode changed to:", mode);
      restartGame();
    }

    // Restart game handler
    function restartGame() {
      cells.forEach(cell => {
        cell.style.backgroundColor = '';
      });
      mode = document.querySelector('input[name="mode"]:checked').value;
      init();
      // Enable all cells
      cells.forEach(cell => cell.classList.remove('disabled'));
    }

    cells.forEach(cell => cell.addEventListener('click', onCellClick));
    restartBtn.addEventListener('click', restartGame);
    modeRadios.forEach(radio => radio.addEventListener('change', onModeChange));

    // Keyboard accessibility: allow space/enter to click cells
    board.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' ') {
        const active = document.activeElement;
        if(active.classList.contains('cell')) {
          active.click();
          e.preventDefault();
        }
      }
    });

    // Start game initially
    init();
  })();