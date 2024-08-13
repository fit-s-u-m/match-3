import { RENDERER, TEXT, TEXTURE } from '../types';
export class UI {
	renderer: RENDERER;
	boardTexture: TEXTURE
	time: number = 0
	level: number = 1
	score: number = 0
	timerText: TEXT
	levelText: TEXT
	
	scoreText: TEXT
	scoreBoard: any
	constructor(renderer: RENDERER) {
		this.renderer = renderer;
	}
	async init() {
		this.boardTexture = await this.renderer.loadAsset("../public/assets/level1.png");
	}
	createCounterBoard(gridPos: { x: number, y: number }, gridWidth: number) {
		const boardbg = this.renderer.createSprite(this.boardTexture);
		const gridEnd = gridPos.x + gridWidth;
		boardbg.position.set(gridEnd, gridPos.y);
		const margin = 20
		boardbg.width = window.innerWidth - gridEnd - margin;
		boardbg.height = 200;
		const text = this.renderer.write(`Timer ${this.time}`, boardbg.position.x + boardbg.width / 2 - 40, boardbg.position.y + 100)
		this.timerText = text
		text.zIndex = 1
		this.renderer.stage(boardbg, text);
	}
	createLevelBoard(gridPos: { x: number, y: number }) {
		const boardbg = this.renderer.createSprite(this.boardTexture);
		const margin = 20
		boardbg.position.set(margin, gridPos.y);
		boardbg.width = gridPos.x - margin
		boardbg.height = 250;
		const text = this.renderer.write(`Level ${this.level}`, boardbg.position.x + boardbg.width / 2 - 40, boardbg.position.y + boardbg.height / 2)
		this.levelText = text
		text.zIndex = 1

		 // Score display background
		 const scoreBoardbg = this.renderer.createSprite(this.boardTexture);
		 scoreBoardbg.position.set(margin, boardbg.position.y + boardbg.height + 10);
		 scoreBoardbg.width = boardbg.width;
		 scoreBoardbg.height = 250; 
		 this.scoreBoard = scoreBoardbg;
 
		 // Score display text
		 const scoreText = this.renderer.write(`Score ${this.score}`, scoreBoardbg.position.x + scoreBoardbg.width / 2 - 40, scoreBoardbg.position.y + scoreBoardbg.height / 2);
		 this.scoreText = scoreText;
		 scoreText.zIndex = 1;
 
		this.renderer.stage(boardbg, text, scoreBoardbg, scoreText);
	}
	updateTimer(time: number) {
		this.time = time
		this.timerText.text = `Timer ${time}`
	}
	updateLevel(level: number) {
		this.level = level
		this.levelText.text = `Level ${level}`
	}
	updateScore(score: number) {
        this.score = score;
        this.scoreText.text = `Score ${score}`;
    }
}
