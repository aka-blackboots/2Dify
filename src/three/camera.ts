import * as THREE from 'three';

export class twoDCamera {
    private scene: THREE.Scene;
    private _camera: THREE.OrthographicCamera | undefined;
    private container: HTMLElement;
    private frustumSize = 30;
    constructor(container: HTMLElement, scene: THREE.Scene) {
        this.container = container;
        this.scene = scene;
    }

    get camera() {
        return this._camera;
    }

    createCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this._camera = new THREE.OrthographicCamera(
            this.frustumSize * aspect / - 2, 
            this.frustumSize * aspect / 2, 
            this.frustumSize / 2, 
            this.frustumSize / - 2, 
            0.1, 
            100);
        this.scene.add(this._camera);
        this._camera.position.set(0, 10, 0);
        return this._camera;
    }

    resize() {
        if(!this._camera) return;
        const aspect = window.innerWidth / window.innerHeight;
        this._camera.left = - this.frustumSize * aspect / 2;
        this._camera.right = this.frustumSize * aspect / 2;
        this._camera.top = this.frustumSize / 2;
        this._camera.bottom = - this.frustumSize / 2;
        this._camera.updateProjectionMatrix();
    }
}