// Abanoub Rezkalla
// Two people take turns placing X and O using mouse clicks.

// Get the HTML elements we need.
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

const CELL_SIZE = canvas.width / 3;

// Each position in this array represents one square on the board.
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let winner = null;
let gameOver = false;

// Draw the empty board, then wait for mouse clicks.
drawBoard();
canvas.addEventListener("click", handleClick);
resetBtn.addEventListener("click", resetGame);

function handleClick(event) {
    // No more moves are allowed after someone wins or the game is tied.
    if (gameOver) {
        return;
    }

    // Find which square the user clicked. Scaling keeps clicks correct
    // even when CSS makes the canvas smaller than 600 pixels.
    const rect = canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) * canvas.width / rect.width;
    const mouseY = (event.clientY - rect.top) * canvas.height / rect.height;

    if (mouseX < 0 || mouseY < 0 || mouseX >= canvas.width || mouseY >= canvas.height) {
        return;
    }

    const col = Math.floor(mouseX / CELL_SIZE);
    const row = Math.floor(mouseY / CELL_SIZE);
    const index = row * 3 + col;

    // A square can only be used once.
    if (board[index] !== "") {
        return;
    }

    board[index] = currentPlayer;
    drawBoard();

    // Check for a winner or a tie after every move.
    winner = checkWinner();
    if (winner) {
        statusText.textContent = `${winner} Wins!`;
        gameOver = true;
    } else if (board.every(square => square !== "")) {
        statusText.textContent = "It's a Tie!";
        gameOver = true;
    } else {
        // Switch to the other human player.
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `Player ${currentPlayer} Turn`;
    }
}

function checkWinner() {
    // Three rows, three columns, and two diagonals.
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    winner = null;
    gameOver = false;
    statusText.textContent = "Player X Turn";
    drawBoard();
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawPieces();
}

function drawGrid() {
    ctx.beginPath();
    ctx.strokeStyle = "#9eb9d0";
    ctx.lineWidth = 5;

    ctx.moveTo(CELL_SIZE, 0);
    ctx.lineTo(CELL_SIZE, canvas.height);
    ctx.moveTo(CELL_SIZE * 2, 0);
    ctx.lineTo(CELL_SIZE * 2, canvas.height);
    ctx.moveTo(0, CELL_SIZE);
    ctx.lineTo(canvas.width, CELL_SIZE);
    ctx.moveTo(0, CELL_SIZE * 2);
    ctx.lineTo(canvas.width, CELL_SIZE * 2);
    ctx.stroke();
}

function drawPieces() {
    for (let i = 0; i < board.length; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const x = col * CELL_SIZE;
        const y = row * CELL_SIZE;

        if (board[i] === "X") {
            drawX(x, y);
        } else if (board[i] === "O") {
            drawO(x, y);
        }
    }
}

function drawX(x, y) {
    ctx.beginPath();
    ctx.strokeStyle = "#2563d6";
    ctx.lineWidth = 13;
    ctx.lineCap = "round";
    ctx.moveTo(x + 47, y + 47);
    ctx.lineTo(x + 153, y + 153);
    ctx.moveTo(x + 153, y + 47);
    ctx.lineTo(x + 47, y + 153);
    ctx.stroke();
}

function drawO(x, y) {
    ctx.beginPath();
    ctx.strokeStyle = "#e8813a";
    ctx.lineWidth = 13;
    ctx.arc(x + 100, y + 100, 57, 0, Math.PI * 2);
    ctx.stroke();
}
