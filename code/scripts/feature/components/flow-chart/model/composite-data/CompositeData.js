import { Composite } from '../../../../../design-pattern-character/composite/Composite.js';

const type = Symbol();

class CompositeData extends Composite {
  constructor(data) {
    super(data);
    this[type] = 'modelData';
  }
  getType() {
    return this[type];
  }
}

export { CompositeData };
