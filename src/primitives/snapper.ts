import * as THREE from 'three';
import { IFloorElement } from '../elements/base-types';
import { LiteEvent } from './events';
import { ThreeScene } from '../three/scene';
import { acceleratedRaycast, computeBoundsTree } from 'three-mesh-bvh';

THREE.Mesh.prototype.raycast = acceleratedRaycast;
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;

interface ISnapperMove {
  point: THREE.Vector3;
  pointType: 'Grid' | 'Element';
}

export class Snapper{
  private sceneManager: ThreeScene;
  private camera: THREE.OrthographicCamera | THREE.PerspectiveCamera | undefined;
  private container: HTMLElement;
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  floorElements: IFloorElement[];

  onSnapperMove: LiteEvent<ISnapperMove> = new LiteEvent();
  onSnapperDown: LiteEvent<ISnapperMove> = new LiteEvent();
  private _snapperData: ISnapperMove | undefined;

  snapperSphere: THREE.Mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x8B8B8B })
  );

  private isMouseDown: boolean = false;

  constructor(
    container: HTMLElement,
    sceneManager: ThreeScene,
    camera: THREE.OrthographicCamera,
    floorElements: IFloorElement[]
  ) {
    this.sceneManager = sceneManager;
    this.camera = camera;
    this.container = container;
    this.floorElements = floorElements;

    this.initSnapper();
    this.setupEvents();
  }

  initSnapper() {
    this.sceneManager.scene.add(this.snapperSphere);
  }

  setupEvents() {
    this.raycaster.params.Line.threshold = 0.1;
    this.container.addEventListener('mousemove', (event) => {
      this.snapperMove(event);
    });
    this.container.addEventListener('mousedown', (event) => {
      this.isMouseDown = true;
      this.snapperDown(event);
    });
  }

  snapperVisible(visible: boolean) {
    this.snapperSphere.visible = visible;
  }

  snapperMove(event: MouseEvent) {
    // Order Important: Element should be checked first and then grid
    this.elementSnapperMove(event);
    if(this._snapperData) return;
    this.gridSnapperMove(event);
  }

  snapperDown(event: MouseEvent) {
    this.snapperMove(event);
  }

  gridSnapperMove(event: MouseEvent){
    const x = event.offsetX;
    const y = event.offsetY;
    const mouse = new THREE.Vector2();
    mouse.x = (x / this.container.clientWidth) * 2 - 1;
    mouse.y = -(y / this.container.clientHeight) * 2 + 1;
    this.raycaster.setFromCamera(mouse, this.camera!);

    const intersects = this.raycaster.intersectObject(this.sceneManager.virtualFloor);
    if (!intersects.length) return;

    this.snapperSphere.position.copy(intersects[0].point);
    this._snapperData = {
      point: new THREE.Vector3(intersects[0].point.x, 0, intersects[0].point.z),
      pointType: 'Grid'
    };

    if(this.isMouseDown) {
      this.onSnapperDown.trigger(this._snapperData);
      this.isMouseDown = false;
    } else {
      this.onSnapperMove.trigger(this._snapperData);
    }
  }

  elementSnapperMove(event: MouseEvent){
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
    if (!intersects.length) {
      this._snapperData = undefined;
      return;
    } else {
      this._snapperData = {
        point: new THREE.Vector3(intersects[0].point.x, 0, intersects[0].point.z),
        pointType: 'Element'
      };
    }
    this.snapperSphere.position.copy(intersects[0].point);
    
    if(this.isMouseDown) {
      this.onSnapperDown.trigger(this._snapperData);
      this.isMouseDown = false;
    } else {
      this.onSnapperMove.trigger(this._snapperData);
    }
  }

  updateSnapperDimensions(container: HTMLElement) {
    this.container = container;
  }
}