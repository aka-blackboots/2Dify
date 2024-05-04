import CameraControls from 'camera-controls';
import * as THREE from 'three';
import { twoDCamera } from './camera';
import { GridManager } from './grid-manager';

export class ThreeScene {
    scene: any;
    public camera: any;
    public renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    private controls: any;
    private _raycaster: THREE.Raycaster = new THREE.Raycaster();
    private container: HTMLElement;
    private grid: any;

    private clock = new THREE.Clock();
    private _virtualFloor: THREE.Mesh = new THREE.Mesh();

    constructor(container: HTMLElement) {
        this.container = container;
        CameraControls.install( { THREE: THREE } );
    }

    get raycaster() {
        return this._raycaster;
    }

    private setupVirtualFloor() {
        const geometry = new THREE.PlaneGeometry(100, 100);
        const material = new THREE.MeshBasicMaterial({
            color: 0x0000ff, 
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.1
        });
        this._virtualFloor = new THREE.Mesh(geometry, material);
        this._virtualFloor.rotation.x = Math.PI / 2;
        this.scene.add(this._virtualFloor);
    }

    get virtualFloor() {
        return this._virtualFloor;
    }

    setupThree() {
        this.scene = new THREE.Scene();
        this.camera = new twoDCamera(this.container, this.scene).createCamera();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0xffffff, 1);
        this.container.appendChild(this.renderer.domElement);
        this.controls = new CameraControls( this.camera, this.renderer.domElement );
        this.setupLights();
        this.grid = new GridManager(this.scene);
        this._raycaster = new THREE.Raycaster();
        this.setupVirtualFloor();
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