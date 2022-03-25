//Generate a 7x9 grid, each element having its respective coordinate as its id
//Nested for loop, outer layer creates the row, inner loop fills the row with the tiles
//All generated tiles get added to a generated tiles array
//Grid will then be appended to an existing div

const gridTileStyle = { width: '50px', height: '50px', display: 'inline-block', border: '1px solid gray', margin: '0'};
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
            let generateId = [j + 1].toString() + [height - i].toString();
            tileElement.id = generateId;

            Object.assign(tileElement.style, gridTileStyle);
            generatedTiles.push(tileElement);
            row.appendChild(tileElement);
        }
        output.appendChild(row);
    }
    console.log(`Generated ${width} by ${height} grid`);
    return output;
}

document.getElementById('playingGrid').appendChild(generateGrid(7,9));