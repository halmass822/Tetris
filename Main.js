function generateElement(elementType, elementId = null, elementContent = '', elementStyle = {},){
    let outputElement = document.createElement(elementType);
    outputElement.id = elementId;
    outputElement.innerHTML = elementContent;
    Object.assign(outputElement.style, elementStyle);
    return outputElement;
}

function appendToBody(inputElement){
    document.body.appendChild(inputElement);
}

const tileStyle = { width: '50px', height: '50px', display: 'inline-block', border: '2px solid black', margin: '5px'}

function generateGrid(gridWidth, gridHeight){
    let outputGrid = document.createElement('div');
    for (let i = 0; i < gridHeight; i++) {
        let row = document.createElement('div');
        for (let j = 0; j < gridWidth; j++) {
            let genElementId = (
                (j + 1).toString() + (gridHeight-i).toString()
            )
            let genTile = (generateElement('p',genElementId,'',tileStyle));
            row.appendChild(genTile);
        }
        outputGrid.appendChild(row);
    }
    return outputGrid;
}

appendToBody(generateGrid(7,7));

tetraminoPosition = '47';
document.getElementById(tetraminoPosition).style.backgroundColor = '#A9A9A9';

let filledTiles = [];

appendToBody(generateElement('p','tetraminoPos',tetraminoPosition,{ fontWeight: 'bold', textAlign: 'center' },));

let movementAllowed = true;

function moveTetra(movementInput){
    movementInput = movementInput.toLowerCase();
    document.getElementById(tetraminoPosition).style.backgroundColor = '';
    let xCoordinate = Number(tetraminoPosition.slice(0,1));
    console.log(`initial xCoordinate is ${xCoordinate}`);
    let yCoordinate = Number(tetraminoPosition.slice(-1));
    console.log(`initial yCoordinate is ${yCoordinate}`);
    let newYCoord;
    let newXCoord;
    let proposedPosition;
    switch(movementInput){
        case 's':
            newYCoord = yCoordinate - 1;
            proposedPosition = xCoordinate.toString() + newYCoord.toString();
            console.log(`proposed position is ${proposedPosition}`);
            if(filledTiles.includes(proposedPosition)  || newYCoord <= 0){
                console.log(`proposed position is filled, ignoring input`)
            } else {
                yCoordinate = newYCoord;
            }         
        break;
        case 'd':
            newXCoord = xCoordinate + 1;
            proposedPosition = newXCoord.toString() + yCoordinate.toString();
            console.log(`proposed position is ${proposedPosition}`);
            if(filledTiles.includes(proposedPosition) || newXCoord >= 8){
                console.log(`proposed position is filled, ignoring input`)
            } else {
                xCoordinate = newXCoord;
            } 
        break;
        case 'a':
            newXCoord = xCoordinate - 1;
            proposedPosition = newXCoord.toString() + yCoordinate.toString();
            console.log(`proposed position is ${proposedPosition}`);
            if(filledTiles.includes(proposedPosition) || newXCoord <= 0){
                console.log(`proposed position is filled, ignoring input`)
            } else {
                xCoordinate = newXCoord;
            } 
        break;
        default:
            console.log(`input ${movementInput} ignored`);
        break;
    }
    let newPosition = xCoordinate.toString() + yCoordinate.toString();
    console.log(`new x and y coords are ${xCoordinate} and ${yCoordinate} newPosition is ${newPosition}`)
    document.getElementById(newPosition).style.backgroundColor = '#A9A9A9';
    tetraminoPosition = newPosition;
    document.getElementById('tetraminoPos').innerHTML = tetraminoPosition;
}

var fallingTetra = null;

function dropTetra() {
    let oldPosition = tetraminoPosition;
    let newPosition = oldPosition[0] + (Number(oldPosition[1])-1).toString();
    console.log(`old and new positions are ${oldPosition} and ${newPosition}`);
    if (tetraminoPosition[1] === '1' || filledTiles.includes(newPosition)) {
        filledTiles.push(oldPosition);
        tetraminoPosition = '47';
        document.getElementById(tetraminoPosition).style.backgroundColor = '#A9A9A9';
    } else {
        moveTetra('s');
    }
    document.getElementById('tetraminoPos').innerHTML = tetraminoPosition;
}

function fallingState(inputBool) {
    if(inputBool) {
        fallingTetra = setInterval(dropTetra, 500);
    } else {
        clearInterval(fallingTetra);
    }
}

fallingState(true);

document.body.addEventListener('keypress', (event) => {
    moveTetra(event.key);
})