import { Visitor } from '../../../../../design-pattern-character/visitor/Visitor.js';
import { CompositeData } from '../../model/composite-data/CompositeData.js';

class VisitorModelComposite extends Visitor {
  constructor(action, referNode) {
    super(action);
    super.addExtendParam(referNode);
  }
  visit(composite) {
    if (!(composite instanceof CompositeData)) {
      throw new Error('本訪問者僅可訪問CompositeData的實例。');
    }
    return super.visit(composite);
  }
}

export { VisitorModelComposite };
