import { Composite } from '../../../../../design-pattern-character/composite/Composite.js';

class CompositeData extends Composite {
  constructor(type, path, data, nameField, idNumber) {
    super(data);
    this.name = data[nameField];
    this.path = path;
    this.animatedSteps = 0;
    this.userData = data;
  }
  accept(visitor) {
    visitor.visit(this);
  }
}

export { CompositeData };
