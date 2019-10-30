// This file contains code related to the replaying of games from the match history

var movesArray = [];
var moveCounter = 0;

function replayGame(username, piece, moveHistory) {
    /* This function sets the value of movesArray, 
       dynamically changes the modal title, and shows the modal */

    /* The move history is stored in PostgreSQL as a string of numbers 
       (separated by a single whitespace) representing the moves of the game,
       so we split the argument moveHistory to get an array */
    movesArray = moveHistory.split(" ");

    document.getElementById("replay-modal-title").innerHTML = (piece == "X") ? `Replaying ${username} vs. Computer` : `Replaying Computer vs. ${username}`;

    $('#replayGameModal').modal({backdrop: "static"});
}

function nextMove() {
    // Show the game's next move

    if (moveCounter != movesArray.length) {
        /* If the counter is divisible by 2, the move is played by X,
           so we put an X in that square */
        if (moveCounter % 2 == 0) {
            document.getElementById(`${movesArray[moveCounter]}`).innerHTML = "X";
        } else {
            document.getElementById(`${movesArray[moveCounter]}`).innerHTML = "O";
        }

        moveCounter++;
    }
}

function previousMove() {
    // Go back to the game's previous move 

    if (moveCounter != 0) {
        moveCounter--;
        document.getElementById(`${movesArray[moveCounter]}`).innerHTML = "&nbsp";
    }
}

function closeModal() {
    // This function closes the modal and resets all the replay variables

    // Reset all the squares to a non-breaking space so it appears empty
    movesArray.forEach(function(square) {
        document.getElementById(`${square}`).innerHTML = "&nbsp";
    });

    // Reset modal title
    document.getElementById("replay-modal-title").innerHTML = "";

    // Reset variables
    movesArray = [];
    moveCounter = 0;

    $('#replayGameModal').modal("hide");
}