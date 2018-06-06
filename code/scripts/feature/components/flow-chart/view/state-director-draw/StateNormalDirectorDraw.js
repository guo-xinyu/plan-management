import { DecoratorCompositeDataViewData } from '../decorator/DecoratorCompositeDataViewData.js';
import { IteratorBfsCompositeData } from '../iterator-composite-data/IteratorBfsCompositeData.js';

class StateNormalDirectorDraw {
  build(data, draw) {
    let decoratorCompositeDataViewDatas = [];
    let iteratorBfsComposite = new IteratorBfsCompositeData(data);
    for (let composite of iteratorBfsComposite) {
      let referNode = data.find(value =>
        composite.getAdjacentVertices().includes(value.getId()) && value.getVisiting());
      if (referNode) {
        decoratorCompositeDataViewDatas.push(
          new DecoratorCompositeDataViewData(composite, draw(composite, referNode)));
      } else {
        decoratorCompositeDataViewDatas.push(new DecoratorCompositeDataViewData(composite, draw(composite)));
      }
    }
    return decoratorCompositeDataViewDatas;
  }
}

export { StateNormalDirectorDraw };
