//Generate a grid, each element having its respective coordinate as its id
//Nested for loop, outer layer creates the row, inner loop fills the row with the tiles
//All generated tiles get added to a generated tiles array
//Grid will then be appended to an existing div
    let generatedTiles = [];
    let gridWidth = 10;
    let gridHeight = 20;

    function generateGrid(width, height){
        let output = document.createElement('div');
        output.style.border = '2px solid black';
        output.style.margin = '25px auto';
        output.style.display = 'inline-block';
        for( i = 0; i < height; i++ ){
            let row = document.createElement('div');
            row.style.height = '32px';
            for( j = 0; j < width; j++){
                let tileElement = document.createElement('p');
                //grid is created top-down so the id is calculated such that bottom left grid tile is 11, stored as a string
                let generatedId = digitize([j + 1]) + digitize([height - i]);
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

//HELPER FUNCTIONS

    //helper function to change any single digit input into a 2 digit input i.e digitize(5) = "05" - to be used to make 
        function digitize(input) {
            input = input.toString();
            if(input.length === 1) {
                return `0${input}`;
            } else {
                return input;
            }
        }

    //helper functions for recoloring and filling the represented tile
        function fillTile(targetId) {
            targetElement = document.getElementById(targetId);
            if(!filledTiles.includes(targetId)){
                filledTiles.push(targetId);
            }
            targetElement.style.backgroundColor = '#A9A9A9';
        }

        function emptyTile(targetId) {
            targetElement = document.getElementById(targetId);
            targetElement.style.backgroundColor = 'white';
            let targetIndex = filledTiles.findIndex((x) => x === targetId);
            if(targetIndex >= 0){
                filledTiles.splice(targetIndex,1);
            }
        }

        function changeToGrey(target) {
            target = document.getElementById(target)
            target.style.backgroundColor = "#A9A9A9";
        }

        function changeToWhite(target) {
            target = document.getElementById(target)
            target.style.backgroundColor = "white";
        }


//creating the grid and appending to the target div
    document.getElementById('playingGrid').appendChild(generateGrid(gridWidth,gridHeight));

//global variable movementAllowed disables / enables movement of the tile
//function move tile checks if the proposed position is filled by another tile or out of bounds, only accepts a s d as inputs
//returns the proposed coordinate if the movement is possible, returns null otherwise - next function executes the move
    let movementAllowed = false;
    let filledTiles = [];
    let tetraminoPosition = '0520';
    function moveTilePropose(currentPosition,movementInput) {
        if(movementAllowed) {

            if(/[asd]/.test(movementInput)){
                
                let currentXCoord = Number(currentPosition.slice(0,2));
                let currentYCoord = Number(currentPosition.slice(2,4));
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
                        console.log(`error - check moveTilePropose() regex`);
                }
                //console.log(`currentPosition is ${currentXCoord} ${currentYCoord}`);
                proposedPosition = digitize(proposedXCoord) + digitize(proposedYCoord);
                //console.log(`proposed position is ${proposedPosition}`)
                //checking if proposed position is out of bounds OR filled
                if(proposedXCoord < 1 || proposedXCoord > gridWidth || proposedYCoord < 1 || filledTiles.includes(proposedPosition)) {
                    console.log(`proposed position ${proposedPosition} is out of bounds or filled`);
                    return null;
                } else {
                    return proposedPosition;
                }

            } else {
                console.log(`input "${movementInput}" ignored`);
            }

        } else {
            console.log(`movement disallowed, input ignored`);
        }
    }

//function to move the tetra down, filling the position if the movement fails (if moveTilePropose('s') returns null)
//ends the game if the tile stops at position '0520'
    function dropTile() {
        tetraminoPosition.forEach((x) => {
            proposedPosition = moveTilePropose(x,'s');
        })//***********switching dropTile to accept an array
        if(newPosition){
            changeToWhite(tetraminoPosition);
            changeToGrey(newPosition);
            tetraminoPosition = newPosition;
        } else {
            console.log(`movement blocked, position ${tetraminoPosition} is now filled`);
            fillTile(tetraminoPosition);
            tetraminoPosition = '0520';
            changeToGrey(tetraminoPosition);
        }
        //runs the score function, which checks if any rows are filled, eliminates the filled row tiles and shift the tiles above down
        score();
        if(filledTiles.includes('0520')){
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
        generatedTiles.forEach((x) => emptyTile(x));
        tetraminoPosition = ['0520','0620','0519','0619'];
        tetraminoPosition.forEach(x => changeToGrey(x));
        userScore = 0;
        updateScore();
        console.log(`startGame() triggered`)
        document.getElementById(`gameOverScreen`).style.display = "none";
        document.getElementById(`gameTitleScreen`).style.display = "none";
        fallingState(true);
        movementAllowed = true;
    }


//a 3D array of all the grid tile coordinates
    function getGridTiles(gridHeight, gridWidth) {
        let outputArray = []
        for( i = 0 ; i < gridHeight ; i ++){
            let outputRow = []
            for( j = 0 ; j < gridWidth ; j ++){
                let outputTile = digitize(j + 1) + digitize(gridHeight - i);
                outputRow.push(outputTile); 
            }
            outputArray.unshift(outputRow);
        }
        return outputArray;
    }

    allRowElements = getGridTiles(gridHeight, gridWidth);

//global variable for user's score and function to update it
    let userScore = 0;
    function updateScore() {
        document.getElementById('userScore').innerHTML = userScore;
    };

//shift all tiles of a row down by one, inputting the row height that was removed - all tiles above it will be shifted down
    function shiftTilesDown(inputTargetRow){
        if(inputTargetRow.length > 0) {
            console.log(`target row to shift down is ${inputTargetRow}`);
            let targetTiles = filledTiles.filter((x) => (Number(x.slice(2,4)) > inputTargetRow));
            console.log(`target tiles to shift down are ${targetTiles}`);
            let newTilePositions = [];
            targetTiles.forEach((x) => {
                newTilePositions.push(digitize(x.slice(0,2)) + digitize(Number(x.slice(2,4) - 1)));
            });
            console.log(`newTilePositions are ${newTilePositions}`);
            console.log(`target tiles new positions are ${newTilePositions}`);
            targetTiles.forEach((x) => {
                console.log(`Tile ${x} emptied`)
                emptyTile(x);
            });
            console.log(`newTilePositions are ${newTilePositions}`);
            newTilePositions.forEach((x) => {
                console.log(`Tile ${x} filled`)
                fillTile(x);
            });
        }
    }

//function to check if a row is filled, clear the row from filled tiles and reset background color to white and increment user score
    function score() {
        let scoringTiles = [];
        let scoringTileRows = [];
        let numberOfScoringRows = 0;
        //check if any rows are scoring, increment numberofscoringrows, push the scoring tiles, push the scoring rows
        allRowElements.forEach((rowElements) => {
            if(rowElements.every((x) => filledTiles.includes(x))){
                numberOfScoringRows++;
                scoringTiles = scoringTiles.concat(rowElements);
                let scoringRow = rowElements[0][1];
                scoringTileRows.push(scoringRow);
                console.log(`detected scoring row elements are${rowElements}\ndetected scoring row is ${scoringRow}`);
            }
        scoringTiles.forEach((x) => emptyTile(x));
        //sorting the scoring rows by descending so the highest row runs shiftTilesDown() first
        scoringTileRows.sort((a,b) => b - a);
        })
        scoringTileRows.forEach((x) => shiftTilesDown(x));
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

document.body.addEventListener('keypress', (event) => {
    let proposedPosition = moveTilePropose(event.key);
    if(proposedPosition) {
        changeToWhite(tetraminoPosition);
        tetraminoPosition = proposedPosition;
        changeToGrey(tetraminoPosition);
    }
});
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('replayButton').addEventListener('click', startGame);


//DEBUGGING FUNCTIONS

    //Fills bottom row to quickly test scoring
    function debug1() {
        ["0101","0201","0301","0401","0501","0601","0701","0801","0901","1001"].forEach((x) => fillTile(x));
    }

    //Empties a set of tiles to test emptyTile
    function debug2() {
        ['0101','0202','0302','0701','0101','0110','1010'].forEach((x) => emptyTile(x));
        console.log(`resultant filledTiles are ${filledTiles}`);
    }

    //Prints most global variables
    function debug3() {
        console.log(`filledTiles are ${filledTiles}`);
        console.log(`tetraminoPosition is ${tetraminoPosition}`);
        console.log(`generatedTiles are ${generatedTiles}`);
        console.log(`score is ${userScore}`);
    }

    //fills positions in a randomized order
    function debug4(numOfTilesRequested) {
        randomizedTileArray = [];
        for( i = 0; i < numOfTilesRequested ; i++){
            let generatedTile = digitize(Math.floor(Math.random() * 9.999 + 1)) + digitize(Math.floor(Math.random() * 19.999 + 1));
            randomizedTileArray.push(generatedTile);
        }
        console.log(`generated tiles in debug4 are ${generatedTiles}`);
        randomizedTileArray.forEach(x => fillTile(x));
    }



document.getElementById('debug1').addEventListener('click',debug1);
document.getElementById('debug2').addEventListener('click',debug2);
document.getElementById('debug3').addEventListener('click',debug3);
document.getElementById('debug4').addEventListener('click',() => debug4(10));