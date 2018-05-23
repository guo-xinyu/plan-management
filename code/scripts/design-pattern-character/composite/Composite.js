const id = Symbol();
const name = Symbol();
const userData = Symbol();
const children = Symbol();

class Composite {
  constructor(data) {
    this[id] = Symbol();
    this[name] = data.name;
    // 葉子（leaf）節點
    this[userData] = data;
    // 子節點
    this[children] = [];
  }
  getId() {
    return this[id];
  }
  getName() {
    return this[name];
  }
  getUserData() {
    return this[userData];
  }
  setUserData(toSetUserData) {
    this[userData] = toSetUserData;
  }
  addChild(child) {
    if (!(child instanceof Composite)) {
      throw new Error('Composite.children僅可包含CompositeData的實例。');
    }
    this[children].push(child);
  }
  removeChildById(id) {
    if (!this[children].find(item => item.id === id)) {
      throw new Error('請用該子節點的id删除該節點。');
    }
    this[children].filter(item => item.id !== id);
  }
  accept(visitor) {
    visitor.visit(this);
  }
}

export { Composite };
