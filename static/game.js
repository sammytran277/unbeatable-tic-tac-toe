// This file contains all the functions related to the Tic-Tac-Toe game

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

function generateComputerMove(moveHistory) {
    // This is a test function that generates a random computer move

    let computerMove;

    if (playWin(computerPiece, moveHistory) != 0) {
        computerMove = playWin(computerPiece, moveHistory);
    } else if (blockWin(userPiece, moveHistory) != 0) {
        computerMove = blockWin(userPiece, moveHistory);
    } else if (playFork(computerPiece, moveHistory) != 0) {
        computerMove = playFork(computerPiece, moveHistory);
    } else if (blockFork(userPiece, moveHistory)) {
        computerMove = blockFork(userPiece, moveHistory);
    } else if (threatenWin(userPiece, computerPiece, moveHistory) != 0) {
        computerMove = threatenWin(userPiece, computerPiece, moveHistory);
    } else if (playCenter(moveHistory) != 0) {
        computerMove = playCenter(moveHistory);
    } else if (playOppositeCorner(moveHistory) != 0) {
        computerMove = playOppositeCorner(moveHistory);
    } else if (playEmptyCorner(moveHistory) != 0) {
        computerMove = playEmptyCorner(moveHistory);
    } else {
        computerMove = playEmptySide(moveHistory);
    }

    document.getElementById(`${computerMove}`).innerHTML = computerPiece;
    moveHistory.push(computerMove);

    checkGameOver(computerPiece, moveHistory);
}

// All the functions that handle the computer's moves are below:

function computerMoveHistory(computerPiece, moveHistory) {
    // Returns an array with just the computer's move history

    let computerMoveHistory = [];
    let index;

    // Take every other move starting from 0 or 1 depending on computer's piece
    (computerPiece == "X") ? index = 0 : index = 1;

    for (n = moveHistory.length; index < n; index += 2) {
        computerMoveHistory.push(moveHistory[index]);
    }

    return computerMoveHistory;
}

function getAvailableMoves(moveHistory) {
    /* Given the game's move history, return an array with
       the number of all the squares that are empty */

    const legalMoves = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let availableMoves = legalMoves.filter(function(move) {
        return !moveHistory.includes(move);
    });

    return availableMoves;
}

function countWins(computerPiece, moveHistory) {
    /* Given the computer's piece and the move history, return the 
       number of winning moves in the position (used in playFork() 
       because a fork by definition is a move that threatens two wins) */

    // This array contains all possible winning combinations in Tic-Tac-Toe
    const possibleWins = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], 
                          [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
    
    let computerMoves = computerMoveHistory(computerPiece, moveHistory);
    let counter;
    let wins = 0;
    
    // Iterate through each possible win
    for (let i = 0, n = possibleWins.length; i < n; i++) {
        counter = 0;

        // Iterate through each possible win array's elements
        for (let j = 0; j < 3; j++) {
            if (computerMoves.indexOf(possibleWins[i][j]) != -1) {
                counter++;
            }
        }

        // Increase the number of wins by 1 if a win is available 
        if (counter == 2) {
            for (let k = 0; k < 3; k++) {
                if (moveHistory.indexOf(possibleWins[i][k]) == -1) {
                    wins++;
                } 
            }
        }
    }

    return wins;
}

function countForks(computerPiece, moveHistory) {
    /* Given the computer's piece and the move history, return the
       number of moves that fork */

    let availableMoves = getAvailableMoves(moveHistory);
    let copyMoveHistory;
    let forks = 0;

    // Look through each legal move and increment fork if there is a fork
    for (let i = 0, n = availableMoves.length; i < n; i++) {
        copyMoveHistory = moveHistory.slice();
        copyMoveHistory.push(availableMoves[i]);

        if (countWins(computerPiece, copyMoveHistory) >= 2) {
            forks++;
        }
    }

    return forks;
}

