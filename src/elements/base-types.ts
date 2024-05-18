import * as THREE from "three";
import { twoDElement } from "./twoDElement";

export type FloorElement = "Wall" | "Door" | "Window" | "Chair" | "Table" | "Bed" | "Sofa";

export interface IFloorElement {
  id: string;
  type: FloorElement;
  mesh: THREE.Mesh | THREE.Line | undefined;
  element?: twoDElement;
  virtualMesh?: THREE.Mesh | THREE.Line | undefined;
}