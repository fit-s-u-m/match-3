import * as PIXI from "pixi.js"
import { ELEMENT, TEXTURE } from "../types.ts"

export class Renderer {
	app: PIXI.Application
	constructor() {
		this.app = new PIXI.Application()
	}
	async init() {
		await this.app.init({
			width: window.innerWidth,
			height: window.innerHeight
		});
		document.body.appendChild(this.app.canvas);

		// setting the background
		const bgPath = "../public/assets/bg5.jpg"
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

}
