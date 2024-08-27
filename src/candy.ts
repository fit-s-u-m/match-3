import { RENDERER, SPRITE, TEXTURE, GRID, Ui, CANDYINFO, SPRITESHEET } from "../types";
import { Sound } from "./sound";
import { data } from "../public/assets/particle/particle.ts"
export class Candies {
	renderer: RENDERER;
	candyTextures: TEXTURE[];
	prevPos: { x: number; y: number } = { x: 0, y: 0 };
	private dragTarget: SPRITE | null = null;
	private grid: GRID;
	private moveCounter: number = 0;
	private ui: Ui;
	private gameOver: boolean = false;
	spriteSheet: SPRITESHEET

	soundManager = new Sound();

	constructor(renderer: RENDERER) {
		this.renderer = renderer;
	}
	async init() {
		const candyPaths = [
			"ui/stone_blue.png",
			"ui/stone_green.png",
			"ui/stone_pink.png",
			"ui/stone_yellow.png",
		];
		const promise = candyPaths.map((path) => this.renderer.loadAsset(path));
		await this.renderer.loadAsset(data.meta.image) //  particle
		const spritesheet = this.renderer.createSpritesheet(data)
		await spritesheet.parse() // generate spritesheet
		this.spriteSheet = spritesheet
		this.candyTextures = await Promise.all(promise);
	}
	createCandy(candyId: number) {
		const candy = this.renderer.createSprite(this.candyTextures[candyId]);
		candy.zIndex = 1;
		candy.eventMode = "static";
		candy.cursor = "pointer";
		candy.on("pointerdown", this.startDrag.bind(this, candy));
		return candy;
	}
	startDrag(candy: SPRITE) {
		if (this.gameOver) return;
		candy.alpha = 0.75;
		this.dragTarget = candy;
		this.renderer.dragger = this;
		this.prevPos = { x: candy.x, y: candy.y };
		this.renderer.app.stage.on("pointermove", this.dragMove.bind(this));
	}
	setGrid(grid: GRID, ui: Ui) {
		this.grid = grid;
		this.ui = ui;
	}
	async destroy(candiesToRemove: { candy: SPRITE, x: number, y: number, cellSize: number }[]) {
		return Promise.all(candiesToRemove.map(async candyToRemove => {
			const candy = candyToRemove.candy
			candy.destroy()
			await this.explosion(candyToRemove.x, candyToRemove.y, candyToRemove.cellSize)
		}))
	}
	async explosion(x: number, y: number, cellSize: number) {
		// let textures: TEXTURE[] = []
		// for (let i = 1; i <= 5; i++) {
		// 	const path = `assets/particle/explosion_${i}.png`
		// 	const texture = await this.renderer.loadAsset(path)
		// 	textures.push(texture)
		// }
		return new Promise<void>(async (resolve) => {

			const animationSprite = this.renderer.animatedSprite(this.spriteSheet.animations.explosion)
			this.renderer.stage(animationSprite)
			animationSprite.position.set(x, y)
			animationSprite.setSize(cellSize, cellSize)
			animationSprite.animationSpeed = 0.4
			animationSprite.loop = false
			animationSprite.zIndex = 10
			animationSprite.play()
			animationSprite.onComplete = () => {
				animationSprite.destroy()
				resolve()
			}

		})
	}

