import { LiteEvent } from "../primitives/events";
import { ThreeScene } from "../three/scene";
import * as THREE from 'three';
import { FloorElement, IFloorElement } from "./base-types";
import { v4 as uuidv4 } from 'uuid';

export abstract class twoDElement {
    sceneManager: ThreeScene;
    abstract onPointerDown(event: any): void;
    abstract onPointerMove(event: any): void;
    abstract onKeyDown(event: any): void;
    
    public onRaycastHover: LiteEvent<any> = new LiteEvent();
    public onRaycastClick: LiteEvent<any> = new LiteEvent();

    public onCreated: LiteEvent<any> = new LiteEvent();

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

      window.addEventListener('mousemove', (ev) => this.onPointerMove(ev));
      window.addEventListener('mousedown', (ev) => this.onPointerDown(ev));
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
      raycaster.setFromCamera(mouse, this.sceneManager.camera);

      if (!this.floorElements.length) return;

      const twoDElements: THREE.Object3D[] = [];
      this.floorElements.forEach((element) => {
        if (!element.mesh) return;
        twoDElements.push(element.mesh);
      });
      const intersects = raycaster.intersectObjects(twoDElements);
      if (!intersects.length) return;

      // add sphere
      // const sphere = new THREE.Mesh(
      //   new THREE.SphereGeometry(0.1),
      //   new THREE.MeshBasicMaterial({ color: 0xff0000 })
      // );
      // sphere.position.copy(intersects[0].point);
      // this.sceneManager.scene.add(sphere);
    }

    checkIntersection(point: THREE.Vector3) {
      console.log('Checking intersection');
      console.log(point);
    }

    // addElement(mouseEvent: MouseEvent) {

    // }

    removeEvents() {
      window.removeEventListener('mousedown', (ev) => this.checkHoverIntersection(ev));
      window.removeEventListener('mousemove', (ev) => this.checkHoverIntersection(ev));
    }

    dispose() {
      this.removeEvents();
      this.onCreated.dispose();
      this.onRaycastClick.dispose();
      this.onRaycastHover.dispose();
    }
}