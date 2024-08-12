import * as PIXI from "pixi.js"

const gridSize =150; // Size of each grid cell
const numCols = 8;   // Number of columns
const numRows = 8;   // Number of rows


const itemTextures = [
    'assets/blue.png', 
    'assets/green.png',
    'assets/orange.png',
    'assets/red.png',
	'assets/pink.png',
	'assets/yellow.png',
];

async function main() {
	// Create a Pixi Application


	const app = new PIXI.Application();
	await app.init({ 
		
		
		// transparent: false,   
		width: window.innerWidth,  // Set width to the window's inner width
        height: window.innerHeight
	
	});
	document.body.appendChild(app.canvas);


	const backgroundTexture = await PIXI.Assets.load("assets/bg5.jpg"); //i am going to find a better color for bg texture
    const backgroundSprite = new PIXI.Sprite(backgroundTexture);

    // Scale the background to fit the whole screen
    backgroundSprite.width = app.screen.width;
    backgroundSprite.height = app.screen.height;

    // Add the background sprite to the stage
    app.stage.addChild(backgroundSprite);


	await PIXI.Assets.load("assets/grid1.png");
    const cellTexture = PIXI.Assets.get("assets/grid1.png");


	const loadedItemTextures = await Promise.all(itemTextures.map(texture => PIXI.Assets.load(texture)));
  // Load the textures for level and timer backgrounds
  const levelBackgroundTexture = await PIXI.Assets.load("assets/level1.png");
  const timerBackgroundTexture = await PIXI.Assets.load("assets/level1.png");
  const scoreBackgroundTexture = await PIXI.Assets.load("assets/level1.png");

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


			  // Create a random item sprite for each cell
			  const itemSprite = new PIXI.Sprite(loadedItemTextures[Math.floor(Math.random() * loadedItemTextures.length)]);
			  itemSprite.x = cellSprite.x + (gridSize - itemSprite.width) / 2; // Center the item in the cell
			  itemSprite.y = -itemSprite.height; // Start above the screen
			  itemSprite.width = gridSize * 0.5; 
			  itemSprite.height = gridSize * 0.5; 
  
			  app.stage.addChild(itemSprite); // Add item sprite to the stage
			  animateItemDrop(itemSprite, cellSprite.y + (gridSize - itemSprite.height) / 2);
        }
    }
    // Function to animate the item dropping
    function animateItemDrop(itemSprite: PIXI.Sprite, targetY: number) {
        const dropSpeed = 3; 
        const animation = () => {
            if (itemSprite.y < targetY) {
                itemSprite.y += dropSpeed; 
                requestAnimationFrame(animation); 
            } else {
                itemSprite.y = targetY; 
            }
        };
        animation(); // Start the animation
    }

// Create level background and text
const levelBackgroundSprite = new PIXI.Sprite(levelBackgroundTexture);
levelBackgroundSprite.x = 300; 
levelBackgroundSprite.y = startY + (numRows * gridSize) / 2- 100 - levelBackgroundSprite.height / 2; // Centered vertically
app.stage.addChild(levelBackgroundSprite);

const levelText = new PIXI.Text('Level: 1', {
	fontSize: 40,
	fill: '#ffffff',
	align: 'center',
	fontWeight: 'bold',
});
levelText.x = levelBackgroundSprite.x + 70; // Adjust position inside background
levelText.y = levelBackgroundSprite.y + (levelBackgroundSprite.height - levelText.height) / 2;
app.stage.addChild(levelText);

// Create timer background and text
const timerBackgroundSprite = new PIXI.Sprite(timerBackgroundTexture);
timerBackgroundSprite.x = app.screen.width - timerBackgroundSprite.width -300; 
timerBackgroundSprite.y = startY + (numRows * gridSize) / 2 - 200 - timerBackgroundSprite.height / 2 ; // Centered vertically
app.stage.addChild(timerBackgroundSprite);

const timerText = new PIXI.Text('Timer: 60', {
	fontSize: 40,
	fill: '#ffffff',
	align: 'center',
	fontWeight: 'bold'
});
timerText.x = timerBackgroundSprite.x +70; // Adjust position inside background
timerText.y = timerBackgroundSprite.y + (timerBackgroundSprite.height - timerText.height) / 2;
app.stage.addChild(timerText);




// create score background and text

const scoreBackgroundSprite = new PIXI.Sprite(scoreBackgroundTexture);
scoreBackgroundSprite.x =300;
scoreBackgroundSprite.y = startY + (numRows * gridSize) / 2 - 200 - scoreBackgroundSprite.height / 2 ; // Centered vertically
app.stage.addChild(scoreBackgroundSprite);

const scoreText = new PIXI.Text('Score: 0', {
	fontSize: 40,
	fill: '#ffffff',
	align: 'center',
	fontWeight: 'bold'
});
scoreText.x = scoreBackgroundSprite.x +70; // Adjust position inside background
scoreText.y = scoreBackgroundSprite.y + (scoreBackgroundSprite.height - scoreText.height) / 2;
app.stage.addChild(scoreText);




document.body.style.overflow = 'hidden';
}

main()

