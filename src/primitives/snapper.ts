import * as THREE from 'three';
import { IFloorElement } from '../elements/base-types';
import { LiteEvent } from './events';

interface ISnapperMove {
  point: THREE.Vector3;
  pointType: 'Grid' | 'Element';
}

export class Snapper{
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera | THREE.PerspectiveCamera | undefined;
  private container: HTMLElement;
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  floorElements: IFloorElement[];

  onSnapperMove: LiteEvent<ISnapperMove> = new LiteEvent();

  constructor(
    container: HTMLElement,
    scene: THREE.Scene, 
    camera: THREE.OrthographicCamera,
    floorElements: IFloorElement[]
  ) {
    this.scene = scene;
    this.camera = camera;
    this.container = container;
    this.floorElements = floorElements;

    this.setupEvents();

    console.log(this.scene)
  }

  setupEvents() {
    this.raycaster.params.Line.threshold = 0.1;
    this.container.addEventListener('mousemove', (event) => {
      this.snapperMove(event);
    });
  }

  snapperMove(event: MouseEvent) {
    const x = event.offsetX;
    const y = event.offsetY;
    const mouse = new THREE.Vector2();
    mouse.x = (x / this.container.clientWidth) * 2 - 1;
    mouse.y = -(y / this.container.clientHeight) * 2 + 1;
    this.raycaster.setFromCamera(mouse, this.camera!);

    const floorElements: THREE.Object3D[] = [];
    this.floorElements.forEach((element) => {
      if (!element.mesh) return;
      floorElements.push(element.mesh);
    });
    const intersects = this.raycaster.intersectObjects(floorElements);
    if (!intersects.length) return;

    this.onSnapperMove.trigger({
      point: intersects[0].point,
      pointType: 'Element'
    });
  }

  updateSnapperDimensions(container: HTMLElement) {
    this.container = container;
  }
}