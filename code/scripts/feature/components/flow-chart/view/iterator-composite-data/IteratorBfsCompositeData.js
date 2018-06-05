import { Iterator } from '../../../../../design-pattern-character/iterator/Iterator.js';
import { CompositeData } from '../../model/composite-data/CompositeData.js';

function * bfsGraph(vertices, composites) {
  let adjacentVertices = [];
  const thisGradeComposites = composites.filter(value => vertices.includes(value.getId()));
  for (let composite of thisGradeComposites) {
    if (!composite.getVisited()) {
      adjacentVertices.push(...composite.getAdjacentVertices());
      yield composite;
    }
  }
  if (adjacentVertices.length >= 1) {
    yield * bfsGraph(adjacentVertices, composites);
  }
}

class IteratorBfsCompositeData extends Iterator {
  constructor(iterateObjArray) {
    const err = Error('IteratorBfsCompositeData用于迭代CompositeData的數組對象。');
    if (!(iterateObjArray instanceof Array)) {
      throw err;
    }
    for (let iterateObj of iterateObjArray) {
      if (!(iterateObj instanceof CompositeData)) {
        throw err;
      }
    }
    super(iterateObjArray);
    // this[compositeData] = iterateObj;
  }
  * [Symbol.iterator]() {
    const vertices = super.getData();
    yield vertices[0];
    yield * bfsGraph(vertices[0].getAdjacentVertices(), vertices);
    for (let vertex of vertices) {
      vertex.setVisited(false);
    }
  }
}

export { IteratorBfsCompositeData };
