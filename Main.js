//Generate a 7x9 grid, each element having its respective coordinate as its id
//Nested for loop, outer layer creates the row, inner loop fills the row with the tiles
//All generated tiles get added to a generated tiles array
//Grid will then be appended to an existing div
let generatedTiles = [];

function generateGrid(width, height){
    let output = document.createElement('div');
    output.style.border = '2px solid black';
    output.style.margin = '25px auto';
    output.style.display = 'inline-block';
    for( i = 0; i < height; i++ ){
        let row = document.createElement('div');
        row.style.height = '52px';
        for( j = 0; j < width; j++){
            let tileElement = document.createElement('p');
            //grid is created top-down so the id is calculated such that bottom left grid tile is 11, stored as a string
            let generatedId = [j + 1].toString() + [height - i].toString();
            tileElement.id = generatedId;
            //created element is added to the generated tiles array then appended to the row
            generatedTiles.push(generatedId);
            tileElement.className = 'gridTile';
            row.appendChild(tileElement);
        }
        output.appendChild(row);
    }
    console.log(`Generated ${width} by ${height} grid`);
    return output;
}

//creating the grid and appending to the target div
document.getElementById('playingGrid').appendChild(generateGrid(7,9));

//tile position represented by respective tile having a grey background color of #A9A9A9
//function returns current tile position to white and updates current position and logs the change
function updateTetraminoPosition(newPosition) {
    document.getElementById(tetraminoPosition).style.backgroundColor = 'white';
    document.getElementById(newPosition).style.backgroundColor = '#A9A9A9';
    tetraminoPosition = newPosition;
}

//helper functions for recoloring and filling the represented tile
function fillTile(targetId) {
    targetElement = document.getElementById(targetId);
    filledTiles.push(targetId);
    targetElement.style.backgroundColor = '#A9A9A9';
}

function emptyTile(targetId) {
    targetElement = document.getElementById(targetId);
    tagetElement.style.backgroundColor = 'white';
    let targetIndex = filledTiles.findIndex(targetId);
    filledTiles.splice(targetIndex,1);
}

//global variable movementAllowed disables / enables movement of the tile
//function move tile checks if the proposed position is filled by another tile or out of bounds, only accepts a s d as inputs
//returns the new tile
let movementAllowed = false;
let filledTiles = [];
let tetraminoPosition = '49';
function moveTile(movementInput) {
    if(movementAllowed) {

        if(/[asd]/.test(movementInput)){
            
            let currentXCoord = Number(tetraminoPosition[0]);
            let currentYCoord = Number(tetraminoPosition[1]);
            let proposedXCoord;
            let proposedYCoord;
            let proposedPosition;
            switch(movementInput) {
                case 'a':
                    proposedXCoord = currentXCoord - 1;
                    proposedYCoord = currentYCoord;
                    break;
                case 'd':
                    proposedXCoord = currentXCoord + 1;
                    proposedYCoord = currentYCoord;
                    break;     
                case 's':
                    proposedXCoord = currentXCoord;
                    proposedYCoord = currentYCoord - 1;
                    break;              
                default:
                    console.log(`error - check moveTile() regex`);
            }
            proposedPosition = proposedXCoord.toString() + proposedYCoord.toString();
            //checking if proposed position is out of bounds OR filled
            if(proposedXCoord < 1 || proposedXCoord > 7 || proposedYCoord < 1 || filledTiles.includes(proposedPosition)) {
                console.log(`proposed position ${proposedPosition} is out of bounds or filled`);
                return 'movement blocked';
            } else {
                updateTetraminoPosition(proposedPosition);
                return proposedPosition;
            }

        } else {
            console.log(`input "${movementInput}" ignored`);
        }

    } else {
        console.log(`movement disallowed, input ignored`);
    }
}


//function to move the tetra down, filling the position if the movement fails (function returns 'movement blocked')
//ends the game if the tile stops at position 49
function dropTile() {
    let newPosition = moveTile('s');
    if(newPosition === 'movement blocked'){
        console.log(`movement blocked, position ${tetraminoPosition} is now filled`);
        filledTiles.push(tetraminoPosition);
        tetraminoPosition = '49';
        document.getElementById('49').style.backgroundColor = '#A9A9A9';
    }
    score();
    if(filledTiles.includes('49')){
        movementAllowed = false;
        fallingState(false);
        document.getElementById('gameOverScreen').style.display = 'block';
    }
}

