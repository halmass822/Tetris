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
            tileElement.className = 'gridTile'; 
            //grid is created top-down so the id is calculated such that bottom left grid tile is 11, stored as a string
            let generatedId = [j + 1].toString() + [height - i].toString();
            tileElement.id = generatedId;
            //created element is added to the generated tiles array then appended to the row
            generatedTiles.push(tileElement);
            row.appendChild(tileElement);
        }
        output.appendChild(row);
    }
    console.log(`Generated ${width} by ${height} grid`);
    return output;
}

//tile position represented by respective tile having a grey background color of #A9A9A9
//function returns current tile position to white and updates current position and logs the change
function updateTetraminoPosition(newPosition) {
    document.getElementById(tetraminoPosition).style.backgroundColor = 'white';
    document.getElementById(newPosition).style.backgroundColor = '#A9A9A9';
    console.log(`Tetramino position moved from ${tetraminoPosition} to ${newPosition}`);
    tetraminoPosition = newPosition;
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
            console.log(`proposed coords are ${proposedXCoord} and ${proposedYCoord}. proposed position is ${proposedPosition}`);
            //checking if proposed position is out of bounds OR filled
            if(proposedXCoord < 1 || proposedXCoord > 7 || proposedYCoord < 1 || filledTiles.includes(proposedPosition)) {
                console.log(`proposed position ${proposedPosition} is out of bounds or filled`);
                console.log(`${(proposedXCoord < 1)} ${proposedXCoord > 7} ${proposedYCoord < 1} ${filledTiles.includes(proposedPosition)}`);
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
    filledTiles.forEach((x) => {document.getElementById(x).style.backgroundColor = 'white'});
    filledTiles = [];
    updateTetraminoPosition('49');
    console.log(`startGame() triggered`)
    document.getElementById(`gameOverScreen`).style.display = "none";
    document.getElementById(`gameTitleScreen`).style.display = "none";
    fallingState(true);
    movementAllowed = true;
}

document.getElementById('playingGrid').appendChild(generateGrid(7,9));

document.body.addEventListener('keypress', (event) => {moveTile(event.key)});
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('replayButton').addEventListener('click', startGame);