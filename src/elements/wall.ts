import * as THREE from 'three';
import { twoDElement } from './twoDElement';
import { ThreeScene } from '../three/scene';
export class Wall extends twoDElement {
    // private width: number = 0.5;
    // private length: number = 5;
    // private height: number = 10;
    private mesh: THREE.Mesh | THREE.Line | undefined;
    private isPlaced: boolean = false;
    private isMoving: boolean = false;
    private isEditDone: boolean = false;
    constructor(sceneManager: ThreeScene) {
        super(sceneManager);
        this.sceneManager = sceneManager;
    }

    createWall() {
        // const wall = new THREE.Mesh(
        //     new THREE.BoxGeometry(this.width, this.height, this.length),
        //     new THREE.MeshLambertMaterial({ color: 0x00ff00 })
        // );
        const wallLine = new THREE.Line(
            new THREE.BufferGeometry(),
            new THREE.LineBasicMaterial({ color: 0x0000ff })
        );
        wallLine.visible = false;
        this.sceneManager.scene.add(wallLine);
        this.mesh = wallLine;
        return this;
    }

    onPointerDown(event: MouseEvent) {
        const x = event.clientX;
        const y = event.clientY;
        const mouse = new THREE.Vector2();
        mouse.x = (x / this.sceneManager.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(y / this.sceneManager.renderer.domElement.clientHeight) * 2 + 1;
        const raycaster = this.sceneManager.raycaster
        raycaster.setFromCamera(mouse, this.sceneManager.camera);
        const intersects = raycaster.intersectObjects([this.sceneManager.virtualFloor]);
        if (!this.mesh || intersects.length <= 0) return;

        if (this.isPlaced && this.isMoving) {
            const point = intersects[0].point;
            // Ending the Last Point of the Wall
            const geometry = this.mesh.geometry as THREE.BufferGeometry;
            const position = geometry.getAttribute('position') as THREE.BufferAttribute;
            position.setXYZ(1, point.x, 0, point.z);
            position.needsUpdate = true;

            this.isEditDone = true;
            this.isMoving = false;

            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.1),
                new THREE.MeshBasicMaterial({ color: 0xff0000 })
            );
            sphere.position.copy(point);
            this.sceneManager.scene.add(sphere);
        }

        if (!this.isPlaced && !this.isEditDone) {
            const point = intersects[0].point;
            console.log(this.mesh);
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
            this.mesh.geometry = geometry;
            const position = geometry.getAttribute('position') as THREE.BufferAttribute;
            position.setXYZ(0, point.x, 0, point.z);
            position.setXYZ(1, point.x, 0, point.z);
            this.mesh.visible = true;
            
            this.isPlaced = true;
            this.isMoving = true;

            // Create a sphere to mark the starting point of the wall
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.1),
                new THREE.MeshBasicMaterial({ color: 0xff0000 })
            );
            sphere.position.copy(point);
            this.sceneManager.scene.add(sphere);
        }
    }

    onPointerMove(event: any) {
        const x = event.clientX;
        const y = event.clientY;
        const mouse = new THREE.Vector2();
        mouse.x = (x / this.sceneManager.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(y / this.sceneManager.renderer.domElement.clientHeight) * 2 + 1;

        if (!this.mesh) return;
        
        const raycaster = this.sceneManager.raycaster;
        raycaster.setFromCamera(mouse, this.sceneManager.camera);
        const intersects = raycaster.intersectObjects([this.sceneManager.virtualFloor]);

        if (intersects.length > 0 && this.isMoving) {
            const point = intersects[0].point;
            const geometry = this.mesh.geometry as THREE.BufferGeometry;
            const position = geometry.getAttribute('position') as THREE.BufferAttribute;
            position.setXYZ(1, point.x, 0, point.z);
            position.needsUpdate = true;
        }
    }
}