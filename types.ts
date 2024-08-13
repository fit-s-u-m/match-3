import * as PIXI from "pixi.js"
import { Renderer } from "./src/renderer"
export type ELEMENT = PIXI.Sprite | PIXI.Text | PIXI.Container | PIXI.Graphics
export type RENDERER = Renderer
export type SPRITE = PIXI.Sprite
export type TEXTURE = PIXI.Texture
export type TEXT = PIXI.Text
export type EVENT = any // TODO: find the correct type for event
export type GRIDINFO = { x: number, y: number, cellSize: number, candyId: number, candy?: SPRITE }[]
