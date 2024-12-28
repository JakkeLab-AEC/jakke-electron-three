import * as THREE from 'three';
import { SceneController } from "../SceneController";

export class ViewportControlService {
    constructor(sceneController: SceneController) {
        this.sceneController = sceneController;
    }

    private sceneController: SceneController;

    resetCamera = () => {
         // Remove the event listener temporarily
        this.sceneController.controls.removeEventListener('change', this.updateCameraPlane);

        const boundingBox = new THREE.Box3();
        const camera = this.sceneController.getCamera() as THREE.OrthographicCamera;

        // Calculate bounding box for the scene
        const targetObjects:Array<THREE.Object3D> = [];
        this.sceneController.getScene().traverse(object => {
            if (object.userData['modelCreatedFrom'] === 'CommonLandApp') {
                targetObjects.push(object);
            }
        });

        if (targetObjects.length === 0) {
            this.sceneController.controls.addEventListener('change', this.updateCameraPlane);
            return;
        }

        targetObjects.forEach(object => boundingBox.expandByObject(object));

        const min = boundingBox.min;
        const max = boundingBox.max;

        // Calculate camera positions and lookAt direction
        const directionMinToMax = max.clone().sub(min).normalize();
        const cameraCenter = max.clone().add(directionMinToMax.clone().multiplyScalar(10));
        const cameraLookAt = min.clone();
        const yAdd = max.y - min.y;

        // Set camera's position and look at the target
        camera.position.set(cameraCenter.x, cameraCenter.y + yAdd, cameraCenter.z);
        camera.lookAt(cameraLookAt);

        // Update camera's near and far planes
        camera.near = 0.1;
        camera.far = cameraCenter.distanceTo(cameraLookAt) + 2000;
        camera.updateProjectionMatrix();

        // Set the OrbitControls target to the new camera lookAt point
        this.sceneController.controls.target.copy(cameraLookAt);
        this.sceneController.controls.update();

        // Apply changes and restore the event listener
        this.sceneController.setCamera(camera);
        this.sceneController.render();
        this.sceneController.controls.addEventListener('change', this.updateCameraPlane);
    }

    updateCameraPlane = () => {
        const boundingBox = new THREE.Box3();
    
        // Calculate bounding box for the scene
        boundingBox.setFromObject(this.sceneController.getScene());
    
        const min = boundingBox.min;
        const max = boundingBox.max;
    
        // Calculate direction and distances for near/far adjustments
        const directionMinToMax = max.clone().sub(min).normalize();
    
        // Use the current camera position as the center, lookAt point as calculated
        const camera = this.sceneController.getCamera() as THREE.OrthographicCamera;
        const renderer = this.sceneController.getRenderer();
        
        // Adjust near and far planes
        camera.near = 0.1;
        camera.far = camera.position.distanceTo(max.clone().sub(directionMinToMax.clone().multiplyScalar(10))) + 2000;
        camera.updateProjectionMatrix();
    
        renderer.render(this.sceneController.getScene(), camera);
    }
}