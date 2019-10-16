// This file contains all the functions related to the actual Tic-Tac-Toe game

var userPiece = "";
var computerPiece = "";
var moveHistory = [];

function choosePiece(button) {
    // Set userPiece and show which piece the user has with a border

    if (userPiece == "") {
        userPiece = button.innerHTML;
        chosePiece = true;
        button.setAttribute("style", "border-bottom: 2px solid red;");
    }

    // Set computerPiece depending on what user chose
    (userPiece == "X") ? computerPiece = "O" : computerPiece = "X";

    if (userPiece == "O" && moveHistory.length == 0) {
        generateComputerMove(moveHistory);
    }
}

function userClick(cardSquare) {
    // userClick displays the user's move and asks the computer to make a move

    if (userPiece == "") {
        userPiece = "X";
        computerPiece = "O";
    }

    // Alert user if they try to place a piece on an occupied square
    if (cardSquare.innerHTML == "O" || cardSquare.innerHTML == "X") {
        alert("This square already has a piece!");
    
    // Drop piece into the square, check the board state, and generate computer move
    } else {
        cardSquare.innerHTML = userPiece;
        moveHistory.push(parseInt(cardSquare.id));

        if (!checkGameOver(userPiece, moveHistory)) {
            generateComputerMove(moveHistory);
        }
    }
}

function generateComputerMove(moveHistory) {
    // This is a test function that generates a random computer move

    const legalMoves = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let availableMoves = legalMoves.filter(function(move) {
        return !moveHistory.includes(move);
    });

    let computerMove = availableMoves[Math.floor(Math.random() * (availableMoves.length - 1))];
    document.getElementById(`${computerMove}`).innerHTML = computerPiece;
    moveHistory.push(computerMove);

    checkGameOver(computerPiece, moveHistory);
}

function determineGameResult(piece, moveHistory) {
    // Given a piece, check if the current game is won, drawn, or ongoing

    const possibleWins = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7],
                         [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];

    let pieceMoveHistory = [];

    // Separate the given piece's moves from the other player's moves
    moveHistory.forEach(function(move) {
        if (piece == "X") {
            if (moveHistory.indexOf(move) % 2 == 0) {
                pieceMoveHistory.push(move);
            }
        } else {
            if (!(moveHistory.indexOf(move) % 2 == 0)) {
                pieceMoveHistory.push(move);
            }
        }
    });

    // Check each possible win and return "win" if a combination is valid
    for (let i = 0; i < 8; i++) {
        if (checkPossibleWin(pieceMoveHistory, possibleWins[i])) {
            return "win";
        }
    }

    // If no wins were found and 9 moves have been played, the game is a draw
    if (moveHistory.length == 9) {
        return "draw";
    }

    // If there is no win and the game is not drawn, the game is still ongoing
    return "ongoing";
}

function checkPossibleWin(pieceMoveHistory, possibleWin) {
    /* Given a piece's move history and a possible win, return a boolean value 
       depending on whether or not the possible win is in the move history */

    for (let j = 0; j < 3; j++) {
        if (pieceMoveHistory.indexOf(possibleWin[j]) == -1) {
            return false;
        }
    }

    return true;
}

function checkGameOver(piece, moveHistory) {
    // Checks if the game is over given a piece and array of moves

    let gameResult = determineGameResult(piece, moveHistory);

    if (gameResult == "win") {
        if (piece == userPiece) {
            showModal("win");
            return true;
        } else {
            showModal("lose");
            return true;
        }
    } else if (gameResult == "draw") {
        showModal("draw");
        return true;
    } else {
        return false;
    }
}

function showModal(gameResult) {
    // Handles the display of the modal and which image to show

    $('#gameResultModal').modal({backdrop: "static"});

    if (gameResult == "win") {
        $('#gameResultModal').find('.modal-title').text("You won!");
        $('#gameResultModal').find('.meme').attr("src", "static/win.jpg");
    } else if (gameResult == "lose") {
        $('#gameResultModal').find('.modal-title').text("You lost!");
        $('#gameResultModal').find('.meme').attr("src", "static/lose.jpg");
    } else {
        $('#gameResultModal').find('.modal-title').text("You drew!");
        $('#gameResultModal').find('.meme').attr("src", "static/draw.jpg");
    }
}

function resetGame() {
    // Resets the game so it can be played again

    // Close the modal
    $('#gameResultModal').modal("hide");

    // Reset global game variables
    userPiece = "";
    computerPiece = "";
    moveHistory = [];

    // Reset board
    for (let square = 1; square < 10; square++) {
        document.getElementById(`${square}`).innerHTML = `${square}`;
    }

    // Reset piece highlighters
    document.getElementById("piece-X").removeAttribute("style");
    document.getElementById("piece-O").removeAttribute("style");
}