	dragMove(event: any) {
		if (this.gameOver || !this.dragTarget) return;
		this.dragTarget.x = event.data.global.x - this.dragTarget.width / 2;
		this.dragTarget.y = event.data.global.y - this.dragTarget.height / 2;
	}
	dragEnd() {
		if (this.gameOver || !this.dragTarget) return;

		this.dragTarget.alpha = 1;
		let targetCandyInfo: CANDYINFO | null = null;

		for (let row of this.grid.gridInfo) {
			for (let info of row) {
				// Accessing individual CANDYINFO objects
				const inXBound =
					this.dragTarget.x >= info.x - info.cellSize / 2 &&
					this.dragTarget.x <= info.x + info.cellSize / 2;
				const inYBound =
					this.dragTarget.y >= info.y - info.cellSize / 2 &&
					this.dragTarget.y <= info.y + info.cellSize / 2;

				if (inXBound && inYBound) {
					targetCandyInfo = info;
					break;
				}
			}
			if (targetCandyInfo) break; // Exit outer loop if targetCandyInfo is found
		}
		if (!targetCandyInfo) {
			this.revertDrag();
			return;
		}
		const prevGridPos = this.grid.getGridPosition(this.prevPos);
		const targetGridPos = this.grid.getGridPosition({
			x: targetCandyInfo.x,
			y: targetCandyInfo.y,
		});
		const dragId = this.grid.gridInfo[prevGridPos.r][prevGridPos.c].candyId;

		// loop to check for adjacent candies
		let adjacent = false;
		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				if (Math.abs(dx) + Math.abs(dy) === 1) {
					// Check for horizontal or vertical adjacency
					const adjacentGridPos = {
						c: prevGridPos.c + dx,
						r: prevGridPos.r + dy,
					};
					if (
						adjacentGridPos.c === targetGridPos.c &&
						adjacentGridPos.r === targetGridPos.r
					) {
						adjacent = true;
						break;
					}
				}
			}
			if (adjacent) break;
		}
		if (!adjacent || !targetCandyInfo.candy) {
			this.revertDrag();
			return;
		}
		if (!this.grid.checkMove(targetGridPos, prevGridPos, dragId)) {
			this.revertDrag();
			this.soundManager.playSound("wrongMusic");
			this.soundManager.setVolume("wrongMusic", 0.3);
			return;
		}

		this.swap(this.dragTarget, targetCandyInfo.candy);
		this.soundManager.playSound("swapMusic");
		this.soundManager.setVolume("swapMusic", 0.3);

		// swaping the ids
		const temp = this.grid.gridInfo[targetGridPos.r][targetGridPos.c].candyId;
		this.grid.gridInfo[targetGridPos.r][targetGridPos.c].candyId =
			this.grid.gridInfo[prevGridPos.r][prevGridPos.c].candyId;
		this.grid.gridInfo[prevGridPos.r][prevGridPos.c].candyId = temp;

		this.moveCounter++;
		this.ui.updateMove(this.moveCounter);

		this.dragTarget = null;
		this.renderer.app.stage.off("pointermove", this.dragMove);
	}
	revertDrag() {
		if (this.dragTarget) {
			this.dragTarget.x = this.prevPos.x;
			this.dragTarget.y = this.prevPos.y;
			this.dragTarget = null;
			this.renderer.app.stage.off("pointermove", this.dragMove);
		}
	}
	getTexture(candy: SPRITE) {
		return candy.texture;
	}
	changeTexture(candy: SPRITE, texture: TEXTURE) {
		candy.texture = texture;
	}
	setGameOver() {
		this.gameOver = true;
		this.grid.gridInfo.forEach((row) => {
			row.forEach((info) => {
				if (info.candy) {
					let fadeOut = 0.5;
					info.candy.alpha = fadeOut;
				}
			});
		});
	}

	spawn(x: number, y: number, cellSize: number, candy: SPRITE) {
		candy.position.set(x, 0);
		candy.width = cellSize;
		candy.height = cellSize;
		this.fallDown(candy, y);
	}
	swap(candy1: SPRITE, candy2: SPRITE) {
		const texture1 = candy2.texture;
		const texture2 = candy1.texture;
		candy1.texture = texture1;
		candy2.texture = texture2;
		candy1.x = this.prevPos.x;
		candy1.y = this.prevPos.y;
	}
	async fallDown(candy: SPRITE, y: number, time = 6) {
		const speed = 8;
		if (candy) {
			const id = setInterval(() => {
				candy.y += speed;
				if (candy.y >= y) {
					clearInterval(id);
				}
			}, time);
		}
	}
	sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}