//function to start/stop the tile falling
//uses a global variable to store the state
let fallingTetra;
function fallingState(inputBool) {
    if(inputBool) {
        fallingTetra = setInterval(dropTile, 500);
    } else {
        clearInterval(fallingTetra);
    }
}


//function resets tile position to 49, clears all the tile backgrounds back to white, hides the game over / game title screen and starts the tile falling
function startGame() {
    generatedTiles.forEach((x) => document.getElementById(x).style.backgroundColor = 'white');
    filledTiles = [];
    updateTetraminoPosition('49');
    userScore = 0;
    updateScore();
    console.log(`startGame() triggered`)
    document.getElementById(`gameOverScreen`).style.display = "none";
    document.getElementById(`gameTitleScreen`).style.display = "none";
    fallingState(true);
    movementAllowed = true;
}


//function to return an array of all elements in a particular row
function getRowElements(targetRowHeight, gridWidth) {
    let outputArray = [];
    for( i = 0; i < gridWidth ; i++) {
        let generatedElement = (i + 1).toString() + targetRowHeight.toString();
        outputArray.push(generatedElement);
    }
    return outputArray;
}

//array of arrays of all the elements in the grid by row
const row1Elements = getRowElements(1,7);
const row2Elements = getRowElements(2,7);
const row3Elements = getRowElements(3,7);
const row4Elements = getRowElements(4,7);
const row5Elements = getRowElements(5,7);
const row6Elements = getRowElements(6,7);
const row7Elements = getRowElements(7,7);
const row8Elements = getRowElements(8,7);
const row9Elements = getRowElements(9,7);

const allRowElements = [row1Elements, row2Elements, row3Elements, row4Elements, row5Elements, row6Elements, row7Elements, row8Elements, row9Elements];

//global variable for user's score and function to update it
let userScore = 0;
function updateScore() {
    document.getElementById('userScore').innerHTML = userScore;
};

//shift all tiles of a row down by one, inputting the row height that was removed - all tiles above it will be shifted down
function shiftTilesDown(inputTargetRow){
    console.log(inputTargetRow);
    let targetTiles = filledTiles.filter((x) => (Number(x[1]) > inputTargetRow));
    console.log(`target tiles to shift down are ${targetTiles}`);
    let newTilePositions = [];
    targetTiles.forEach((x) => {
        newTilePositions.push(x[0].toString() + (Number(x[1]) - 1).toString());
    });
    console.log(`target tiles new positions are ${newTilePositions}`);
    targetTiles.forEach((x) => {
        document.getElementById(x).style.backgroundColor = 'white';
    });
    newTilePositions.forEach((x) => {
        document.getElementById(x).style.backgroundColor = '#A9A9A9';
    });
}

//function to check if a row is filled, clear the row from filled tiles and reset background color to white and increment user score
function score() {
    let scoringTiles = [];
    let scoringTileRows = [];
    let numberOfScoringRows = 0;
    allRowElements.forEach((rowElements) => {
        //if all the tiles in the row are filled (in the filledTiles array) push the array into the scoringTiles array
        if (rowElements.every((tile) => {
                return filledTiles.includes(tile);
            })) {
                scoringTiles.push(rowElements);
                scoringTileRows.push(rowElements[0][1]);
                numberOfScoringRows++;
            }
    })
    //reset scoring tile color, remove from filledTiles array, shift all tiles above down
    scoringTiles.forEach((row) => {
        row.forEach((tile) => {
            document.getElementById(tile).style.backgroundColor = 'white';
            let tileIndex = filledTiles.findIndex((x) => {x === tile});
            filledTiles.splice(tileIndex,1);
        })
        shiftTilesDown(row[0][1]);
    })
    switch(numberOfScoringRows){
        case 1:
            userScore += 40;
        break;
        case 2:
            userScore += 100;
        break;
        case 3:
            userScore += 300;
        break;
        case 4:
            userScore += 1200;
        break;
        default:
        break;
    }
    updateScore();
}

document.body.addEventListener('keypress', (event) => {moveTile(event.key)});
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('replayButton').addEventListener('click', startGame);


//DEBUGGING
function debug1() {
    ['11','21','31','41','51','61','42','43','32','33','12','13','14'].forEach((x) => fillTile(x));
}