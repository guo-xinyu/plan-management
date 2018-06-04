import { Iterator } from '../../../../../design-pattern-character/iterator/Iterator.js';
import { CompositeData } from '../../model/composite-data/CompositeData.js';

class IteratorBfsCompositeData extends Iterator {
  constructor(iterateObj) {
    if (!(iterateObj instanceof CompositeData)) {
      throw new Error('IteratorBfsCompositeData用于迭代CompositeData對象。');
    }
    super(iterateObj);
    // this[compositeData] = iterateObj;
  }
  * [Symbol.iterator]() {}
}

export { IteratorBfsCompositeData };
