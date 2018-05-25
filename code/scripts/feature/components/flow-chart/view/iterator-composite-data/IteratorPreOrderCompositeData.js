import { Iterator } from '../../../../../design-pattern-character/iterator/Iterator.js';
import { CompositeData } from '../../model/composite-data/CompositeData.js';

// const compositeData = Symbol();

class IteratorPreOrderCompositeData extends Iterator {
  constructor(iterateObj) {
    if (!(iterateObj instanceof CompositeData)) {
      throw new Error('IteratorPreOrderCompositeData用于迭代CompositeData對象。');
    }
    super(iterateObj);
    // this[compositeData] = iterateObj;
  }
  * [Symbol.iterator]() {
    // const toIterateData = this.getData();
    // while (true) {
    //   yield toIterateData;
    //   for (let singleData of toIterateData.getChildren()) {
    //     yield singleData;
    //   }
    //   break;
    // }
  }
}

export { IteratorPreOrderCompositeData };
