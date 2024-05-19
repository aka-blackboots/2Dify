// import { twoDElement } from "../elements/twoDElement";
// import { ThreeScene } from "./scene";

// export class FloorControls {
//   private sceneManager: ThreeScene;
//   constructor(sceneManager: ThreeScene) {
//     this.sceneManager = sceneManager;
//   }

//   setActiveElement(element: twoDElement) {
//     this.setupEvents(element);
//   }

//   private setupEvents(element: twoDElement) {
//     const domElement = this.sceneManager.renderer.domElement;
//     domElement.addEventListener('mousedown', () => {
//       element.onPointerDown(event);
//     });
//     domElement.addEventListener('mousemove', () => {
//       element.onPointerMove(event);
//     });
//     window.onkeydown = (event) => {
//       element.onKeyDown(event);
//     }
//   }


// }