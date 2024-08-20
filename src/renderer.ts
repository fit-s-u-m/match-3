import * as PIXI from "pixi.js"
import { ELEMENT, TEXTURE } from "../types.ts"

export class Renderer {
	app: PIXI.Application
	dragger: any
	constructor() {
		this.app = new PIXI.Application()

	}
	async init() {
		await this.app.init({
			width: window.innerWidth,
			height: window.innerHeight
		});
		this.app.stage.eventMode = 'static';
		this.app.stage.hitArea = this.app.screen;
		this.app.stage.on('pointerup', () => {
			if (this.dragger)
				this.dragger.dragEnd()
		});
		this.app.stage.on('pointerupoutside', () => {
			if (this.dragger)
				this.dragger.dragEnd()
		});

		document.body.appendChild(this.app.canvas);

		// setting the background
		const bgPath = "../public/assets/bg5-2.jpg"
		const backgroundTexture = await PIXI.Assets.load(bgPath); //i am going to find a better color for bg texture
		const backgroundSprite = new PIXI.Sprite(backgroundTexture);
		backgroundSprite.zIndex = -10
		backgroundSprite.width = this.app.screen.width
		backgroundSprite.height = this.app.screen.height
		this.stage(backgroundSprite)
	}
	stage(...element: ELEMENT[]) {
		element.forEach(element => this.app.stage.addChild(element))
	}
	getMid() {
		return { x: this.app.screen.width / 2, y: this.app.screen.height / 2 }
	}
	async loadAsset(path: string) {
		return await PIXI.Assets.load(path)
	}
	createSprite(texture: any) {
		return new PIXI.Sprite(texture)
	}
	animationLoop(callback: Function) {
		this.app.ticker.add(() => {
			callback()
		})
	}
	removeLoop(callback: Function) {
		this.app.ticker.remove(() => { callback() })
	}
	write(text: string, x: number, y: number) {
		const style = new PIXI.TextStyle({
			fill: "white",
			fontSize: 40,
			fontFamily: "Arial",
			align: "center",
			fontWeight: "bold"
		})
		const textSprite = new PIXI.Text({ text, style })
		textSprite.anchor.set(0.5)
		textSprite.position.set(x, y)
		return textSprite
	}
    public displayGameOver() {
        const gameOverBackground = new PIXI.Graphics();
        gameOverBackground.beginFill(0x000000, 0.75); // Semi-transparent black
        gameOverBackground.drawRect(0, 0, 400, 150); // Adjust size as needed
        gameOverBackground.endFill();
        gameOverBackground.x = this.app.screen.width / 2 - 200; // Center the background
        gameOverBackground.y = this.app.screen.height / 2 - 75; // Center the background
        gameOverBackground.zIndex = 9;

        const gameOverText = new PIXI.Text('Game Over', {
            fontSize: 80,
            fill: 'red'
        });
        gameOverText.anchor.set(0.5);
        gameOverText.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
        gameOverText.zIndex = 10;

        this.app.stage.addChild(gameOverBackground);
        this.app.stage.addChild(gameOverText);
        this.app.stage.sortChildren(); // Ensure proper layering
    }

    setColor(sprite: PIXI.Sprite, color: number) {
        sprite.tint = color;
    }
}
