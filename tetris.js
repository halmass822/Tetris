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

    //checking if any of the coordinate arrays are out of bounds or filled
        function checkCoordinates(inputArray) {
            console.log(inputArray);
            return !(inputArray.some((coordinate) => {
                    let XCoordinate = coordinate.slice(0,2);
                    let YCoordinate = coordinate.slice(2,4);
                    console.log(filledTiles.includes(coordinate));
                    console.log(XCoordinate < 1);
                    console.log(XCoordinate > gridWidth);
                    console.log(YCoordinate < 1);
                    console.log(YCoordinate > gridHeight);
                    return(filledTiles.includes(coordinate) || XCoordinate < 1 || XCoordinate > gridWidth || YCoordinate < 1 || YCoordinate > gridHeight)
                })
            )
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
    let tetraminoPosition = [];
    function moveTilePropose(currentPosition,movementInput) {
        let output = [];
        if(movementAllowed) {

            if(movementInput === 'w'){
                rotateShape()
            } else {

                if(/[asd]/.test(movementInput)){
                    currentPosition.forEach((tile) => {
                        let currentXCoord = Number(tile.slice(0,2));
                        let currentYCoord = Number(tile.slice(2,4));
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
                        proposedPosition = digitize(proposedXCoord) + digitize(proposedYCoord);
                        if(proposedXCoord < 1 || proposedXCoord > gridWidth || proposedYCoord < 1 || filledTiles.includes(proposedPosition)) {
                            output.push(null);
                        } else {
                            output.push(proposedPosition);
                        }
                    })
                    if(output.some((tile) => {
                        return tile === null;
                    })){
                        return null;
                    } else {
                        return output;
                    }
                } else {
                    console.log(`input "${movementInput}" ignored`);
                }
            }
        } else {
            console.log(`movement disallowed, input ignored`);
        }
    }

//function to move the tetra down, filling the position if the movement fails (if moveTilePropose('s') returns null)
//ends the game if the tile stops at position '0520'
    function dropTile() {
        let newPosition = moveTilePropose(tetraminoPosition,'s');
        if(newPosition){
            tetraminoPosition.forEach((tile) => {
                changeToWhite(tile);
            })
            newPosition.forEach((tile) => {
                changeToGrey(tile);
                tetraminoPosition = newPosition;
            })
        } else {
            tetraminoPosition.forEach((x) => fillTile(x));
            currentShape = randomShape();
            currentRotation = 0;
            tetraminoPosition = drawShape('0619',currentShape[0]);
            tetraminoPosition.forEach(x => changeToGrey(x));
        }
        //runs the score function, which checks if any rows are filled, eliminates the filled row tiles and shift the tiles above down
        score();
        if(tetraminoPosition.some((x) => {
            return filledTiles.includes(x);
        })){
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
        currentShape = randomShape();
        currentRotation = 0;
        tetraminoPosition = drawShape('0619',currentShape[0]);
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

//drawing the tetramino shapes and each rotation. coordinates are relative with the origin being 0,0 stored as 3D arrays including every rotation
    //box - all rotations are identical
    const  box = [
        [ [-1,0],[0,0],[0,-1],[-1,-1] ],
        [ [-1,0],[0,0],[0,-1],[-1,-1] ],
        [ [-1,0],[0,0],[0,-1],[-1,-1] ],
        [ [-1,0],[0,0],[0,-1],[-1,-1] ]
    ]
    //column - every other rotation is identical
    const column = [
        [ [-1,0],[0,0],[1,0],[2,0] ],
        [ [0,1],[0,0],[0,-1],[0,-2] ],
        [ [-1,0],[0,0],[1,0],[2,0] ],
        [ [0,1],[0,0],[0,-1],[0,-2] ],
    ]
    //bolts - 2 forms, every other rotation is identical
    const bolt1 = [
        [ [-1,0],[0,0],[0,-1],[1,-1] ],
        [ [0,1],[0,0],[-1,0],[-1,-1] ],
        [ [-1,0],[0,0],[0,-1],[1,-1] ],
        [ [0,1],[0,0],[-1,0],[-1,-1] ],
    ]

    const bolt2 = [
        [ [-1,0],[0,0],[0,1],[1,1] ],
        [ [0,1],[0,0],[1,0],[1,-1] ],
        [ [-1,0],[0,0],[0,1],[1,1] ],
        [ [0,1],[0,0],[1,0],[1,-1] ],
    ]

    //bed - 2 forms, 4 separate rotations
    const bed1 = [
        [ [-1,1],[-1,0],[0,0],[1,0] ],
        [ [0,-2],[0,-1],[0,0],[1,0] ],
        [ [-2,0],[-1,0],[0,0],[0,-1] ],
        [ [-1,0],[0,0],[0,1],[0,2] ]
    ]

    const bed2 = [
        [ [-1,0],[0,0],[1,0],[1,1] ],
        [ [0,1],[0,0],[0,-1],[1,-1] ],
        [ [-1,-1],[-1,0],[0,0],[1,0] ],
        [ [-1,1],[0,1],[0,0],[0,-1] ]

    ]

    //cross - 4 separate rotations

    const cross = [
        [ [-1,0],[0,0],[0,1],[1,0] ],
        [ [0,1],[0,0],[1,0],[0,-1] ],
        [ [-1,0],[0,0],[0,-1],[1,0] ],
        [ [0,1],[0,0],[-1,0],[0,-1] ]
    ]

    const shapes =[box,column,bed1,bed2,bolt1,bolt2,cross];

    //returns first rotation of a random shape
    function randomShape() {
        return shapes[Math.floor(Math.random() * (shapes.length - 0.001))];
    }

    //draws the shape based on a given origin point - returns an array or coordinates if all tiles are valid, otherwise returns null
    function drawShape(origin, shape) {
        let shapeCoordinates = [];
        originXCoord = Number(origin.slice(0,2));
        originYCoord = Number(origin.slice(2,4));
        shape.forEach((x) => {
            let tileCoord = digitize(originXCoord + x[0]) + digitize(originYCoord + x[1]);
            shapeCoordinates.push(tileCoord);
        })
        console.log(`drawing ${shape}\ntile coordinates are ${shapeCoordinates}`);
        return shapeCoordinates;
    }

    var currentShape;
    var currentRotation;

    function rotateShape() {
        //returns the next form of the current shape, meaning the next index of the current shape
        let newRotation = ((currentRotation + 1)%4)
        let shapeToDraw = currentShape[newRotation];
        let newShapeCoordinates = drawShape(tetraminoPosition[1], shapeToDraw);
        if(checkCoordinates(newShapeCoordinates)){
            tetraminoPosition.forEach((x) => changeToWhite(x));
            tetraminoPosition = newShapeCoordinates;
            currentRotation = newRotation;
            tetraminoPosition.forEach((x) => changeToGrey(x));
        } else {
            console.log(`rotation invalid, ignoring input`);
        }
    }

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

//event listeners
document.body.addEventListener('keypress', (event) => {
    let proposedPosition = moveTilePropose(tetraminoPosition,event.key);
    if(proposedPosition) {
        tetraminoPosition.forEach((x) => changeToWhite(x));
        tetraminoPosition = proposedPosition;
        tetraminoPosition.forEach((x) => changeToGrey(x));
    }
});
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('replayButton').addEventListener('click', startGame);


//DEBUGGING FUNCTIONS

    //Fills bottom row to quickly test scoring
    function debug1() {
        ["0101","0201","0301","0401","0501","0601","0701","0801","0901","1001"].forEach((x) => fillTile(x));
    }

    //Empties all grid tiles
    function debug2() {
        generatedTiles.forEach((x) => emptyTile(x));
        console.log(`resultant filledTiles are ${filledTiles}`);
    }

    //Prints most global variables
    function debug3() {
        console.log(`filledTiles are ${filledTiles}`);
        console.log(`tetraminoPosition is ${tetraminoPosition}`);
        console.log(`generatedTiles are ${generatedTiles}`);
        console.log(`score is ${userScore}`);
    }

    //fills positions in a randomized order excluding the center top tiles
    function debug4(numOfTilesRequested) {
        randomizedTileArray = [];
        for( i = 0; i < numOfTilesRequested ; i++){
            let generatedTile = digitize(Math.floor(Math.random() * 9.999 + 1)) + digitize(Math.floor(Math.random() * 19.999 + 1));
            randomizedTileArray.push(generatedTile);
        }
        console.log(`generated tiles in debug4 are ${generatedTiles}`);
        randomizedTileArray.forEach(x => fillTile(x));
        ['0520','0519','0518','0517','0620','0619','0618','0617'].forEach((x) => emptyTile(x));
        tetraminoPosition.forEach((x) => changeToGrey(x));
    }



document.getElementById('debug1').addEventListener('click',debug1);
document.getElementById('debug2').addEventListener('click',debug2);
document.getElementById('debug3').addEventListener('click',debug3);
document.getElementById('debug4').addEventListener('click',() => debug4(10));