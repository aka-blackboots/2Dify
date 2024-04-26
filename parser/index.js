class Tridify {
  constructor(scene) {
    this.scene = scene;

    this.init();
  }

  init() {
    this.geometryKernel = new GeometryKernel();
  }

  createWall() {
    const wall = new this.geometryKernel.Wall(0, 0, 0, 10, 10, 10);
    this.scene.add(wall);
    return wall;
  }
}