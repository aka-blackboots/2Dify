import * as THREE from 'three';
import { twoDElement } from './twoDElement';
import { ThreeScene } from '../three/scene';
import { FloorHelper } from '../primitives/floor-helper';
import { FloorElement, IFloorElement } from './base-types';
// import { FloorControls } from '../three/floor-controls';
// import { MeshBVHHelper, acceleratedRaycast, computeBoundsTree } from 'three-mesh-bvh';

// Every Mesh is a line - line is like something which controls everything
// Every Extended Element has its own mesh type, e.g. wall and table looks different, so to repsent them we need to have different mesh types
// but in the lowest topolocigal sense they are all lines
// users see meshes but for the code they are all lines

// THREE.Mesh.prototype.raycast = acceleratedRaycast;
// THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;

export class Wall extends twoDElement {
    // private width: number = 0.5;
    // private length: number = 5;
    // private height: number = 10;
    isPlaced = false;
    isMoving = false;
    isEditDone = false;

    meshGroup: THREE.Group = new THREE.Group();
    private mesh: THREE.Mesh | THREE.Line | undefined;
    public wallMesh: THREE.Mesh | undefined;
    private wallEdge: THREE.LineSegments | undefined;
    private endSphere: THREE.Mesh | undefined;

    private floorHelper: FloorHelper | undefined;

    type: FloorElement = 'Wall';

    constructor(sceneManager: ThreeScene, floorElements: IFloorElement[]) {
        super(sceneManager, floorElements);
        this.sceneManager = sceneManager;
        this.createWallSkeleton();
    }

    getQuadrant() {
        const helperEndSphere = this.floorHelper?.helperEndSphere;
        
        if (helperEndSphere && this.endSphere) {
            if (this.endSphere?.position.z > helperEndSphere.position.z) {
                return 'SOUTH';
            } else {
                return 'NORTH';
            }
        }
    }

    createWallSkeleton() {
        this.mesh = new THREE.Line(
            new THREE.BufferGeometry(),
            new THREE.LineBasicMaterial({ color: 0x0000ff })
        );
        this.mesh.userData = {
            floorElementId: this.id,
        };
        this.meshGroup.add(this.mesh);
        this.sceneManager.scene.add(this.meshGroup);

        // Brown Wall
        const wallGeom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const wallMat = new THREE.MeshToonMaterial({ 
            color: 0xC2A282,
            transparent: true,
            opacity: 0.7
        });
        this.wallMesh = new THREE.Mesh(wallGeom, wallMat);
        this.sceneManager.scene.add(this.wallMesh);
        this.wallMesh.visible = false;

        // Wall Edge
        const wallEdgeGeom = new THREE.EdgesGeometry(wallGeom);
        const wallEdgeMat = new THREE.LineBasicMaterial({ color: 0x000000 });
        this.wallEdge = new THREE.LineSegments(wallEdgeGeom, wallEdgeMat);
        this.sceneManager.scene.add(this.wallEdge);
        this.wallEdge.visible = false;
    }

    setWallCenter(center: THREE.Vector3) {
        this.wallMesh?.position.copy(center);
        this.wallEdge?.position.copy(center);
        this.meshGroup.position.copy(center);
        this.mesh?.position.copy(center);
    }

    onPointerDown(choosenPoint: THREE.Vector3) {
        if (!this.mesh) return;

        if (this.isPlaced && this.isMoving) {
            const point = choosenPoint;
            const geometry = this.mesh.geometry as THREE.BufferGeometry;
            const position = geometry.getAttribute('position') as THREE.BufferAttribute;
            position.setXYZ(1, point.x, 0, point.z);
            position.needsUpdate = true;

            this.isEditDone = true;
            this.isMoving = false;

            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.05),
                new THREE.MeshBasicMaterial({ color: 0x242425 })
            );
            sphere.position.copy(point);
            this.meshGroup.add(sphere);

            this.mesh.geometry.computeBoundingSphere();

            this.endSphere?.removeFromParent();
            this.floorHelper?.removeHelper();

            this.onCreated.trigger(this);
        }

        if (!this.isPlaced && !this.isEditDone) {
            console.log('Placing Wall');
            const point = choosenPoint;
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
                new THREE.SphereGeometry(0.05),
                new THREE.MeshBasicMaterial({ color: 0x242425 })
            );
            sphere.position.copy(point);
            this.meshGroup.add(sphere);

            // Moving Sphere, should be removed after edit done
            this.endSphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.05),
                new THREE.MeshBasicMaterial({ color: 0xff0000 })
            );
            this.endSphere.position.copy(point);
            this.meshGroup.add(this.endSphere);

            // if (!this.mesh2) return;
            // this.mesh2.position.copy(point);
            // this.mesh2.visible = true;

            this.floorHelper = new FloorHelper(
                this.sceneManager.scene, 
                'Wall', 
                point
            );

            if (!this.wallMesh) return;
            this.wallMesh.position.copy(point);
            this.wallMesh.visible = true;
        }
    }

    onPointerMove(choosenPoint: THREE.Vector3) {
        if (!this.mesh) return;

        if (this.isMoving) {
            const point = choosenPoint;
            const geometry = this.mesh.geometry as THREE.BufferGeometry;
            const position = geometry.getAttribute('position') as THREE.BufferAttribute;
            position.setXYZ(1, point.x, 0, point.z);
            position.needsUpdate = true;

            if (!this.endSphere) return;
            this.endSphere.position.copy(point);

            if (!this.floorHelper) return;
            this.floorHelper.updateHelper(point);

            if (!this.wallMesh) return;
            const angle = this.floorHelper.helperAngleLabel?.currentAngle;
            
            // INCREASE WALL LENGTH
            const wallStart = new THREE.Vector3(
                this.mesh.geometry.getAttribute('position').getX(0), 
                0, 
                this.mesh.geometry.getAttribute('position').getZ(0)
            );

            const wallLength = wallStart.distanceTo(point);
            const wallGeom = new THREE.BoxGeometry(wallLength, 0.5, 0.5);
            this.wallMesh.geometry = wallGeom;
            // OFFSET
            this.wallMesh.position.x = (wallStart.x + point.x) / 2;
            this.wallMesh.position.z = (wallStart.z + point.z) / 2;

            if (!this.wallEdge) return;
            const wallEdgeGeom = new THREE.EdgesGeometry(wallGeom);
            this.wallEdge.geometry.dispose();
            this.wallEdge.geometry.copy(wallEdgeGeom);
            this.wallEdge.position.copy(this.wallMesh.position);

            // ROTATION - OK
            if (angle) {
                if(this.getQuadrant() === 'SOUTH') {
                    this.wallMesh.rotation.y = -angle;
                } else {
                    this.wallMesh.rotation.y = angle;
                }
            }

            this.wallEdge.visible = true;
            this.wallEdge.rotation.y = this.wallMesh.rotation.y;
        }
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.isPlaced = true;
            this.isMoving = true;
            this.isEditDone = true;
            this.mesh?.removeFromParent();
            this.meshGroup.removeFromParent();
        }
    }

    dispose(): void {
        this.mesh?.removeFromParent();
        this.meshGroup.removeFromParent();
        this.floorHelper?.removeHelper();
    }
}