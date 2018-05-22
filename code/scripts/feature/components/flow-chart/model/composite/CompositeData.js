class CompositeData {
  constructor(type, path, data, nameField, idNumber) {
    this.id = `${type}_${idNumber}`;
    this.type = type;
    this.name = data[nameField];
    this.path = path;
    this.animatedSteps = 0;
    this.userData = data;
    this.children = [];
  }
  addChild(child) {
    if (!(child instanceof CompositeData)) {
      throw new Error('CompositeData.children僅可包含CompositeData的實例。');
    }
    this.children.push(child);
  }
  addPath(path) {
    this.path.addPath(path);
  }
  accept(visitor) {
    visitor.visit(this);
  }
}

export { CompositeData };
