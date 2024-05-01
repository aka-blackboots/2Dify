import * as THREE from 'three';

export class Wall {
    private width: number = 1;
    private length: number = 5;
    private height: number = 10;
    private scene: THREE.Scene;
    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    createSimpleWall() {
        const wall = new THREE.Mesh(
            new THREE.BoxGeometry(this.width, this.height, this.length),
            new THREE.MeshLambertMaterial({ color: 0x00ff00 })
        );
        this.scene.add(wall);
        console.log(wall);
        return wall;
    }
}