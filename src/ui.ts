import { RENDERER, TEXT, TEXTURE } from "../types";
export class UI {
	renderer: RENDERER;
	boardTexture: TEXTURE;
	gameOverBackgroundTexture: TEXTURE;
	restartTexture: TEXTURE;
	move: number = 0;
	level: number = 1;
	score: number = 0;
	moveText: TEXT;
	levelText: TEXT;

	scoreText: TEXT;
	scoreBoard: any;
	constructor(renderer: RENDERER) {
		this.renderer = renderer;
	}
	async init() {
		this.boardTexture = await this.renderer.loadAsset(
			"../public/assets/level1.png"
		);
		this.gameOverBackgroundTexture = await this.renderer.loadAsset(
			"public/assets/level1.png"
		);
		this.restartTexture = await this.renderer.loadAsset(
			"public/assets/restart.png"
		);
	}
	createCounterBoard(gridPos: { x: number; y: number }, gridWidth: number) {
		const boardbg = this.renderer.createSprite(this.boardTexture);
		const margin = 50;
		const gridEnd = gridPos.x + gridWidth + margin;
		boardbg.position.set(gridEnd, gridPos.y + margin);
		boardbg.width = window.innerWidth - gridEnd - margin;
		boardbg.height = 100;
		const text = this.renderer.write(
			`Move : ${this.move}`,
			boardbg.position.x + boardbg.width / 2,
			boardbg.position.y + boardbg.height / 2
		);
		this.moveText = text;
		text.zIndex = 1;
		this.renderer.stage(boardbg, text);
	}
	createLevelBoard(gridPos: { x: number; y: number }) {
		const boardbg = this.renderer.createSprite(this.boardTexture);
		const margin = 50;
		boardbg.position.set(margin, gridPos.y + margin);
		boardbg.width = gridPos.x - 2 * margin;
		boardbg.height = 100;
		const text = this.renderer.write(
			`Level : ${this.level}`,
			boardbg.position.x + boardbg.width / 2 - 40,
			boardbg.position.y + boardbg.height / 2
		);
		this.levelText = text;
		text.zIndex = 1;

		// Score display background
		const scoreBoardbg = this.renderer.createSprite(this.boardTexture);
		scoreBoardbg.position.set(
			margin,
			boardbg.position.y + boardbg.height + margin
		);
		scoreBoardbg.width = boardbg.width;
		scoreBoardbg.height = 100;
		this.scoreBoard = scoreBoardbg;

		// Score display text
		const scoreText = this.renderer.write(
			`Score : ${this.score}`,
			scoreBoardbg.position.x + scoreBoardbg.width / 2 - 40,
			scoreBoardbg.position.y + scoreBoardbg.height / 2
		);
		this.scoreText = scoreText;
		scoreText.zIndex = 1;

		this.renderer.stage(boardbg, text, scoreBoardbg, scoreText);
	}

	createGameOverScreen() {
		const gameOverBackground = this.renderer.createGameOverBackground(
			this.gameOverBackgroundTexture,
			600, // Width
			100 // Height
		);

		const gameOverText = this.renderer.createGameOverText(
			"Game Over",
			this.renderer.app.screen.width / 2,
			this.renderer.app.screen.height / 2
		);

		const restartIcon = this.renderer.createRestartButton(
			this.restartTexture,
			100, // Width
			100, // Height
			{
				x: this.renderer.app.screen.width / 2,
				y: this.renderer.app.screen.height / 2 + 150,
			}
		);

		restartIcon.on("pointerdown", this.onRestartClick.bind(this));

		this.renderer.stage(gameOverBackground, gameOverText, restartIcon);
	}

	onRestartClick() {
		location.reload(); // for now it just refreshes the page
	}

	updateMove(move: number) {
		this.move = move;
		this.moveText.text = `Move : ${move}`;
	}
	updateLevel(level: number) {
		this.level = level;
		this.levelText.text = `Level : ${level}`;
	}
	updateScore(score: number) {
		this.score = score;
		this.scoreText.text = `Score :x ${score}`;
	}
	getMoveCount() {
		return this.move;
	}
}
