import * as PIXI from "pixi.js"

const gridSize =130; // Size of each grid cell
const numCols = 8;   // Number of columns
const numRows = 8;   // Number of rows

async function main() {
	// Create a Pixi Application


	const app = new PIXI.Application();
	await app.init({ 
		
		
		// transparent: false,   
		width: window.innerWidth,  // Set width to the window's inner width
        height: window.innerHeight
	
	});
	document.body.appendChild(app.canvas);


	const backgroundTexture = await PIXI.Assets.load("assets/bg.png");
    const backgroundSprite = new PIXI.Sprite(backgroundTexture);

    // Scale the background to fit the whole screen
    backgroundSprite.width = app.screen.width;
    backgroundSprite.height = app.screen.height;

    // Add the background sprite to the stage
    app.stage.addChild(backgroundSprite);


	await PIXI.Assets.load("assets/grid.png");
    const cellTexture = PIXI.Assets.get("assets/grid.png");



  // Calculate the starting position to center the grid
  const startX = (app.screen.width - (numCols * gridSize)) / 2;
  const startY = (app.screen.height - (numRows * gridSize)) / 2;

    // Create the grid
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const cellSprite = new PIXI.Sprite(cellTexture);
            // Position each cell
            cellSprite.x = startX + col * gridSize;
            cellSprite.y = startY + row * gridSize;

            // Resize the cell to fit the grid size
            cellSprite.width = gridSize;
            cellSprite.height = gridSize;

            app.stage.addChild(cellSprite); // Add the cell to the stage
        }
    }



document.body.style.overflow = 'hidden';
}

main()

