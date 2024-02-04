import {
    Vector3,
    OrthographicCamera,
    WebGLRenderer,
    SphereGeometry,
    MeshBasicMaterial,
    Mesh,
    Group, Box3Helper,
    Box3,
    MathUtils,
    Quaternion,
    Euler
} from "three";
import {CSS2DObject, CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer.js";

export class twoDify{
    constructor(scene, camera, container)
    {
        this.mainScene = scene;
        this.playerCamera = camera;

        this.container = container;

        // this.orthoScene = new Scene();
        this.orthoCamera = this.createOrthoCamera();
        this.orthoRenderer = this.createOrthoRenderer();

        this.orthoLabelRenderer = new CSS2DRenderer();
        this.orthoLabelRenderer.setSize( this.container.clientWidth, this.container.clientHeight );
        this.orthoLabelRenderer.domElement.style.position = 'absolute';
        this.orthoLabelRenderer.domElement.style.top = '0';
        this.container.appendChild( this.orthoLabelRenderer.domElement );

        this.player = this.createPlayer();
        //this.rotatePlayer();

        this.startRendering();
    }

    createPlayer(){
        const wrapper = document.createElement('div');
        const labelDiv = document.createElement('div');
        labelDiv.setAttribute("id", "player-2dify");
        const htmlIcon = document.createElement("img");
        htmlIcon.src = "../resources/arrow.png";
        htmlIcon.style.width = "1.5rem";
        htmlIcon.style.height = "1.5rem";
        labelDiv.append(htmlIcon);
        labelDiv.classList.add("arrow-label");

        wrapper.appendChild(labelDiv);

        const labelObject = new CSS2DObject(wrapper);
        this.mainScene.add(labelObject);

        return labelObject;
    }

    rotatePlayer(){
        const playerDiv = this.player;
        playerDiv.element.style.transform = 'rotate(30deg)';
    }

    updateScene(scene){
        this.meshes = scene.children;
    }

    addMesh(mesh){
        this.mainScene.add(mesh);
    }

    createContainer(){
        console.log("Creating Container");
    }

    addMarker(){
        console.log("Adding marker");
    }

    createOrthoCamera(){
        const camera = new OrthographicCamera(
            -40,
            40,
            40,
            -40,
            0.1,
            10000
        );
        //camera.position.set(0, 0, 2);
        camera.rotation.x = 3 * Math.PI / 2;

        // this factor is important for LOD
        camera.position.set(0, 3, 0);

        camera.updateProjectionMatrix();
        return camera;
    }

    updateLOD() {
        camera.position.set(0, 20, 0);
    }

    createOrthoRenderer(){
        const renderer = new WebGLRenderer();
        renderer.setSize( this.container.clientWidth, this.container.clientHeight );
        renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );
        renderer.setClearColor( 0x000000, 0 );
        this.container.appendChild( renderer.domElement );
        renderer.clearColor('0xfffff');
        return renderer;
    }

    /**
     * When you want to generate a 2D view for a Section
     * @param {string} to The Lower Bound of the section
     * @param {string} from The Upper Bound of the section
     */
    generateViewForSection(to, from){

        // View should be refreshed when section is updated
    }

    /**
     * Navigate to the Specific Marker in the 3D View
     * @param {Marker} The Marker created
     */
    navigateToMarker(){

    }

    /**
     * Navigate to a specific point in the 3D View
     */
    navigateToPoint(){

    }

    /**
     * Create a Marker in the 3D View
     * @param {Vector3} point The point where the marker should be created
     * @param {string} icon The icon to be used for the marker
     */
    createMarker(point, icon){
        // same logic as createPlayer
    }

    startRendering(controls){
        // this.orthoCamera.position.copy( this.mainCamera.position );
        // this.orthoCamera.quaternion.copy( this.mainCamera.quaternion );
        if(this.playerCamera.position.y > 0) {
            this.player.position.set(this.playerCamera.position.x, -this.playerCamera.position.y, this.playerCamera.position.z);
        } else {
            this.player.position.set(this.playerCamera.position.x, this.playerCamera.position.y, this.playerCamera.position.z);
        }

        this.player.element.style.transition = 'transform 0.3s ease'; // Adjust the transition duration if needed

        if(document.getElementById("player-2dify")){
            const deg = -MathUtils.radToDeg(controls.getAzimuthalAngle());
            document.getElementById("player-2dify").style.transform = "rotate(" + deg + "deg)";
        }

        this.orthoRenderer.render(this.mainScene, this.orthoCamera);
        this.orthoLabelRenderer.render(this.mainScene, this.orthoCamera);
        // console.log(this.playerCamera.position);
    }

    moveTheCameraToFit(){
        let meshes = [];
        const meshGroup = new Group();
        this.mainScene.children.forEach((mesh) => {
            if(mesh.type === "Mesh" || mesh.type === "Group"){
                meshGroup.add(mesh.clone());
            }
        });
        meshGroup.visible = false;
        this.mainScene.add(meshGroup);

        const boundingBox = new Box3().setFromObject(meshGroup);
        const boxHelper = new Box3Helper(boundingBox, 0xff0000);
        this.mainScene.add(boxHelper);

        const center = boundingBox.getCenter(new Vector3());
        const size = boundingBox.getSize(new Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const cameraDistance = maxDim / (2 * Math.tan(this.orthoCamera.fov * (Math.PI / 180) / 2));

        this.orthoCamera.position.copy(center);

        if(size.x > size.y){
            this.orthoCamera.left = -size.x / 2;
            this.orthoCamera.right = size.x / 2;
            this.orthoCamera.top = size.x / 2;
            this.orthoCamera.bottom = -size.x / 2;
        } else{
            this.orthoCamera.left = -size.y / 2;
            this.orthoCamera.right = size.y / 2;
            this.orthoCamera.top = size.y / 2;
            this.orthoCamera.bottom = -size.y / 2;
        }

        this.orthoCamera.updateProjectionMatrix();
    }
}
