import { Composite } from '../../../../../design-pattern-character/composite/Composite.js';

const type = Symbol();
// “節點（node）”的班位
const nodeRank = Symbol();

class CompositeData extends Composite {
  constructor(data, nodeRankNum) {
    super(data);
    this[type] = 'modelData';
    this[nodeRank] = nodeRankNum;
  }
  getType() {
    return this[type];
  }
  getNodeRank() {
    return this[nodeRank];
  }
}

export { CompositeData };
