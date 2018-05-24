import { Composite } from '../../../../../design-pattern-character/composite/Composite.js';

const userData = Symbol();

class CompositeData extends Composite {
  constructor(type, path, data, nameField, idNumber) {
    if (data instanceof CompositeData) {
      // 複製構造函數
      super();
      return Object.assign(this, data);
    }
    super(data);
    this.name = data[nameField];
    this.path = path;
    this.animatedSteps = 0;
    this[userData] = data;
  }
  addPath(toAddPath) {
    if (!(toAddPath instanceof Path2D)) {
      throw new Error('CompositeData的path僅接受Path2D類對象。');
    }
    this[userData].viewData.path.addPath(toAddPath);
  }
  getPath() {
    return this[userData].viewData.path;
  }
}

export { CompositeData };
