#Project initially started as putting the javascript DOM into practice by seeing if I can generate elements, then got more complex from there. 

#It was not initially intended to be tetris, so I'm starting over and applying some tips I've received on algorithms and how to properly develop a project

##goal is as follows:

create a grid by generating elements with each grid tile having it's respective coordinate as the ID, with bottom left being '11'. Adding all generated positions to an array representing all generated tiles

grid size will be a constant 7 x 9

Having a landing page with a button to start playing

this will not use tetraminos, just a single tile to start

defining tile position as changing the respective tile coordinate's background color to gray

tile position represented by global string variable

having a helper function that will return the tetramino's current position as an object with properties x and y

having a function to update the grid based on the tile's current location

having a keypress event listener that will allow the user to move the tile left, right and bottom while rejecting any inputs that move the tile into a full tile

full tiles represented by an array

having a function that will represent the tile falling using the function already used by the keypress event listener. If this function cannot place the tile in a free tile slot, it adds the current position to the filled tiles array and moves the position to '47'. If this function determines the tile fills position '47', the game ends

a game over function that stops the user's ability to interact and stops the tile from falling and displays the game over overlay with a button to restart

having a function that will clear all current tiles and filled tile array and reset position to '47' and make the tile start falling

##features to implement later:

adding scoring
Trying out different ways of storing the global variable for tile position
changing tile into a tetramino of a consistent shape
    adding ability to rotate tetramino
    adding the 7 classic tetramino shapes