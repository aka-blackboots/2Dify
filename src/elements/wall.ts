import * as THREE from 'three';
import { twoDElement } from './twoDElement';
import { ThreeScene } from '../three/scene';
import { floorMath } from '../floorMath';
export class Wall extends twoDElement {
    // private width: number = 0.5;
    // private length: number = 5;
    // private height: number = 10;
    private mesh: THREE.Mesh | THREE.Line | undefined;
    private isPlaced: boolean = false;
    private isMoving: boolean = false;
    private isEditDone: boolean = false;

    private mesh2: THREE.Mesh | undefined;
    private wallGroup: THREE.Group = new THREE.Group();
    private normalVector: THREE.Line | undefined;

    private endSphere: THREE.Mesh | undefined;
    
    constructor(sceneManager: ThreeScene) {
        super(sceneManager);
        this.sceneManager = sceneManager;
    }

    createWall() {
        this.mesh = new THREE.Line(
            new THREE.BufferGeometry(),
            new THREE.LineBasicMaterial({ color: 0x0000ff })
        );
        this.wallGroup.add(this.mesh);
        this.sceneManager.scene.add(this.wallGroup);

        // Expirement new wall creation
        const pGeom = new THREE.PlaneGeometry( 0.5, 0.5, 32 );
        const pMat = new THREE.MeshBasicMaterial( {color: 0x4d4d4d, side: THREE.DoubleSide} );
        this.mesh2 = new THREE.Mesh( pGeom, pMat );
        this.mesh2.rotateX(Math.PI / 2);
        this.mesh2.visible = false;
        this.sceneManager.scene.add(this.mesh2);

        this.normalVector = new THREE.Line(
            new THREE.BufferGeometry(),
            new THREE.LineBasicMaterial({ color: 0x4d4d4d })
        );
        this.sceneManager.scene.add(this.normalVector);

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
            console.log('Editing Wall');
            const point = intersects[0].point;
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
            this.wallGroup.add(sphere);

            this.endSphere?.removeFromParent();
        }

        if (!this.isPlaced && !this.isEditDone) {
            console.log('Placing Wall');
            const point = intersects[0].point;
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
            this.mesh.geometry = geometry;
            const position = geometry.getAttribute('position') as THREE.BufferAttribute;
            position.setXYZ(0, point.x, 0, point.z);
            position.setXYZ(1, point.x, 0, point.z);
            this.mesh.visible = true;
            
            this.isPlaced = true;
            this.isMoving = true;

            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.1),
                new THREE.MeshBasicMaterial({ color: 0xff0000 })
            );
            sphere.position.copy(point);
            this.wallGroup.add(sphere);

            // Moving Sphere, should be removed after edit done
            this.endSphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.1),
                new THREE.MeshBasicMaterial({ color: 0xc4c4c4 })
            );
            this.endSphere.position.copy(point);
            this.wallGroup.add(this.endSphere);

            if (!this.mesh2) return;
            this.mesh2.position.copy(point);
            this.mesh2.visible = true;

            if (!this.normalVector) return;
            const vectorGeometry = new THREE.BufferGeometry();
            vectorGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
            this.normalVector.geometry = vectorGeometry;
            const vectorPosition = vectorGeometry.getAttribute('position') as THREE.BufferAttribute;
            vectorPosition.setXYZ(0, point.x, 0, point.z);
            vectorPosition.setXYZ(1, point.x + 10, 0, point.z);

            const pointX = new THREE.Vector3(vectorPosition.getX(1), 0, vectorPosition.getZ(1));
            const center = new THREE.Vector3(vectorPosition.getX(0), 0, vectorPosition.getZ(0));
            // const pointY = new THREE.Vector3(point.x, 0, point.z);
            // create sphere at pointX and center
            const sphereX = new THREE.Mesh(
                new THREE.SphereGeometry(0.1),
                new THREE.MeshBasicMaterial({ color: 0xc4c4c4 })
            );
            sphereX.position.copy(pointX);
            this.wallGroup.add(sphereX);

            const sphereCenter = new THREE.Mesh(
                new THREE.SphereGeometry(0.1),
                new THREE.MeshBasicMaterial({ color: 0xc4c4c4 })
            );
            sphereCenter.position.copy(center);
            this.wallGroup.add(sphereCenter);
            
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

            if (!this.endSphere) return;
            this.endSphere.position.copy(point);

            const vectorGeometry = this.normalVector?.geometry as THREE.BufferGeometry;
            const vectorPosition = vectorGeometry.getAttribute('position') as THREE.BufferAttribute;

            const pointX = new THREE.Vector3(vectorPosition.getX(1), 0, vectorPosition.getZ(1));
            const center = new THREE.Vector3(vectorPosition.getX(0), 0, vectorPosition.getZ(0));
            const pointY = new THREE.Vector3(point.x, 0, point.z);

            const angle = this.getAngle(pointX, pointY, center);
            console.log('Angle Rad: ', angle);
            console.log('Angle Deg: ', THREE.MathUtils.radToDeg(angle));
        }
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.isPlaced = true;
            this.isMoving = true;
            this.isEditDone = true;
            this.mesh?.removeFromParent();
            this.wallGroup.removeFromParent();
        }
    }

    private getAngle(v1: THREE.Vector3, v2: THREE.Vector3, center: THREE.Vector3) {
        const denominator = floorMath.
        return angle;
    }
}