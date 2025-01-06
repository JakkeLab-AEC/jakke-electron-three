import React, { useRef } from "react"
import { ButtonPositive } from "@/rendererArea/view/component/buttons/buttonPositive"
import { SceneController } from "@/rendererArea/api/three/SceneController"
import * as THREE from 'three';


export const SidebarSamplePage = () => {
    const xCoordRef = useRef<HTMLInputElement>(null);
    const yCoordRef = useRef<HTMLInputElement>(null);
    const zCoordRef = useRef<HTMLInputElement>(null);
    const showObjectsOnCoordinate = () => {
        const geometry = new THREE.SphereGeometry(0.25, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
        const obj1 = new THREE.Mesh(geometry, material);
        
        const xCoord = xCoordRef.current? parseFloat(xCoordRef.current.value) : 0;
        const yCoord = yCoordRef.current? parseFloat(yCoordRef.current.value) : 0;
        const zCoord = zCoordRef.current? parseFloat(zCoordRef.current.value) : 0;
        obj1.position.set(xCoord, yCoord, zCoord);

        SceneController.getInstance().addObjects([obj1]);
    }

    return (
        <div>
            <div>
                Coordinate Test
            </div>
            <div className="flex flex-row gap-2">
                <span>X : <input className="border w-[40px]" ref={xCoordRef} type="number" defaultValue={0}/></span>
                <span>Y : <input className="border w-[40px]" ref={yCoordRef} type="number" defaultValue={0}/></span>
                <span>Z : <input className="border w-[40px]" ref={zCoordRef} type="number" defaultValue={0}/></span>
                <ButtonPositive text={"Add"} isEnabled={true} onClickHandler={showObjectsOnCoordinate} width={40}/>
            </div>
        </div>
    )
}
