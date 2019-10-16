var userPiece = "X";
var computerPiece = "O";
var moveHistory = [1, 3, 5, 3, 6, 8];

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
    // TODO
}

function blockFork() {
    // TODO
}

function threatenWin() {
    // TODO, may not be needed
}

function playCenter(moveHistory) {
    // Return center square (5) if available, otherwise return 0

    return (moveHistory.indexOf(5) == -1) ? 5 : 0;
}

function playOppositeCorner(moveHistory) {
    // TODO
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
