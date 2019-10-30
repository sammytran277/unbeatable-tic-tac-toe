// This file contains code related to the replaying of games from the match history

var movesArray;
var moveCounter = 0;

function replayGame(username, piece, moveHistory) {

    /* The move history is stored in PostgreSQL as a string of numbers 
       (separated by a single whitespace) representing the moves of the game,
       so we split the argument moveHistory to get an array */
    movesArray = moveHistory.split(" ");

    document.getElementById("replay-modal-title").innerHTML = (piece == "X") ? `Replaying ${username} vs. Computer` : `Replaying Computer vs. ${username}`;

    $('#replayGameModal').modal({backdrop: "static"});
}

function nextMove() {
    if (moveCounter != movesArray.length) {
        // If the counter is divisible by 2, the move is played by X
        if (moveCounter % 2 == 0) {
            document.getElementById(`${movesArray[moveCounter]}`).innerHTML = "X";
        } else {
            document.getElementById(`${movesArray[moveCounter]}`).innerHTML = "O";
        }

        moveCounter++;
    }
}

function previousMove() {
    if (moveCounter != 0) {
        moveCounter--;
        document.getElementById(`${movesArray[moveCounter]}`).innerHTML = "&nbsp";
    }
}

function closeModal() {
    $('#replayGameModal').modal("hide");
}