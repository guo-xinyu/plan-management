import { Composite } from '../../../../../design-pattern-character/composite/Composite.js';

const type = Symbol();
// “節點（node）”的班位
const nodeRank = Symbol();

class CompositeData extends Composite {
  constructor(name, data, gradeNum, rankNum, nodeRankNum) {
    super(name, data, gradeNum, rankNum);
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
