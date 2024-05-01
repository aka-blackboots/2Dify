import * as THREE from 'three';

export class twoDCamera {
    private scene: THREE.Scene;
    private camera: THREE.OrthographicCamera | undefined;
    private container: HTMLElement;
    private frustumSize = 30;
    constructor(container: HTMLElement, scene: THREE.Scene) {
        this.container = container;
        this.scene = scene;
    }

    createCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.OrthographicCamera(
            this.frustumSize * aspect / - 2, 
            this.frustumSize * aspect / 2, 
            this.frustumSize / 2, 
            this.frustumSize / - 2, 
            0.1, 
            100);
        this.scene.add(this.camera);
        this.camera.position.set(0, 10, 0);

        window.addEventListener( 'resize', this.resize );

        return this.camera;
    }

    resize() {
        if(!this.camera) return;
        const aspect = window.innerWidth / window.innerHeight;
        this.camera.left = - this.frustumSize * aspect / 2;
        this.camera.right = this.frustumSize * aspect / 2;
        this.camera.top = this.frustumSize / 2;
        this.camera.bottom = - this.frustumSize / 2;
        this.camera.updateProjectionMatrix();
    }
}