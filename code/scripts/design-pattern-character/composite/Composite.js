const id = Symbol();
const name = Symbol();
const entityData = Symbol();
const children = Symbol();
const grade = Symbol();
const rank = Symbol();

class Composite {
  constructor(compositeName, data, gradeNum, rankNum) {
    this[id] = Symbol();
    this[name] = compositeName;
    // 在整個樹中的品秩
    this[grade] = gradeNum;
    // 在父節點下所有子節點中的班位
    this[rank] = rankNum;
    // 葉子（leaf）節點
    this[entityData] = data;
    // 子節點
    this[children] = [];
  }
  getId() {
    return this[id];
  }
  getName() {
    return this[name];
  }
  getEntityData() {
    return this[entityData];
  }
  setEntityData(toSetUserData) {
    this[entityData] = toSetUserData;
  }
  getGrade() {
    return this[grade];
  }
  getRank() {
    return this[rank];
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
  getChildren() {
    return this[children];
  }
  accept(visitor) {
    visitor.visit(this);
  }
}

export { Composite };
