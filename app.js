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
import {EffectComposer} from "three/examples/jsm/postprocessing/effectComposer.js";
import {RenderPass} from "three/examples/jsm/postprocessing/renderPass.js";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass.js";
import {LuminosityShader} from "three/examples/jsm/shaders/LuminosityShader.js";
import {SobelOperatorShader} from "./shader/SobelColor.js";

export class twoDify{
    constructor(scene, camera)
    {
        this.lod = 2;
        this.views = [];

        this.mainScene = scene;
        this.playerCamera = camera;

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

    addMarker(point, icon){
        const labelDiv = document.createElement('div');
        const htmlIcon = document.createElement("p");
        htmlIcon.innerHTML = icon;
        htmlIcon.style.width = "1.5rem";
        htmlIcon.style.height = "1.5rem";
        labelDiv.append(htmlIcon);
        labelDiv.classList.add("example-label");
        const labelObject = new CSS2DObject(labelDiv);
        labelObject.position.set(point.x, point.y, point.z);
        this.mainScene.add(labelObject);
    }

    createOrthoCamera(viewType){
        const camera = new OrthographicCamera(
            0,
            0,
            0,
            0,
            0.1,
            10000
        );
        //camera.position.set(0, 0, 2);

        if(viewType === "top"){
            camera.rotation.x = 3 * Math.PI / 2;
            camera.position.set(0, 99, 0);
        }
        else if(viewType === "front"){
            camera.position.set(0, 0, 99);
        }

        camera.updateProjectionMatrix();
        return camera;
    }

    updateLOD(value) {
        this.lod = value;
        this.moveTheCameraToFit();
    }

    createOrthoRenderer(container){
        const renderer = new WebGLRenderer();
        renderer.setSize( container.clientWidth, container.clientHeight );
        renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );
        renderer.setClearColor( 0x000000, 0 );
        container.appendChild( renderer.domElement );
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
        // if(this.playerCamera.position.y > 0) {
        //     this.player.position.set(this.playerCamera.position.x, -this.playerCamera.position.y, this.playerCamera.position.z);
        // } else {
        //     this.player.position.set(this.playerCamera.position.x, this.playerCamera.position.y, this.playerCamera.position.z);
        // }

        this.views.forEach((view) => {
            const { camera, renderer, labelRenderer, composer, player } = view;

            if (this.playerCamera.position.y > 0) {
                camera.position.x = this.playerCamera.position.x;
                camera.position.z = this.playerCamera.position.z;
            } else {
                camera.position.x = this.playerCamera.position.x;
                camera.position.z = this.playerCamera.position.z;
            }

            if (this.playerCamera.position.y > 0) {
                player.position.set(this.playerCamera.position.x, -this.playerCamera.position.y, this.playerCamera.position.z);
            } else {
                player.position.set(this.playerCamera.position.x, this.playerCamera.position.y, this.playerCamera.position.z);
            }

            player.element.style.transition = 'transform 0.3s ease';

            if (document.getElementById("player-2dify")) {
                const deg = -MathUtils.radToDeg(controls.getAzimuthalAngle());
                document.getElementById("player-2dify").style.transform = "rotate(" + deg + "deg)";
            }

            renderer.render(this.mainScene, camera);
            labelRenderer.render(this.mainScene, camera);
            composer.render();
        });
    }

    moveTheCameraToFit(){
        this.views.forEach((view) => {
            const { camera } = view;

            let meshes = [];
            const meshGroup = new Group();

            this.mainScene.children.forEach((mesh) => {
                if (mesh.type === "Mesh" || mesh.type === "Group") {
                    meshGroup.add(mesh.clone());
                }
            });

            meshGroup.visible = false;
            this.mainScene.add(meshGroup);

            const boundingBox = new Box3().setFromObject(meshGroup);
            const boxHelper = new Box3Helper(boundingBox, 0xff0000);

            const center = boundingBox.getCenter(new Vector3());
            const size = boundingBox.getSize(new Vector3());

            const maxDim = Math.max(size.x, size.y, size.z);
            const cameraDistance = maxDim / (2 * Math.tan(camera.fov * (Math.PI / 180) / 2));

            camera.position.copy(center);

            if (size.x > size.z) {
                camera.left = -size.x / this.lod;
                camera.right = size.x / this.lod;
                camera.top = size.x / this.lod;
                camera.bottom = -size.x / this.lod;
            } else {
                camera.left = -size.z / this.lod;
                camera.right = size.z / this.lod;
                camera.top = size.z / this.lod;
                camera.bottom = -size.z / this.lod;
            }

            camera.updateProjectionMatrix();
        });
    }


    createNewView(container, viewType) {
        const newOrthoCamera = this.createOrthoCamera(viewType);
        const newOrthoRenderer = this.createOrthoRenderer(container);
        const newOrthoLabelRenderer = new CSS2DRenderer();
        newOrthoLabelRenderer.setSize(container.clientWidth, container.clientHeight);
        newOrthoLabelRenderer.domElement.style.position = 'absolute';
        newOrthoLabelRenderer.domElement.style.top = '0';
        container.appendChild(newOrthoLabelRenderer.domElement);

        const newComposer = new EffectComposer(newOrthoRenderer);
        const newRenderPass = new RenderPass(this.mainScene, newOrthoCamera);
        newComposer.addPass(newRenderPass);

        const newEffectGrayScale = new ShaderPass(LuminosityShader);
        newComposer.addPass(newEffectGrayScale);

        const newEffectSobel = new ShaderPass(SobelOperatorShader);
        newEffectSobel.uniforms['resolution'].value.x = container.clientWidth * window.devicePixelRatio;
        newEffectSobel.uniforms['resolution'].value.y = container.clientHeight * window.devicePixelRatio;
        newComposer.addPass(newEffectSobel);

        const newPlayer = this.createPlayer();
        this.mainScene.add(newPlayer);

        const newOrthoCameraPosition = new Vector3().copy(this.playerCamera.position);
        newOrthoCamera.position.copy(newOrthoCameraPosition);

        this.views.push({
            id: container.id,
            camera: newOrthoCamera,
            renderer: newOrthoRenderer,
            labelRenderer: newOrthoLabelRenderer,
            composer: newComposer,
            player: newPlayer
        });

        return {
            camera: newOrthoCamera,
            renderer: newOrthoRenderer,
            labelRenderer: newOrthoLabelRenderer,
            composer: newComposer,
            player: newPlayer
        };
    }

    setLineColor(color){
        this.views.forEach((view) => {
            const { composer } = view;
            composer.passes[2].uniforms['lineColor'].value.set(color);
        });
    }

    setBackgroundColor(color){
        this.views.forEach((view) => {
            const { composer } = view;
            composer.passes[2].uniforms['backgroundColor'].value.set(color);
        });
    }
}
