const id = Symbol();
const name = Symbol();
const entityData = Symbol();
// const adjacentVertices = Symbol();
const grade = Symbol();
const rank = Symbol();

class Composite {
  constructor(compositeName, data, gradeNum, rankNum) {
    this[id] = Math.random();
    this[name] = compositeName;
    // 在整個圖中的品秩（本頂點與根頂點的最短距離）
    this[grade] = gradeNum;
    // 班位（在品秩路徑（確定本頂點與根頂點最短距離的路徑）上的上前一頂點的所有鄰接頂點中，本頂點所排的序位）
    this[rank] = rankNum;
    // 葉子（leaf）
    this[entityData] = data;
    // 鄰接頂點
    this._adjacentVertices = [];
    this._visited = false;
    // this[adjacentVertices] = [];
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
  addAdjacentVertices(id, preId) {
    // if (typeof id !== 'symbol') {
    //   throw new Error('Composite的鄰接頂點鏈表僅可儲存Composite的id。');
    // }
    if (preId && typeof preId !== 'symbol') {
      throw new Error('請以數字指定鄰接頂點要插入的位置。');
    }
    const preIdIndex = this._adjacentVertices.findIndex(item => item === preId);
    if (preId && !~preIdIndex) {
      throw new Error('所指定的標的id非本頂點既有的鄰接頂點的id。');
    }
    this._adjacentVertices.splice(preIdIndex + 1, 0, id);
  }
  removeAdjacentVertexById(id) {
    if (!~this._adjacentVertices.findIndex(item => item === id)) {
      throw new Error('請以頂點的id切斷鄰接。');
    }
    this._adjacentVertices.filter(item => item !== id);
  }
  getAdjacentVertices() {
    return this._adjacentVertices;
  }
  _setVisiting(isVisited) {
    this._visited = isVisited;
  }
  getVisiting() {
    return this._visited;
  }
  accept(visitor) {
    // console.log(this);
    this._setVisiting(true);
    // console.log(this);
    return visitor.visit(this);
  }
  visitorLeaved() {
    this._setVisiting(false);
  }
}

export { Composite };
