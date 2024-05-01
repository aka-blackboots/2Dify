import CameraControls from 'camera-controls';
import * as THREE from 'three';
import { twoDCamera } from './camera';
import { GridManager } from './grid-manager';

export class ThreeScene {
    scene: any;
    private camera: any;
    private renderer: any;
    private controls: any;
    private _raycaster: any;
    private container: HTMLElement;
    private grid: any;

    private clock = new THREE.Clock();

    constructor(container: HTMLElement) {
        this.container = container;
        CameraControls.install( { THREE: THREE } );
    }

    get raycaster() {
        return this._raycaster;
    }

    setupThree() {
        this.scene = new THREE.Scene();
        this.camera = new twoDCamera(this.container, this.scene).createCamera();
        console.log('this.camera', this.camera);
        this.renderer = new THREE.WebGLRenderer(
            { antialias: true, alpha: true }
        );
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0xffffff, 1);
        this.container.appendChild(this.renderer.domElement);
        this.controls = new CameraControls( this.camera, this.renderer.domElement );
        this.setupLights();
        this.grid = new GridManager(this.scene);
        this._raycaster = new THREE.Raycaster();
        this.animate();
    }

    setupLights() {
        const light = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(light);

        const light2 = new THREE.DirectionalLight(0xd4e4ff, 0.7);
        light2.position.set(-10, 10, 0);
        this.scene.add(light2);

        const light3 = new THREE.DirectionalLight(0xfff5de, 0.7);
        light3.position.set(10, 10, 10);
        this.scene.add(light3);
    }

    animate() {
        this.controls.update(this.clock.getDelta());
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }

    get gridManager() {
        return this.grid;
    }
}