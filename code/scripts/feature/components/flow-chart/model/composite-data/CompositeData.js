import { Composite } from '../../../../../design-pattern-character/composite/Composite.js';

const userData = Symbol();

class CompositeData extends Composite {
  constructor(data) {
    if (data instanceof CompositeData) {
      // 複製構造函數
      super();
      return Object.assign(this, data);
    }
    super(data);
    // this.name = data.name;
    this[userData] = data;
  }
}

export { CompositeData };
