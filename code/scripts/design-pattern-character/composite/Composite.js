class Composite {
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
    if (!(child instanceof Composite)) {
      let err = new Error('Composite.children僅可包含CompositeData的實例。');
      throw err;
    }
    this.children.push(child);
  }
  removeChildById(id) {

  }
  accept(visitor) {
    visitor.visit(this);
  }
}

export { Composite };
