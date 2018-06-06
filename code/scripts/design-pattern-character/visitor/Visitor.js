const action = Symbol();
const extendParams = Symbol();

class Visitor {
  constructor(oAction) {
    if (typeof oAction !== 'function') {
      throw new Error('Visitor的動作僅可爲函數。');
    }
    this[action] = oAction;
    this[extendParams] = [];
  }
  addExtendParam(param) {
    this[extendParams].push(param);
  }
  visit(data) {
    return this[action](data, ...this[extendParams]);
  }
}

export { Visitor };
