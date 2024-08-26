import { Grid } from "./grid";
import { Renderer } from "./renderer";
import { Candies } from "./candy";
import { UI } from "./ui";
import { GRIDINFO } from "../types";
import { Sound } from "./sound";
import { Particles } from "./particles";
export class Game {
	renderer: Renderer;
	grid: Grid;
	gridInfo: GRIDINFO;
	candies: Candies;
	ui: UI;
	moveLimit: number = 2;
	moveCounter: number = 0;
	gameOver: boolean = false;
	soundManager = new Sound();
	particles: Particles[] = [];
	constructor() {
		this.renderer = new Renderer();
		this.grid = new Grid(this.renderer);
		this.candies = new Candies(this.renderer);
		this.ui = new UI(this.renderer, this);
	}

	async startGame() {
		await Promise.all([
			this.renderer.init(),
			this.ui.init(),
			this.candies.init(),
		]);
		// Create and display the play screen
		this.ui.createplayScreen();
	}

	async startGameLoop() {
		this.gridInfo = await this.grid.makeGrid(8, 8);
		this.ui.createCounterBoard(this.grid.gridPos, this.grid.width);
		this.ui.createScoreBoard(this.grid.gridPos);
		this.gridInfo.forEach((row) => {
			row.forEach((info) => {
				const candy = this.candies.createCandy(info.candyId);
				this.candies.spawn(info.x, info.y, info.cellSize, candy);
				info.candy = candy;
				this.renderer.stage(candy);
			});
		});
		this.grid.gridInfo = this.gridInfo;
		this.candies.setGrid(this.grid, this.ui);

		this.renderer.animationLoop(() => {
			this.particles = []
			if (!this.gameOver) {
				const matches = this.grid.checkGrid();

				matches.forEach(async (match) => { // for every match
					const cellSize = this.grid.gridInfo[0][0].cellSize;
					const gridPos = this.grid.gridPos;
					const middle = match.count / 2
					const start = match.startIndex

					// calculate x and y position of the match
					const positionX = match.direction === "horizontal"
						? ((start.c + middle) * cellSize + cellSize / 2) + gridPos.x
						: start.c * cellSize + cellSize / 2 + gridPos.x
					const positionY = match.direction === "vertical"
						? (start.r + middle) * cellSize + cellSize / 2 + gridPos.y
						: start.r * cellSize + cellSize / 2 + gridPos.y

					const point = this.renderer.createVector(positionX, positionY);

					// this.grid.explosion(point.x, point.y)
					// const particle = new Particles(this.renderer, point, 30)
					// await particle.draw()
					// this.particles.push(particle);
				})

				if (matches.length > 0) {
					this.ui.updateScore(matches);
				}
				this.grid.fillCol(matches, this.candies);
				this.moveCounter = this.ui.getMoveCount();
				if (this.moveCounter >= this.moveLimit) {
					this.gameOver = true;
					this.handleGameOver();
				}
			}
		});
		this.renderer.particleAnimation(() => {
			this.particles.forEach(particle => particle.update())
		})
	}

	handleGameOver() {
		this.ui.createGameOverScreen();
		this.soundManager.playSound("game-overMusic");
		this.soundManager.setVolume("game-overMusic", 0.5);
		this.candies.setGameOver();
	}
}
