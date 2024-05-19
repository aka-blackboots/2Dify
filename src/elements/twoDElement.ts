import { LiteEvent } from "../primitives/events";
import { ThreeScene } from "../three/scene";
import * as THREE from 'three';
import { FloorElement, IFloorElement } from "./base-types";
import { v4 as uuidv4 } from 'uuid';

export abstract class twoDElement {
    sceneManager: ThreeScene;
    abstract onPointerDown(event: THREE.Vector3): void;
    abstract onPointerMove(event: THREE.Vector3): void;
    abstract onKeyDown(event: any): void;
    
    public onCreated: LiteEvent<any> = new LiteEvent();
    public onEditing: LiteEvent<any> = new LiteEvent();

    private floorElements: IFloorElement[];

    abstract type: FloorElement;
    abstract isPlaced: boolean;
    abstract isMoving: boolean;
    abstract isEditDone: boolean;

    abstract meshGroup: THREE.Group;

    public id: string | undefined;

    constructor(sceneManager: ThreeScene, floorElements: IFloorElement[]) {
      this.sceneManager = sceneManager;
      this.floorElements = floorElements;

      window.addEventListener('keypress', (ev) => this.onKeyDown(ev));

      this.id = uuidv4();
    }

    deleteElement() {
      this.sceneManager.scene.remove(this);
    }

    checkHoverIntersection(mouseEvent: MouseEvent) {
      const x = mouseEvent.offsetX;
      const y = mouseEvent.offsetY;
      const mouse = new THREE.Vector2();
      mouse.x = (x / this.sceneManager.renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(y / this.sceneManager.renderer.domElement.clientHeight) * 2 + 1;
      const raycaster = this.sceneManager.raycaster;
      raycaster.setFromCamera(mouse, this.sceneManager.camera?.camera!);

      if (!this.floorElements.length) return;

      const twoDElements: THREE.Object3D[] = [];
      this.floorElements.forEach((element) => {
        if (!element.mesh) return;
        twoDElements.push(element.mesh);
      });
      const intersects = raycaster.intersectObjects(twoDElements);
      if (!intersects.length) return;

      return intersects[0].point;
    }

    checkIntersection(point: THREE.Vector3) {
      console.log('Checking intersection');
      console.log(point);
    }

    dispose() {
      this.onCreated.dispose();
    }
}