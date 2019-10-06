// This file contains all the functions related to the actual Tic-Tac-Toe game

var userPiece = "";
var computerPiece = "";
var moveHistory = [];

function choosePiece(button) {
    // Set userPiece and show which piece the user has with a border

    if (userPiece == "") {
        userPiece = button.innerHTML;
        button.setAttribute("style", "border-bottom: 2px solid red;");
    }

    // Set computerPiece depending on what user chose
    (userPiece == "X") ? computerPiece = "O" : computerPiece = "X";

    if (userPiece == "O") {
        generateComputerMove(moveHistory);
    }
}

function userClick(cardSquare) {
    // userClick displays the user's move and asks the computer to make a move

    if (userPiece == "") {
        alert("Please choose a piece!");
    
    // Alert user if they try to place a piece on an occupied square
    } else if (cardSquare.innerHTML == "O" || cardSquare.innerHTML == "X") {
        alert("This square already has a piece!");
    
    // Drop piece into the square, check the board state, and generate computer move
    } else {
        cardSquare.innerHTML = userPiece;
        moveHistory.push(parseInt(cardSquare.id));

        // Check the board state and end game if result has been determined
        if (gameOver(moveHistory)) {
            alert("Game over! This part of the code is under construction ATM!");
        } else {
            generateComputerMove(moveHistory);
        }
    }
}

var legalMoves;
var availableMoves;
var computerMove;

function generateComputerMove(moveHistory) {
    // This is a test function that generates a random computer move

    legalMoves = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    availableMoves = legalMoves.filter(function(move) {
        return !moveHistory.includes(move);
    });

    if (availableMoves.length == 0) {
        //TODO: Handle the draw
        alert("Game over! It's a draw!");
    }

    computerMove = availableMoves[Math.floor(Math.random() * (availableMoves.length - 1))];
    document.getElementById(`${computerMove}`).innerHTML = computerPiece;
    moveHistory.push(computerMove);
}

function gameOver(moveHistory) {
    // TODO: Implement a way to check for board win

    return false;
}