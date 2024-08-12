import { Game } from "./game";
const game = new Game()
game.startGame()



// not done features
// 	// Create level background and text
// 	const levelBackgroundSprite = new PIXI.Sprite(levelBackgroundTexture);
// 	levelBackgroundSprite.x = 300;
// 	levelBackgroundSprite.y = startY + (numRows * gridSize) / 2 - 100 - levelBackgroundSprite.height / 2; // Centered vertically
// 	app.stage.addChild(levelBackgroundSprite);
//
// 	const levelText = new PIXI.Text('Level: 1', {
// 		fontSize: 40,
// 		fill: '#ffffff',
// 		align: 'center',
// 		fontWeight: 'bold',
// 	});
// 	levelText.x = levelBackgroundSprite.x + 70; // Adjust position inside background
// 	levelText.y = levelBackgroundSprite.y + (levelBackgroundSprite.height - levelText.height) / 2;
// 	app.stage.addChild(levelText);
//
// 	// Create timer background and text
// 	const timerBackgroundSprite = new PIXI.Sprite(timerBackgroundTexture);
// 	timerBackgroundSprite.x = app.screen.width - timerBackgroundSprite.width - 300;
// 	timerBackgroundSprite.y = startY + (numRows * gridSize) / 2 - 200 - timerBackgroundSprite.height / 2; // Centered vertically
// 	app.stage.addChild(timerBackgroundSprite);
//
// 	const timerText = new PIXI.Text('Timer: 60', {
// 		fontSize: 40,
// 		fill: '#ffffff',
// 		align: 'center',
// 		fontWeight: 'bold'
// 	});
// 	timerText.x = timerBackgroundSprite.x + 70; // Adjust position inside background
// 	timerText.y = timerBackgroundSprite.y + (timerBackgroundSprite.height - timerText.height) / 2;
// 	app.stage.addChild(timerText);
//
//
//
//
// 	// create score background and text
//
// 	const scoreBackgroundSprite = new PIXI.Sprite(scoreBackgroundTexture);
// 	scoreBackgroundSprite.x = 300;
// 	scoreBackgroundSprite.y = startY + (numRows * gridSize) / 2 - 200 - scoreBackgroundSprite.height / 2; // Centered vertically
// 	app.stage.addChild(scoreBackgroundSprite);
//
//
//
//
// 	const scoreText = new PIXI.Text('Score: 0', {
// 		fontSize: 40,
// 		fill: '#ffffff',
// 		align: 'center',
// 		fontWeight: 'bold'
// 	});
// 	scoreText.x = scoreBackgroundSprite.x + 70; // Adjust position inside background
// 	scoreText.y = scoreBackgroundSprite.y + (scoreBackgroundSprite.height - scoreText.height) / 2;
// 	app.stage.addChild(scoreText);
//
// 	function updateScore(points: number) { // this function will be called when a match is found
// 		score += points;
// 		scoreText.text = `Score: ${score}`;
// 		if (score >= level * 100) { // Increase level every 100 points
// 			level++;
// 			levelText.text = `Level: ${level}`;
// 		}
// 	}
//
//
//
// 	// i am gonna try to find a better way for the timer implementation
//
// 	let timerInterval: number;
// 	//
// 	function startTimer(duration: number) {
// 		let remainingTime = duration;
//
// 		timerInterval = setInterval(() => {
// 			if (remainingTime > 0) {
// 				timerText.text = `Timer: ${remainingTime}`;
// 				remainingTime--;
// 			} else {
// 				timerText.text = "Time's up!";
// 				clearInterval(timerInterval);
// 			}
// 		}, 1000);
// 	}
// 	//
// 	startTimer(60); // Start a 60-second timer
//
// }
