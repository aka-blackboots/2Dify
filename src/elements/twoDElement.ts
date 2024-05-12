import { ThreeScene } from "../three/scene";


export abstract class twoDElement {
    sceneManager: ThreeScene;
    abstract onPointerDown(event: any): void;
    abstract onPointerMove(event: any): void;
    abstract onKeyDown(event: any): void;
    constructor(sceneManager: ThreeScene) {
        this.sceneManager = sceneManager;
    }

    deleteElement() {
      this.sceneManager.scene.remove(this);
    }
}