function playWin(computerPiece, moveHistory) {
    /* Given the computer's piece and the move history, return the 
       winning move if there is one available, otherwise return 0 */

    // This array contains all possible winning combinations in Tic-Tac-Toe
    const possibleWins = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], 
                          [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
    
    let computerMoves = computerMoveHistory(computerPiece, moveHistory);
    let counter;
    
    // Iterate through each possible win
    for (let i = 0, n = possibleWins.length; i < n; i++) {
        counter = 0;

        // Iterate through each possible win array's elements
        for (let j = 0; j < 3; j++) {
            if (computerMoves.indexOf(possibleWins[i][j]) != -1) {
                counter++;
            }
        }

        // Return the last square needed to win if it is available
        if (counter == 2) {
            for (let k = 0; k < 3; k++) {
                if (moveHistory.indexOf(possibleWins[i][k]) == -1) {
                    return possibleWins[i][k];
                } 
            }
        }
    }

    return 0;
}

function blockWin(userPiece, moveHistory) {
    /* Given the user's piece and the move history, return the 
       winning move (to block it) if there is one available, 
       otherwise return 0 */

    return playWin(userPiece, moveHistory);
}

function playFork(computerPiece, moveHistory) {
    /* Given the computer's piece and the move history, return the
       move that creates a fork if available, otherwise return 0 */

    let availableMoves = getAvailableMoves(moveHistory);
    let copyMoveHistory;

    /* Look through each legal move and stop if playing it would threaten 
       two or more wins (a fork) */
    for (let i = 0, n = availableMoves.length; i < n; i++) {
        copyMoveHistory = moveHistory.slice();
        copyMoveHistory.push(availableMoves[i]);

        if (countWins(computerPiece, copyMoveHistory) >= 2) {
            return availableMoves[i];
        }
    }

    return 0;
}

function blockFork(userPiece, moveHistory) {
    /* Given the user's piece and the move history, return the 
       move that forks (to block it) if there is one available, 
       otherwise return 0 */

    let availableMoves = getAvailableMoves(moveHistory);
    let copyMoveHistory;

    for (let i = 0, n = availableMoves.length; i < n; i++) {
        copyMoveHistory = moveHistory.slice();
        copyMoveHistory.push(availableMoves[i]);

        if (countForks(userPiece, copyMoveHistory) == 0 && moveHistory.length >= 3) {
            return availableMoves[i];
        }
    }
    
    return 0;
}

function threatenWin(userPiece, computerPiece, moveHistory) {
    /* For special cases where two forks are threatened, the computer
       will play a move that threatens to win that can not be blocked
       by a fork  */

    let availableMoves = getAvailableMoves(moveHistory);
    let copyMoveHistory;

    for (let i = 0, n = availableMoves.length; i < n; i++) {
        copyMoveHistory = moveHistory.slice();
        copyMoveHistory.push(availableMoves[i]);

        if (countWins(computerPiece, copyMoveHistory) >= 1 && countForks(userPiece, copyMoveHistory) <= 1) {
            return availableMoves[i];
        }
    }

    return 0;
}

function playCenter(moveHistory) {
    // Return center square (5) if available, otherwise return 0

    return (moveHistory.indexOf(5) == -1) ? 5 : 0;
}

function playOppositeCorner(moveHistory) {
    /* Return the opposite corner to the one played by the user 
       if it is available, otherwise return 0 */

    let lastPlayedMove = moveHistory[moveHistory.length - 1];

    switch (lastPlayedMove) {
        case 1:
            return (moveHistory.indexOf(9) == -1) ? 9 : 0;
        case 3:
            return (moveHistory.indexOf(7) == -1) ? 7 : 0;
        case 7:
            return (moveHistory.indexOf(3) == -1) ? 3 : 0;
        case 9:
            return (moveHistory.indexOf(1) == -1) ? 1 : 0;
        default:
            return 0;
    }
}

function playEmptyCorner(moveHistory) {
    /* Given the computer's piece and the move history, 
       return an empty corner square if there is one available, 
       otherwise return 0 */ 

    const cornerSquares = [1, 3, 7, 9];

    for (let i = 0; i < 4; i++) {
        if (moveHistory.indexOf(cornerSquares[i]) == -1) {
            return cornerSquares[i];
        }
    }

    return 0;
}

function playEmptySide(moveHistory) {
    /* Given the computer's piece and the move history, 
       return an empty side square if there is one available, 
       otherwise return 0 */ 

    const sideSquares = [2, 4, 6, 8];

    for (let i = 0; i < 4; i++) {
        if (moveHistory.indexOf(sideSquares[i]) == -1) {
            return sideSquares[i];
        }
    }

    return 0;
}

